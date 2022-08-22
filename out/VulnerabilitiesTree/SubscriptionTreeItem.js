"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionTreeItem = void 0;
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const constants_1 = require("../constants");
const filterSettings_1 = require("../Models/filterSettings");
const AlertTreeDataProvider_1 = require("./Security Alerts/AlertTreeDataProvider");
const RecommendationsTreeDataProvider_1 = require("./Recommendations/RecommendationsTreeDataProvider");
const ConnectorsTreeDataProvider_1 = require("./Connectors/ConnectorsTreeDataProvider");
const vscode = require("vscode");
const configUtils_1 = require("../Utility/configUtils");
const treeUtils_1 = require("../Utility/treeUtils");
const clientUtils_1 = require("../Utility/clientUtils");
const communicationServices_1 = require("../azure/communicationServices");
const azureMonitor_1 = require("../azure/azureMonitor");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this.contextValue = 'azureutils.subscription';
        this.root = root;
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.subscriptionIcon);
        this._client = new clientUtils_1.Client(root);
        this._communicationServices = new communicationServices_1.CommunicationServices(root, this._client);
    }
    get client() {
        return this._client;
    }
    get communicationServices() {
        return this._communicationServices;
    }
    async getMonitor(context) {
        if (this._monitorServices === undefined) {
            this._monitorServices = await azureMonitor_1.Monitor.createMonitorClient(context, this.root, this.client);
        }
        return this._monitorServices;
    }
    hasMoreChildrenImpl() {
        return false;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        const filterSettingsTemp = await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId);
        if (filterSettingsTemp === undefined) {
            await (0, configUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId, new filterSettings_1.FilterSettings().settings, vscode.ConfigurationTarget.Global);
        }
        const alerts = new AlertTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this);
        const recommendations = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this);
        const connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this);
        return [connectors, recommendations, alerts];
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map