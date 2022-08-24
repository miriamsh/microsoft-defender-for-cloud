"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffectedResourceTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class AffectedResourceTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.securityAlerts.affectedResources';
        this.label = label;
        this._title = label;
    }
    get children() {
        return this._children;
    }
    set children(v) {
        this._children = v;
    }
    appendChildren(child) {
        this.children ? this.children.push(child) : this._children = [child];
    }
    async loadMoreChildrenImpl(clearCache, context) {
        //this.label = `${this._title} (${this._children.length})`;
        return this._children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AffectedResourceTreeItem = AffectedResourceTreeItem;
//# sourceMappingURL=AffectedResourceTreeItem.js.map