import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { Constants } from '../../constants';
import { ConnectorTreeItem } from "./ConnectorTreeItem";
import { TreeUtils } from "../../Utility/TreeUtils";


export class CloudProviderTreeItem extends AzExtParentTreeItem {

    label: string;
    private _children: ConnectorTreeItem[] = [];
    public cloudProvider: string;
    private _title: string;

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this._title = label;
        this.label = label;
        this.cloudProvider = label;
        this.iconPath = TreeUtils.getIconPath(Constants.cloudConnector);
    }

    public readonly contextValue: string = 'securityCenter.connectors.cloudProvider';

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {
        this.suppressMaskLabel=true;
        this.label = `${this._title} (${this._children.length})`;
        return Promise.resolve(this._children);
    }

    public appendChild(child: ConnectorTreeItem) {
        this._children.push(child);
    }

}