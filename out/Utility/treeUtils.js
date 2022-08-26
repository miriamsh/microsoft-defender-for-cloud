"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeUtils = void 0;
const path = require("path");
const Constants_1 = require("../Constants");
class TreeUtils {
    static getIconPath(iconName, suffix = "svg") {
        return path.join(Constants_1.Constants.resourcesFolderPath, `${iconName}.${suffix}`);
    }
    static getThemedIconPath(iconName) {
        return {
            light: path.join(Constants_1.Constants.resourcesFolderPath, "light", `${iconName}.svg`),
            dark: path.join(Constants_1.Constants.resourcesFolderPath, "dark", `${iconName}.svg`),
        };
    }
}
exports.TreeUtils = TreeUtils;
//# sourceMappingURL=TreeUtils.js.map