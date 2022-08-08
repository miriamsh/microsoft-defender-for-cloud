import { Connectors, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { ResourceTreeItem } from "./ResourceTreeItem";
import { Constants } from '../constants';
import { ConnectorTreeItem } from "./ConnectorTreeItem";
import { connectorsFiltering } from "../Commands/FilterCommand";
import { SubscriptionTreeItem } from "./SubscriptionTreeItem";
import { TreeUtils } from "../Utility/treeUtils";


export class ConnectorsTreeDataProvider extends AzExtParentTreeItem {

    private readonly connectors: Connectors;
    readonly label: string;
    private client!: SecurityCenter;
    public context!: IActionContext;
    private children: ConnectorTreeItem[] = [];

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.connectors = this.client.connectors;
        this.iconPath =  TreeUtils.getIconPath(Constants.connectorIcon);
    }

    public readonly contextValue: string = 'securityCenter.connectors';

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        this.context = context;
        if (this.children.length === 0) {
            const value = await (await this.client.connectors.list().byPage().next()).value;
            for (let item of value) {
                this.children.push(new ConnectorTreeItem("Connector", item.name!, item.cloudProvider, this));
            }
        }
        return connectorsFiltering((this.parent as SubscriptionTreeItem).filteringSettings, this.children);
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }
}