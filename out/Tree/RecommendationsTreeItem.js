"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const SubAssesmentTreeItem_1 = require("./SubAssesmentTreeItem");
const constants_1 = require("../constants");
class AssessmentTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.contextValue = 'securityCenter.assesments';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = constants_1.assesmentIcon;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        let assessmentsTree = [];
        let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
        let value = await (await this.assessments.list(subscriptionId).byPage().next()).value;
        for (let item of value) {
            assessmentsTree.push(new SubAssesmentTreeItem_1.SubAssessmentTreeItem(item.displayName, this, item.name));
        }
        return assessmentsTree;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AssessmentTreeItem = AssessmentTreeItem;
//# sourceMappingURL=RecommendationsTreeItem.js.map