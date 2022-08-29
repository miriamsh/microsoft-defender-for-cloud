import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from "../../constants";
import { AlertFilter } from "./AlertFilter";
import { Alerts } from "./AlertModel";
import { AlertTreeItem } from "./AlertTreeItem";

export class AffectedResourceTreeItem extends AzExtParentTreeItem {
	public label: string;

	private _children: AlertTreeItem[] = [];

	private _title: string;

	private _apiUrl: string[]=[];

	public filter!: AlertFilter;

	public model:any[]=[new Alerts()];

	constructor(label: string, parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this._title = label;
		this._apiUrl.push(Constants.getAlertListPath(this.subscription.subscriptionId));
		this.filter = new AlertFilter();
		this.filter.properties!['compromisedEntity'] = label;
	}

	public readonly contextValue: string = 'securityCenter.securityAlerts.affectedResources';

	public get apiUrl(): string[] {
		return this._apiUrl;
	}
	public set apiUrl(apiUrl: string[]) {
		this._apiUrl = apiUrl;
	}
	public get children(): AlertTreeItem[] {
		return this._children;
	}
	public set children(v: AlertTreeItem[]) {
		this._children = v;
	}

	public appendChildren(child: AlertTreeItem) {
		this.children ? this.children.push(child) : this._children = [child];
	}

	public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
	    //this.label = `${this._title} (${this._children.length})`;
		return this._children;
	}

	public hasMoreChildrenImpl(): boolean {
		return false;
	}
}