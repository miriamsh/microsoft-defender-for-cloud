"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionTreeItem = void 0;
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const constants_1 = require("../constants");
const filterSettings_1 = require("../Models/filterSettings");
const AlertsTreeDataProvider_1 = require("./Security Alerts/AlertsTreeDataProvider");
const RecommendationsTreeDataProvider_1 = require("./Recommendations/RecommendationsTreeDataProvider");
const ConnectorsTreeDataProvider_1 = require("./Connectors/ConnectorsTreeDataProvider");
const vscode = require("vscode");
const configUtils_1 = require("../Utility/configUtils");
const treeUtils_1 = require("../Utility/treeUtils");
const clientUtils_1 = require("../Utility/clientUtils");
const communicationServices_1 = require("../Commands/communicationServices");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this.contextValue = 'azureutils.subscription';
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.subscriptionIcon);
        this.client = new clientUtils_1.Client(root);
        this.communicationServices = new communicationServices_1.CommunicationServices(root, this.client);
    }
    hasMoreChildrenImpl() {
        return this._nextLink !== undefined;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        //set configuration filtering
        if (!(0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering)[this.subscription.subscriptionId]) {
            await (0, configUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId, new filterSettings_1.FilterSettings().getAllSettings(), vscode.ConfigurationTarget.Global);
        }
        const alerts = new AlertsTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this);
        const recommendations = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this);
        const connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this);
        return [connectors, recommendations, alerts];
    }
    getClient() {
        return this.client;
    }
    getCommunicationServices() {
        return this.communicationServices;
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map