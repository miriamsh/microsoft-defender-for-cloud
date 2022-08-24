"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnHealthyResourceTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
//TODO: Explore where it comes from, bring it and create instance from this class
class UnHealthyResourceTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, parent) {
        super(parent);
        this.contextValue = 'securityCenter.recommendations.assessments.subAssessments.unhealthyResource';
        this.label = label;
    }
}
exports.UnHealthyResourceTreeItem = UnHealthyResourceTreeItem;
//# sourceMappingURL=UnHealthyResourceTreeItem.js.map