"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsTreeDataProvider = void 0;
const vscode = require("vscode");
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const AssesmentTreeItem_1 = require("./AssesmentTreeItem");
const FilterCommand_1 = require("../Commands/FilterCommand");
const configOperations_1 = require("../configOperations");
const treeUtils_1 = require("../Utility/treeUtils");
class RecommendationsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.children = [];
        this.contextValue = 'securityCenter.recommendations';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.assessmentIcon);
        this.title = label;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        if (this.children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const value = await (await this.client.assessments.list(subscriptionId).byPage().next()).value;
            for (let item of value) {
                //how to get the severity of an assessments??
                this.children.push(new AssesmentTreeItem_1.AssessmentTreeItem(item.displayName, item.name, item.severity, item.status.code, item.resourceDetails.Source, this, item));
            }
        }
        this.label += `${this.children.length}`;
        //this.label = this.title + " " + `(${this.children.length})`;
        return (0, FilterCommand_1.recommendationsFiltering)((0, configOperations_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering)[this.subscription.subscriptionId], this.children);
    }
    hasMoreChildrenImpl() {
        return true;
    }
}
exports.RecommendationsTreeDataProvider = RecommendationsTreeDataProvider;
//# sourceMappingURL=RecommendationsTreeDataProvider.js.map