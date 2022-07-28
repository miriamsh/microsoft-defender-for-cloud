"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const AlertTreeItem_1 = require("./AlertTreeItem");
class AlertsTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
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
        let value = await (await this.client.alerts.list().byPage().next()).value;
        for (let item of value) {
            this.children.push(new AlertTreeItem_1.AlertTreeItem("Alert", item.alertDisplayName, item.severity, item.status, this));
        }
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AlertsTreeItem = AlertsTreeItem;
//# sourceMappingURL=AlertsTreeItem.js.map