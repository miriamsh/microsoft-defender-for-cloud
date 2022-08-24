"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsTreeDataProvider = void 0;
const vscode = require("vscode");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const AssesmentTreeItem_1 = require("./AssesmentTreeItem");
const TreeUtils_1 = require("../../Utility/TreeUtils");
const constants_1 = require("../../constants");
const filterVulnerabilities_1 = require("../../Commands/filterVulnerabilities");
const ConfigUtils_1 = require("../../Utility/ConfigUtils");
class RecommendationsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent, client) {
        super(parent);
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._children = [];
        this.contextValue = 'securityCenter.recommendations';
        this._title = label;
        this.label = label;
        this._client = client;
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(constants_1.Constants.assessmentIcon);
    }
    async loadMoreChildrenImpl(clearCache) {
        if (this._children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const data = await (await this._client.assessments.list(subscriptionId).byPage().next()).value;
            data.map((assessment) => {
                this._children.push(new AssesmentTreeItem_1.AssessmentTreeItem(assessment.id, assessment.displayName, assessment.name, assessment.status.code, assessment.resourceDetails.Source, this, JSON.stringify(assessment)));
            });
        }
        const filteredRecommendations = (0, filterVulnerabilities_1.recommendationsFiltering)(await (0, ConfigUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId), this._children);
        this.createNewLabel = `${this._title} (${filteredRecommendations.length})`;
        this.label = `${this._title} (${filteredRecommendations.length})`;
        return filteredRecommendations;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.RecommendationsTreeDataProvider = RecommendationsTreeDataProvider;
//# sourceMappingURL=RecommendationTreeDataProvider.js.map