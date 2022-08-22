import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { Constants } from '../../constants';
import { connectorsFiltering } from "../../Commands/filterVulnerabilities";
import { TreeUtils } from "../../Utility/treeUtils";
import { getConfigurationSettings } from "../../Utility/configUtils";
import { CloudProviderTreeItem } from './CloudProviderTreeItem';
import axios from "axios";
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/connectorOfferings.enum";
import { ConnectorTreeItem } from "./ConnectorTreeItem";


export class ConnectorsTreeDataProvider extends AzExtParentTreeItem {

    label: string;
    private _children: CloudProviderTreeItem[] = [];

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
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

            const token = await this.subscription.credentials.getToken();

            await axios.get(
                Constants.getConnectorsList(this.subscription.subscriptionId),{
                headers: {
                    'authorization': `Bearer ${token.accessToken}`
                }
            }
            ).then(request => {
                const connectorList = request.data.value;
                connectorList.map((connector: { "environmentName": string, "name": string, "offerings": { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[] }) => {
                    if (connector.environmentName === 'AWS') {
                        awsConnector.appendChild(new ConnectorTreeItem(connector.name!, connector.offerings, Object.keys(AWSOfferings), awsConnector));
                    }
                    else if (connector.environmentName === 'GCP') {
                        gcpConnector.appendChild(new ConnectorTreeItem(connector.name!, connector.offerings, Object.keys(GCPOfferings), gcpConnector));
                    }
                    else {
                        githubConnector.appendChild(new ConnectorTreeItem(connector.name!, connector.offerings, Object.keys(GithubOfferings), githubConnector));
                    }
                });
            });

            this._children = [awsConnector, azureConnector, gcpConnector, githubConnector];

        }
        return connectorsFiltering((await getConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId)), this.children);
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }

}