"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const AssessmentModel_1 = require("./AssessmentModel");
const SubAssessmentTreeItem_1 = require("./SubAssessmentTreeItem");
class AssessmentTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(id, label, name, status, environment, parent, jsonItem, client, resourceId) {
        super(parent);
        this.children = [];
        this.model = [new AssessmentModel_1.Assessments()];
        this._apiUrl = [];
        this.contextValue = 'securityCenter.recommendations.assessments';
        this.id = id;
        this._assessmentName = name;
        this.label = label;
        this._client = client;
        this._status = status;
        this._environment = environment;
        this._jsonItem = jsonItem;
        this._resourceId = resourceId;
        this._apiUrl.push(constants_1.Constants.getAssessmentPath(this.subscription.subscriptionId, resourceId, name));
    }
    get apiUrl() {
        return this._apiUrl;
    }
    get resourceId() {
        return this._resourceId;
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
            this.children.push(new SubAssessmentTreeItem_1.SubAssessmentTreeItem(assessment.displayName, assessment.name, this, this._client));
        });
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AssessmentTreeItem = AssessmentTreeItem;
//# sourceMappingURL=AssesmentTreeItem.js.map