"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const AlertTreeItem_1 = require("./AlertTreeItem");
const filterVulnerabilities_1 = require("../../Commands/filterVulnerabilities");
const treeUtils_1 = require("../../Utility/treeUtils");
const configUtils_1 = require("../../Utility/configUtils");
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
        return (0, filterVulnerabilities_1.alertsFiltering)(await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId), this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AlertsTreeDataProvider = AlertsTreeDataProvider;
//# sourceMappingURL=AlertsTreeDataProvider.js.map