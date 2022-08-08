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
const NotificationSettingsCommand_1 = require("../Commands/NotificationSettingsCommand");
const treeUtils_1 = require("../Utility/treeUtils");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this.contextValue = 'azureutils.subscription';
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.subscriptionIcon);
        this.notify = new NotificationSettingsCommand_1.Notification(root);
    }
    hasMoreChildrenImpl() {
        return this._nextLink !== undefined;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        //set configuration filtering
        if (!(0, configOperations_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering)[this.subscription.subscriptionId]) {
            await (0, configOperations_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId, new FilterSettings_1.FilterSettings().getAllSettings(), vscode.ConfigurationTarget.Global);
        }
        const alerts = new AlertsTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this);
        const recommendations = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this);
        const connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this);
        return [connectors, recommendations, alerts];
    }
    getNotify() {
        return this.notify;
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map