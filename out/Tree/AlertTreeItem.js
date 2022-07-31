"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class AlertTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(contextValue, label, severity, status, parent) {
        super(parent);
        this.label = label;
        this.contextValue = contextValue;
        this.severity = severity;
        this.status = status;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
    loadMoreChildrenImpl(clearCache, context) {
        throw new Error("Method not implemented.");
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AlertTreeItem = AlertTreeItem;
//# sourceMappingURL=AlertTreeItem.js.map