import { SecurityCenter, SecurityConnector } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from '../../constants';
import { connectorsFiltering } from "../../Commands/filterVulnerabilities";
import { TreeUtils } from "../../Utility/treeUtils";
import { getConfigurationSettings } from "../../Utility/configUtils";
import { CloudProviderTreeItem} from './CloudProviderTreeItem';
import axios from "axios";
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/connectorOfferings.enum";
import { ConnectorTreeItem } from "./ConnectorTreeItem";


export class ConnectorsTreeDataProvider extends AzExtParentTreeItem {

    label: string;
    private client!: SecurityCenter;
    private children: CloudProviderTreeItem[] = [];

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
        this.iconPath = TreeUtils.getIconPath(Constants.connectorIcon);
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }

    public readonly contextValue: string = 'securityCenter.connectors';

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {

        if (this.children.length === 0) {

            const awsConnector = new CloudProviderTreeItem("AWS", this);
            const azureConnector = new CloudProviderTreeItem("Azure", this);
            const githubConnector = new CloudProviderTreeItem("Github", this);
            const gcpConnector = new CloudProviderTreeItem("GCP", this);

            const token = await this.subscription.credentials.getToken();

             const connectorList = await axios.get(
                `https://management.azure.com/subscriptions/${this.subscription.subscriptionId}/providers/Microsoft.Security/securityConnectors?api-version=2021-12-01-preview`, {
                headers: {
                    'authorization': `Bearer ${token.accessToken}`
                }
            }
            ).then(request => {
                const connectorList = request.data.value;
                connectorList.map((connector: { "environmentName": string, "name": string, "offerings": { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[] }) => {
                    if (connector.environmentName === 'AWS') {
                        awsConnector.appendChild(new ConnectorTreeItem(connector.name!, connector.offerings,Object.keys(AWSOfferings), awsConnector));
                    }
                    else if (connector.environmentName === 'GCP') {
                        gcpConnector.appendChild(new ConnectorTreeItem(connector.name!, connector.offerings, Object.keys(GCPOfferings),gcpConnector));
                    }
                    else {
                        githubConnector.appendChild(new ConnectorTreeItem(connector.name!, connector.offerings, Object.keys(GithubOfferings), githubConnector));
                    }
                });
            });

            this.children = [awsConnector, azureConnector, gcpConnector, githubConnector];

        }
        return connectorsFiltering(getConfigurationSettings(Constants.extensionPrefix, Constants.filtering)[this.subscription.subscriptionId], this.children);
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }


}