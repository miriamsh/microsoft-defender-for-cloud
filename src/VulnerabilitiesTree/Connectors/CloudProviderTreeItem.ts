import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { Constants } from '../../Constants';
import { ConnectorTreeItem } from "./ConnectorTreeItem";
import { TreeUtils } from "../../Utility/TreeUtils";
import { ConnectorFilter } from "./ConnectorFilter";
import { Connectors } from "./ConnectorModel";


export class CloudProviderTreeItem extends AzExtParentTreeItem {

    label: string;
    private _children: ConnectorTreeItem[] = [];
    public cloudProvider: string;
    private _title: string;
    private _apiUrl: string[]=[];
    public filter!: ConnectorFilter;
    public model:any[]=[new Connectors()] ;

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this._title = label;
        this.label = label;
        this.cloudProvider = label;
        this.iconPath = TreeUtils.getIconPath(Constants.cloudConnector);
        this._apiUrl.push( Constants.getConnectorListPath(this.subscription.subscriptionId));
        this.filter = new ConnectorFilter();
        this.filter.properties!['environmentName']=this.label;
    }

    public readonly contextValue: string = 'securityCenter.connectors.cloudProvider';
    public get apiUrl(): string[] {
        return this._apiUrl;
    }
    public set apiUrl(apiUrl: string[]) {
        this._apiUrl = apiUrl;
    }
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