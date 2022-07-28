"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ConnectorTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(contextValue, label, cloudProvider, parent) {
        super(parent);
        this.contextValue = contextValue;
        this.label = label;
        this.cloudProvider = cloudProvider;
    }
}
exports.ConnectorTreeItem = ConnectorTreeItem;
//# sourceMappingURL=ConnectorTreeItem.js.map