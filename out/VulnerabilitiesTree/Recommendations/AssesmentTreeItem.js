"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const SubAssessmentTreeItem_1 = require("./SubAssessmentTreeItem");
class AssessmentTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(id, label, name, status, environment, parent, item, client) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.recommendations.assessments';
        this.id = id;
        this._assessmentName = name;
        this.label = label;
        this._client = client;
        this._status = status;
        this._environment = environment;
        this._jsonItem = item;
    }
    get status() {
        return this._status;
    }
    get environment() {
        return this._environment;
    }
    get jsonItem() {
        return this._jsonItem;
    }
    get assessmentName() {
        return this._assessmentName;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
        const data = await (await this._client.subAssessments.list(subscriptionId, this._assessmentName).byPage().next()).value;
        data.map((assessment) => {
            this.children.push(new SubAssessmentTreeItem_1.SubAssessmentTreeItem(assessment.displayName, this, this._client));
        });
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AssessmentTreeItem = AssessmentTreeItem;
//# sourceMappingURL=AssesmentTreeItem.js.map