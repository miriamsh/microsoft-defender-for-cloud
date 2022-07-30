"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const AlertTreeItem_1 = require("./AlertTreeItem");
const FilterCommand_1 = require("../Commands/FilterCommand");
class AlertsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.alerts';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.alerts = this.client.alerts;
        this.iconPath = constants_1.alertIcon;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        this.context = context;
        if (this.children.length === 0) {
            const value = await (await this.client.alerts.list().byPage().next()).value;
            for (let item of value) {
                this.children.push(new AlertTreeItem_1.AlertTreeItem("Alert", item.alertDisplayName, item.severity, item.status, this));
            }
        }
        return (0, FilterCommand_1.alertsFiltering)(this.parent.filteringSettings, this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AlertsTreeDataProvider = AlertsTreeDataProvider;
//# sourceMappingURL=AlertsTreeDataProvider.js.map