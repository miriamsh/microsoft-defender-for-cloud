"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const SubAssesmentTreeItem_1 = require("./SubAssesmentTreeItem");
class AssessmentTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, assessmentId, severity, status, cloud, parent, jsonItem) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.recommendations.assessments';
        this.label = label;
        this._client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.severity = severity;
        this.status = status;
        this.cloud = cloud;
        this._assessmentId = assessmentId;
        this._jsonItem = jsonItem;
    }
    async loadMoreChildrenImpl() {
        let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
        let value = await (await this._client.subAssessments.list(subscriptionId, this._assessmentId).byPage().next()).value;
        for (let item of value) {
            this._children.push(new SubAssesmentTreeItem_1.SubAssessmentTreeItem(item.displayName, this));
        }
        return this._children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AssessmentTreeItem = AssessmentTreeItem;
//# sourceMappingURL=AssesmentTreeItem.js.map