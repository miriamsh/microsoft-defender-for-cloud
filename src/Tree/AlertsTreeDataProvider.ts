import { Alerts, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { ResourceTreeItem } from "./ResourceTreeItem";
import { alertIcon } from "../constants";
import { AlertTreeItem } from "./AlertTreeItem";

export class AlertsTreeDataProvider extends AzExtParentTreeItem {
	private readonly alerts: Alerts;
	private children: AlertTreeItem[] = [];
	private client!: SecurityCenter;
	public label: string;

	constructor(label: string, parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
		this.alerts = this.client.alerts;
		this.iconPath = alertIcon;
	}

	public readonly contextValue: string = 'securityCenter.alerts';

	public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {

		let value = await (await this.client.alerts.list().byPage().next()).value;
		for (let item of value) {
			this.children.push(new AlertTreeItem("Alert", item.alertDisplayName, item.severity, item.status, this));
		}
		return this.children;
	}

	public hasMoreChildrenImpl(): boolean {

		return false;
	}
}