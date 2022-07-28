"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const SubAssesmentTreeItem_1 = require("./SubAssesmentTreeItem");
class AssessmentTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(contextValue, label, assessmentId, severity, status, cloud, parent) {
        super(parent);
        this.children = [];
        this.label = label;
        this.contextValue = contextValue;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.severity = severity;
        this.status = status;
        this.cloud = cloud;
        this.assessmentId = assessmentId;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
        let value = await (await this.client.subAssessments.list(subscriptionId, this.assessmentId).byPage().next()).value;
        for (let item of value) {
            const jsonItem = JSON.stringify(item);
            this.children.push(new SubAssesmentTreeItem_1.SubAssessmentTreeItem("SubAssessment", item.displayName, this));
        }
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AssessmentTreeItem = AssessmentTreeItem;
//# sourceMappingURL=AssesmentTreeItem.js.map