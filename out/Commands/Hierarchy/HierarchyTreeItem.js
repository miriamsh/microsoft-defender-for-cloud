"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyTreeItem = void 0;
class HierarchyTreeItem {
    constructor(name, parent, iconPath, children) {
        this.name = name;
        this.parent = parent;
        this.children = children;
        this.iconPath = iconPath;
    }
    setChildren(children) {
        this.children = children;
    }
}
exports.HierarchyTreeItem = HierarchyTreeItem;
//# sourceMappingURL=HierarchyTreeItem.js.map