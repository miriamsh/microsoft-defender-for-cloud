"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsTreeDataProvider = void 0;
const vscode = require("vscode");
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const AssesmentTreeItem_1 = require("./AssesmentTreeItem");
const FilterCommand_1 = require("../Commands/FilterCommand");
class RecommendationsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.children = [];
        this.contextValue = 'securityCenter.recommendations';
        this.title = label;
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = constants_1.assesmentIcon;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        this.context = context;
        if (this.children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const value = await (await this.client.assessments.list(subscriptionId).byPage().next()).value;
            for (let item of value) {
                this.children.push(new AssesmentTreeItem_1.AssessmentTreeItem(item.displayName, item.name, item.severity, item.status.code, item.resourceDetails.Source, this));
            }
        }
        const filteredItems = (0, FilterCommand_1.recommendationsFiltering)(this.parent.filteringSettings, this.children);
        this.label = this.title + " " + `(${filteredItems.length})`;
        return filteredItems;
    }
    hasMoreChildrenImpl() {
        return true;
    }
}
exports.RecommendationsTreeDataProvider = RecommendationsTreeDataProvider;
//# sourceMappingURL=RecommendationsTreeDataProvider.js.map