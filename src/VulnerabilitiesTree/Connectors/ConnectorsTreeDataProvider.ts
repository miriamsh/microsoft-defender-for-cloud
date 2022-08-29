import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { Constants } from '../../Constants';
import { connectorsFiltering } from "../../Commands/FilterVulnerabilities";
import { TreeUtils } from "../../Utility/TreeUtils";
import { getConfigurationSettings } from "../../Utility/ConfigUtils";
import { CloudProviderTreeItem } from './CloudProviderTreeItem';
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/ConnectorOfferings.enum";
import { ConnectorTreeItem } from "./ConnectorTreeItem";
import { SecurityConnector } from "./SecurityConnector.type";
import { SecurityCenter } from "@azure/arm-security";
import { Connectors } from "./ConnectorModel";


export class ConnectorsTreeDataProvider extends AzExtParentTreeItem {

    label: string;
    private _children: CloudProviderTreeItem[] = [];
    private _client: SecurityCenter;
    private _apiUrl: string[] = [];
    public model: any[]=[new Connectors() ];
    constructor(label: string, parent: AzExtParentTreeItem, client: SecurityCenter) {
        super(parent);
        this.label = label;
        this._client = client;
        this.iconPath = TreeUtils.getIconPath(Constants.connectorIcon);
        this._apiUrl.push(Constants.getConnectorListPath(this.subscription.subscriptionId));

    }
    public get apiUrl(): string[] {
        return this._apiUrl;
    }
    public set apiUrl(apiUrl: string[]) {
        this._apiUrl = apiUrl;
    }
    public readonly contextValue: string = 'securityCenter.connectors';

    public get children(): CloudProviderTreeItem[] {
        return this._children;
    }

    public async loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {

        if (this._children.length === 0) {

            const awsConnector = new CloudProviderTreeItem("AWS", this);
            const azureConnector = new CloudProviderTreeItem("Azure", this);
            const githubConnector = new CloudProviderTreeItem("Github", this);
            const gcpConnector = new CloudProviderTreeItem("GCP", this);

            const data = (await this._client.securityConnectors.list().byPage().next()).value;
            data.map((connector: SecurityConnector) => {
                const parameters = new URLParameters(connector.id);
                if (connector.cloudName === 'AWS') {
                    awsConnector.appendChild(new ConnectorTreeItem(connector.name, connector.offerings, Object.keys(AWSOfferings), awsConnector, connector.id,parameters.getResourceGroupName()));
                }
                else if (connector.cloudName === 'GCP') {
                    gcpConnector.appendChild(new ConnectorTreeItem(connector.name, connector.offerings, Object.keys(GCPOfferings), gcpConnector, connector.id,parameters.getResourceGroupName()));
                }
                else {
                    githubConnector.appendChild(new ConnectorTreeItem(connector.name, connector.offerings, Object.keys(GithubOfferings), githubConnector, connector.id,parameters.getResourceGroupName()));
                }
            });

            this._children = [awsConnector, azureConnector, gcpConnector, githubConnector];
        }
        return connectorsFiltering((await getConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId)), this.children);
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }

}
export class URLParameters {
    private url: string;
    private startResourceGroup: string = "resourcegroups/";
    private endResourceGroup: string = "/providers";
    constructor(url: string) {
        this.url = url;
    }

    public getResourceGroupName(): string {
        const start = this.url.indexOf(this.startResourceGroup);
        const end = this.url.indexOf(this.endResourceGroup);
        return this.url.slice(start + this.startResourceGroup.length, end);
    }

}