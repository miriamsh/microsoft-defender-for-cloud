import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { AlertTreeItem } from "./AlertTreeItem";

export class AffectedResourceTreeItem extends AzExtParentTreeItem {
	public label: string;

	private _children: AlertTreeItem[] = [];

	private _title: string;

	constructor(label: string, parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this._title = label;
	}

	public readonly contextValue: string = 'securityCenter.securityAlerts.affected-resources';

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
		this.label = `${this._title} (${this._children.length})`;
		return this._children;
	}

	public hasMoreChildrenImpl(): boolean {
		return false;
	}
}