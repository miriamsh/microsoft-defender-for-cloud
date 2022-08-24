"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyItem = void 0;
class HierarchyItem {
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
exports.HierarchyItem = HierarchyItem;
//# sourceMappingURL=TreeItem.js.map