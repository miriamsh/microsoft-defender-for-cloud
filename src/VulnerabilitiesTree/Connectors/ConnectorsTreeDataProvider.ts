import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { Constants } from '../../constants';
import { connectorsFiltering } from "../../Commands/FilterVulnerabilities";
import { TreeUtils } from "../../Utility/TreeUtils";
import { getConfigurationSettings } from "../../Utility/ConfigUtils";
import { CloudProviderTreeItem } from './CloudProviderTreeItem';
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/connectorOfferings.enum";
import { ConnectorTreeItem } from "./ConnectorTreeItem";
import { SecurityConnector } from "./SecurityConnector.type";
import { SecurityCenter } from "@azure/arm-security";


export class ConnectorsTreeDataProvider extends AzExtParentTreeItem {

    label: string;
    private _children: CloudProviderTreeItem[] = [];
    private _client: SecurityCenter;

    constructor(label: string, parent: AzExtParentTreeItem, client: SecurityCenter) {
        super(parent);
        this.label = label;
        this._client = client;
        this.iconPath = TreeUtils.getIconPath(Constants.connectorIcon);
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
                if (connector.properties.environmentName === 'AWS') {
                    awsConnector.appendChild(new ConnectorTreeItem(connector.name, connector.properties.offerings, Object.keys(AWSOfferings), awsConnector, connector.id));
                }
                else if (connector.properties.environmentName === 'GCP') {
                    gcpConnector.appendChild(new ConnectorTreeItem(connector.name, connector.properties.offerings, Object.keys(GCPOfferings), gcpConnector, connector.id));
                }
                else {
                    githubConnector.appendChild(new ConnectorTreeItem(connector.name, connector.properties.offerings, Object.keys(GithubOfferings), githubConnector, connector.id));
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