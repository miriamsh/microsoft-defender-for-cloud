import { Alerts, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { ResourceTreeItem } from "./ResourceTreeItem";
import { Constants } from "../constants";
import { alertsFiltering } from "../Commands/filterVulnerabilities";
import { SubscriptionTreeItem } from "./SubscriptionTreeItem";
import { TreeUtils } from "../Utility/treeUtils";
import { getConfigurationSettings } from "../Utility/configUtils";
import { AlertTreeItem } from "./Security Alerts/AlertTreeItem";

export class AlertsTreeDataProvider extends AzExtParentTreeItem {
 	private children: AlertTreeItem[] = [];
	private client!: SecurityCenter;
	public context!: IActionContext;
	public label: string;

	constructor(label: string, parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
		this.iconPath =  TreeUtils.getIconPath(Constants.alertIcon);
 	}

	public readonly contextValue: string = 'securityCenter.alerts';

	public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
		this.context = context;
		if (this.children.length === 0) {
			const value = await (await this.client.alerts.list().byPage().next()).value;
			for (let item of value) {
				this.children.push(new AlertTreeItem("Alert", item.alertDisplayName, item.severity, item.status, this));
			}
		}
		return alertsFiltering(getConfigurationSettings(Constants.extensionPrefix,Constants.filtering)[this.subscription.subscriptionId], this.children);
	}

	public hasMoreChildrenImpl(): boolean {

		return false;
	}
}
// import { Alert, Alerts, SecurityCenter } from "@azure/arm-security";
// import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
// import { AlertResourceTreeItem } from "./AlertResourceTreeItem";
// import { alertIcon } from "../constants";
// import { AlertTreeItem } from "./AlertTreeItem";
// import { alertsFiltering } from "../Commands/FilterCommand";
// import { SubscriptionTreeItem } from "./SubscriptionTreeItem";

// export class AlertsTreeDataProvider extends AzExtParentTreeItem {
// 	public children: Map<string, AlertResourceTreeItem> | undefined = new Map<string, AlertResourceTreeItem>();
// 	private client!: SecurityCenter;
// 	public label: string;

// 	constructor(label: string, parent: AzExtParentTreeItem) {
// 		super(parent);
// 		this.label = label;
// 		this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
// 		this.iconPath =  TreeUtils.getIconPath(Constants.alertIcon);

// 	}

// 	public readonly contextValue: string = 'securityCenter.alerts';


// 	public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
// 		if (this.children?.size=== 0) {
// 			const alerts = await (await this.client.alerts.list().byPage().next()).value;
// 			let resource: AlertResourceTreeItem | undefined;
// 			alerts.map((alert:Alert)=>{
// 				const parameters=new URLParameters(alert.alertUri!);
// 				resource = this.children!.get(alert.compromisedEntity!);
// 				if (resource === undefined) {
// 					resource = new AlertResourceTreeItem("Alert Resource", alert.compromisedEntity!, undefined, this);
// 				}
// 				const alertItem = new AlertTreeItem( alert.alertDisplayName!, alert.severity!, alert.status!, resource, JSON.stringify(alert), alert.name!, parameters.getResourceGroupName(), parameters.getLocation(),alert.entities!,alert.alertUri!,alert.id!);
// 				resource.addChildren(alertItem);
// 				this.children!.set(alert.compromisedEntity!, resource!);
// 			});		
// 		}
// 		const filteredAlertsResource: AlertResourceTreeItem[] = [];
// 		this.children!.forEach((resource, type) => {
// 			const alertResourceFilteringChildren = alertsFiltering((this.parent as SubscriptionTreeItem).filteringSettings, resource.getChildren()!);
// 			if (alertResourceFilteringChildren) {
// 				const updateResource = resource;
// 				updateResource.setChildren(alertResourceFilteringChildren);
// 				filteredAlertsResource.push(updateResource);
// 			}
// 		});
// 		return filteredAlertsResource;
// 	}

// 	public hasMoreChildrenImpl(): boolean {
// 		return false;
// 	}

// }

export class URLParameters {

	private url: string;
	private location: string = "location/";
	private startResourceGroup: string = "resourceGroup/";
	private endResourceGroup: string = "/referencedFrom";
	constructor(url: string) {
		this.url = url;
	}

	public getLocation(): string {
		const index = this.url.indexOf(this.location);
		return this.url.slice(index + this.location.length);
	}

	public getResourceGroupName(): string {
		const start = this.url.indexOf(this.startResourceGroup);
		const end = this.url.indexOf(this.endResourceGroup);
		return this.url.slice(start + this.startResourceGroup.length, end);
	}
}