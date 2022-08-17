"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ResourceTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(contextValue, parent) {
        super(parent);
        this.label = contextValue;
        this.contextValue = contextValue;
    }
}
exports.ResourceTreeItem = ResourceTreeItem;
//# sourceMappingURL=ResourceTreeItem.js.map