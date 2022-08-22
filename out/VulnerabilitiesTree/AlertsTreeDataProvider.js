"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLParameters = exports.AlertsTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const filterVulnerabilities_1 = require("../Commands/filterVulnerabilities");
const treeUtils_1 = require("../Utility/treeUtils");
const configUtils_1 = require("../Utility/configUtils");
const AlertTreeItem_1 = require("./Security Alerts/AlertTreeItem");
class AlertsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.alerts';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.alertIcon);
    }
    async loadMoreChildrenImpl(clearCache, context) {
        this.context = context;
        if (this.children.length === 0) {
            const value = await (await this.client.alerts.list().byPage().next()).value;
            for (let item of value) {
                this.children.push(new AlertTreeItem_1.AlertTreeItem("Alert", item.alertDisplayName, item.severity, item.status, this));
            }
        }
        return (0, filterVulnerabilities_1.alertsFiltering)((await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering))[this.subscription.subscriptionId], this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AlertsTreeDataProvider = AlertsTreeDataProvider;
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
class URLParameters {
    constructor(url) {
        this.location = "location/";
        this.startResourceGroup = "resourceGroup/";
        this.endResourceGroup = "/referencedFrom";
        this.url = url;
    }
    getLocation() {
        const index = this.url.indexOf(this.location);
        return this.url.slice(index + this.location.length);
    }
    getResourceGroupName() {
        const start = this.url.indexOf(this.startResourceGroup);
        const end = this.url.indexOf(this.endResourceGroup);
        return this.url.slice(start + this.startResourceGroup.length, end);
    }
}
exports.URLParameters = URLParameters;
//# sourceMappingURL=AlertsTreeDataProvider.js.map