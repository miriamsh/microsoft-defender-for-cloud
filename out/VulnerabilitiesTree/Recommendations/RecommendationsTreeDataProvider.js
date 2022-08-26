"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsTreeDataProvider = void 0;
const vscode = require("vscode");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const AssesmentTreeItem_1 = require("./AssesmentTreeItem");
const TreeUtils_1 = require("../../Utility/TreeUtils");
const Constants_1 = require("../../Constants");
const FilterVulnerabilities_1 = require("../../Commands/FilterVulnerabilities");
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
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(Constants_1.Constants.assessmentIcon);
    }
    async loadMoreChildrenImpl(clearCache, _context) {
        if (clearCache) {
            this._nextLink = undefined;
        }
        if (this._children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const data = this._nextLink === undefined ? await (await this._client.assessments.list(subscriptionId).byPage().next()).value :
                await (await this._client.assessments.list(subscriptionId).next()).value;
            //TODO:check if loadMoreChildren works. if it does - add this functionality to all the treeDataProvider classes 
            this._nextLink = data.next;
            data.map((assessment) => {
                this._children.push(new AssesmentTreeItem_1.AssessmentTreeItem(assessment.id, assessment.displayName, assessment.name, assessment.status.code, assessment.resourceDetails.Source, this, JSON.stringify(assessment), this._client));
            });
        }
        const filteredRecommendations = (0, FilterVulnerabilities_1.recommendationsFiltering)(await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, this.subscription.subscriptionId), this._children);
        this.childTypeLabel = `${this._title} (${filteredRecommendations.length})`;
        return filteredRecommendations;
    }
    hasMoreChildrenImpl() {
        return this._nextLink !== undefined;
    }
}
exports.RecommendationsTreeDataProvider = RecommendationsTreeDataProvider;
//# sourceMappingURL=RecommendationsTreeDataProvider.js.map