import { Connectors, ConnectorsGetResponse, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { ResourceTreeItem } from "../ResourceTreeItem";
import { Constants } from '../../constants';
import { ConnectorTreeItem } from "./ConnectorTreeItem";
// import { connectorsFiltering } from "../Commands/FilterCommand";
import { TreeUtils } from "../../Utility/treeUtils";


export class CloudProviderTreeItem extends AzExtParentTreeItem {
   
    label: string;
    protected client!: SecurityCenter;
    protected children: ConnectorTreeItem[] = [];
    public cloudProvider: string;
    protected readonly title: string;

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.title = label;
        this.label = label;
        this.cloudProvider = label;
        this.iconPath = TreeUtils.getIconPath(Constants.cloudConnector);
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }

    public appendChild(child:ConnectorTreeItem){
       this.children.push(child);
    }

    public loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {
         return Promise.resolve(this.children);
    }

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public readonly contextValue: string = 'securityCenter.connectors.cloudProvider';

}