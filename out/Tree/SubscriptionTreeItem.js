"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionTreeItem = void 0;
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const constants_1 = require("../constants");
const FilterSettings_1 = require("../Models/FilterSettings");
const AlertsTreeDataProvider_1 = require("./AlertsTreeDataProvider");
const RecommendationsTreeDataProvider_1 = require("./RecommendationsTreeDataProvider");
const ConnectorsTreeDataProvider_1 = require("./ConnectorsTreeDataProvider");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this.contextValue = 'azureutils.subscription';
        this.root = root;
        this.iconPath = constants_1.subscriptionIcon;
        this.filteringSettings = new FilterSettings_1.FilterSettings();
    }
    hasMoreChildrenImpl() {
        return this._nextLink !== undefined;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        let alerts = new AlertsTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this);
        let assessments = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this);
        let connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this);
        return [alerts, assessments, connectors];
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map