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
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const ClientUtils_1 = require("../Utility/ClientUtils");
const CommunicationServices_1 = require("../azure/CommunicationServices");
const AzureMonitor_1 = require("../azure/AzureMonitor");
const TreeUtils_1 = require("../Utility/TreeUtils");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this.contextValue = 'azureutils.subscription';
        this.root = root;
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(constants_1.Constants.subscriptionIcon);
        this._client = new ClientUtils_1.Client(root);
        this._communicationServices = new CommunicationServices_1.CommunicationServices(root, this._client);
    }
    get client() {
        return this._client;
    }
    get communicationServices() {
        return this._communicationServices;
    }
    async getMonitor(context) {
        if (this._monitorServices === undefined) {
            this._monitorServices = await AzureMonitor_1.Monitor.createMonitorClient(context, this.root, this.client);
        }
        return this._monitorServices;
    }
    hasMoreChildrenImpl() {
        return false;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        const filterSettingsTemp = await (0, ConfigUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId);
        if (filterSettingsTemp === undefined) {
            await (0, ConfigUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId, new filterSettings_1.FilterSettings().settings, vscode.ConfigurationTarget.Global);
        }
        const alerts = new AlertsTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this, this._client.getSecurityCenterClient());
        const recommendations = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this, this._client.getSecurityCenterClient());
        const connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this, this._client.getSecurityCenterClient());
        return [connectors, recommendations, alerts];
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map