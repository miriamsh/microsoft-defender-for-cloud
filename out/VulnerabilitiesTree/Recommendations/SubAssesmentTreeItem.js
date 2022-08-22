"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubAssessmentTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class SubAssessmentTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, parent) {
        super(parent);
        this.contextValue = 'securityCenter.recommendations.assessments.sub-assessment';
        this.label = label;
    }
}
exports.SubAssessmentTreeItem = SubAssessmentTreeItem;
//# sourceMappingURL=SubAssesmentTreeItem.js.map