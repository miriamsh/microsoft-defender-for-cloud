"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubAssessmentTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const subAssessmentModel_1 = require("./subAssessmentModel");
class SubAssessmentTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, name, parent, client) {
        super(parent);
        this._apiUrl = [];
        this.model = [new subAssessmentModel_1.SubAssessments()];
        this.contextValue = 'securityCenter.recommendations.assessments.subAssessments';
        this.label = label;
        this._client = client;
        this._apiUrl.push(constants_1.Constants.getSubAssessmentPath(this.subscription.subscriptionId, this.parent.assessmentName, name));
    }
    get apiUrl() {
        return this._apiUrl;
    }
    set apiUrl(apiUrl) {
        this._apiUrl = apiUrl;
    }
}
exports.SubAssessmentTreeItem = SubAssessmentTreeItem;
//# sourceMappingURL=SubAssessmentTreeItem.js.map