"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyTreeItem = void 0;
class HierarchyTreeItem {
    constructor(name, parent, iconPath, children) {
        this._name = name;
        this._parent = parent;
        this._children = children;
        this._iconPath = iconPath;
    }
    setChildren(children) {
        this._children = children;
    }
}
exports.HierarchyTreeItem = HierarchyTreeItem;
//# sourceMappingURL=HierarchyTreeItem.js.map