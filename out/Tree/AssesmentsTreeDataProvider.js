"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsTreeDataProvider = void 0;
const vscode = require("vscode");
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const AssesmentTreeItem_1 = require("./AssesmentTreeItem");
const FilterCommand_1 = require("../Commands/FilterCommand");
class AssessmentsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.children = [];
        this.contextValue = 'securityCenter.assesments';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = constants_1.assesmentIcon;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        this.context = context;
        let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
        let value = await (await this.client.assessments.list(subscriptionId).byPage().next()).value;
        if (this.children.length === 0) {
            for (let item of value) {
                const jsonItem = JSON.stringify(item);
                this.children.push(new AssesmentTreeItem_1.AssessmentTreeItem("Assessment", item.displayName, item.name, item.severity, item.status.code, item.resourceDetails.Source, this));
            }
        }
        return (0, FilterCommand_1.recommendationsFiltering)(this.parent.filteringSettings, this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AssessmentsTreeDataProvider = AssessmentsTreeDataProvider;
//# sourceMappingURL=AssesmentsTreeDataProvider.js.map