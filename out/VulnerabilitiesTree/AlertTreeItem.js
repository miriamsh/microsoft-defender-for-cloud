"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class AlertTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(contextValue, label, severity, status, parent) {
        super(parent);
        this.label = label;
        this.contextValue = contextValue;
        this.severity = severity;
        this.status = status;
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