"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubAssessmentTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class SubAssessmentTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent, item) {
        super(parent);
        this.contextValue = 'securityCenter.recommendations.assessments.subAssessments';
        this.label = label;
        this.jsonItem = item;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
    loadMoreChildrenImpl(clearCache, context) {
        return Promise.resolve([]);
    }
    hasMoreChildrenImpl() {
        throw new Error("Method not implemented.");
    }
}
exports.SubAssessmentTreeItem = SubAssessmentTreeItem;
//# sourceMappingURL=SubAssesmentTreeItem.js.map