import { Connectors, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { ResourceTreeItem } from "./ResourceTreeItem";
import { connectorIcon } from '../constants';
import { ConnectorTreeItem } from "./ConnectorTreeItem";


export class ConnectorsTreeDataProvider extends AzExtParentTreeItem {

    private readonly connectors: Connectors;
    readonly label: string;
    private client!: SecurityCenter;
    private children:ConnectorTreeItem[]=[];

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.connectors = this.client.connectors;
        this.iconPath = connectorIcon;
    }

    public readonly contextValue: string = 'securityCenter.connectors';

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        let value = await (await this.client.connectors.list().byPage().next()).value;
		for (let item of value) {
			this.children.push(new ConnectorTreeItem("Connector", item.name!,item.cloudProvider,this));
		}

		return this.children;
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }
}