"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLParameters = exports.AlertsTreeDataProvider = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const AlertTreeItem_1 = require("./AlertTreeItem");
const AffectedResourceTreeItem_1 = require("./AffectedResourceTreeItem");
const Constants_1 = require("../../Constants");
const FilterVulnerabilities_1 = require("../../Commands/FilterVulnerabilities");
const ConfigUtils_1 = require("../../Utility/ConfigUtils");
const TreeUtils_1 = require("../../Utility/TreeUtils");
const AlertModel_1 = require("./AlertModel");
class AlertsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent, client) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.securityAlerts';
        this._apiUrl = [];
        this.model = [new AlertModel_1.Alerts()];
        this.label = label;
        this._title = label;
        this._client = client;
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(Constants_1.Constants.alertIcon);
        this._apiUrl.push(Constants_1.Constants.getAlertListPath(this.subscription.subscriptionId));
        this._apiUrl.push(Constants_1.Constants.getAlertListPath(this.subscription.subscriptionId));
    }
    get apiUrl() {
        return this._apiUrl;
    }
    set apiUrl(apiUrl) {
        this._apiUrl = apiUrl;
    }
    async loadMoreChildrenImpl() {
        if (this._children.length === 0) {
            let alertByResource = new Map();
            const alerts = await (await this._client.alerts.list().byPage().next()).value;
            let resource;
            alerts.map((alert) => {
                const parameters = new URLParameters(alert.alertUri);
                resource = alertByResource.get(alert.compromisedEntity);
                if (resource === undefined) {
                    resource = new AffectedResourceTreeItem_1.AffectedResourceTreeItem(alert.compromisedEntity, this);
                }
                const alertItem = new AlertTreeItem_1.AlertTreeItem(alert.alertDisplayName, alert.severity, alert.status, resource, JSON.stringify(alert), alert.name, parameters.getResourceGroupName(), parameters.getLocation(), alert.entities, alert.alertUri, alert.id, this._client);
                resource.appendChildren(alertItem);
                alertByResource.set(alert.compromisedEntity, resource);
            });
            this._children = Array.from(alertByResource.values());
            //Example
            // const alert=await this._client.alerts.getSubscriptionLevel('centralus','2517427022085381501_c5b3855b-b05c-4877-bf30-ff1c52e11ff7');
            // resource = new AffectedResourceTreeItem(alert.compromisedEntity!, this);
            // const alertItem = new AlertTreeItem(alert.alertDisplayName!, alert.severity!, alert.status!, resource, JSON.stringify(alert), alert.name!, 'tivan-onboard','centralus', alert.entities!, alert.alertUri!, alert.id!, this._client);
            // resource.appendChildren(alertItem);
            // this._children.unshift(resource);
        }
        const filteredAlerts = (0, FilterVulnerabilities_1.alertsFiltering)(await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, this.subscription.subscriptionId), this._children);
        //this.label = `${this._title} (${filteredAlerts.length})`;
        return filteredAlerts;
    }
    hasMoreChildrenImpl() {
        return this._nextLink !== undefined;
    }
}
exports.AlertsTreeDataProvider = AlertsTreeDataProvider;
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