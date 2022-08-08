"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeUtils = void 0;
const path = require("path");
const constants_1 = require("../constants");
class TreeUtils {
    static getIconPath(iconName) {
        return path.join(constants_1.Constants.resourcesFolderPath, `${iconName}.svg`);
    }
    static getThemedIconPath(iconName) {
        return {
            light: path.join(constants_1.Constants.resourcesFolderPath, "light", `${iconName}.svg`),
            dark: path.join(constants_1.Constants.resourcesFolderPath, "dark", `${iconName}.svg`),
        };
    }
}
exports.TreeUtils = TreeUtils;
//# sourceMappingURL=treeUtils.js.map