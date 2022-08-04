"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionTreeItem = void 0;
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const constants_1 = require("../constants");
const FilterSettings_1 = require("../Models/FilterSettings");
const AlertsTreeDataProvider_1 = require("./AlertsTreeDataProvider");
const RecommendationsTreeDataProvider_1 = require("./RecommendationsTreeDataProvider");
const ConnectorsTreeDataProvider_1 = require("./ConnectorsTreeDataProvider");
const vscode = require("vscode");
const configOperations_1 = require("../configOperations");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this.contextValue = 'azureutils.subscription';
        this.root = root;
        this.iconPath = constants_1.subscriptionIcon;
    }
    hasMoreChildrenImpl() {
        return this._nextLink !== undefined;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        //set configuration filtering
        if (!(0, configOperations_1.getConfigurationSettings)(constants_1.extensionPrefix, constants_1.filtering)[this.root.subscriptionId]) {
            await (0, configOperations_1.setConfigurationSettings)(constants_1.extensionPrefix, constants_1.filtering, this.root.subscriptionId, new FilterSettings_1.FilterSettings().getAllSettings(), vscode.ConfigurationTarget.Global);
        }
        const alerts = new AlertsTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this);
        const recommendations = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this);
        const connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this);
        return [connectors, recommendations, alerts];
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map