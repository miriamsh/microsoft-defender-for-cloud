"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudProviderTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const treeUtils_1 = require("../../Utility/treeUtils");
class CloudProviderTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider';
        this._title = label;
        this.label = label;
        this.cloudProvider = label;
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.cloudConnector);
    }
    hasMoreChildrenImpl() {
        return false;
    }
    loadMoreChildrenImpl() {
        this.label = `${this._title} (${this._children.length})`;
        return Promise.resolve(this._children);
    }
    appendChild(child) {
        this._children.push(child);
    }
}
exports.CloudProviderTreeItem = CloudProviderTreeItem;
//# sourceMappingURL=CloudProviderTreeItem.js.map