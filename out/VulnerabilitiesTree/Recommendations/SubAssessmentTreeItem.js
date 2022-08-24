"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubAssessmentTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class SubAssessmentTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, parent, client) {
        super(parent);
        this.contextValue = 'securityCenter.recommendations.assessments.subAssessments';
        this.label = label;
        this._client = client;
    }
}
exports.SubAssessmentTreeItem = SubAssessmentTreeItem;
//# sourceMappingURL=SubAssessmentTreeItem.js.map