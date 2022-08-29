"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionTreeItem = void 0;
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const Constants_1 = require("../Constants");
const FilterSettings_1 = require("../Models/FilterSettings");
const AlertsTreeDataProvider_1 = require("./Security Alerts/AlertsTreeDataProvider");
const RecommendationsTreeDataProvider_1 = require("./Recommendations/RecommendationsTreeDataProvider");
const ConnectorsTreeDataProvider_1 = require("./Connectors/ConnectorsTreeDataProvider");
const vscode = require("vscode");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const ClientUtils_1 = require("../Utility/ClientUtils");
const CommunicationServices_1 = require("../azure/CommunicationServices");
const AzureMonitor_1 = require("../azure/AzureMonitor");
const TreeUtils_1 = require("../Utility/TreeUtils");
const AssessmentModel_1 = require("./Recommendations/AssessmentModel");
const ConnectorModel_1 = require("./Connectors/ConnectorModel");
const AlertModel_1 = require("./Security Alerts/AlertModel");
class SubscriptionTreeItem extends vscode_azext_azureutils_1.SubscriptionTreeItemBase {
    constructor(parent, root) {
        super(parent, root);
        this._apiUrl = [];
        this.model = [new AssessmentModel_1.Assessments(), new ConnectorModel_1.Connectors(), new AlertModel_1.Alerts()];
        this.contextValue = 'azureutils.subscription';
        this.root = root;
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(Constants_1.Constants.subscriptionIcon);
        this._client = new ClientUtils_1.Client(root);
        this._communicationServices = new CommunicationServices_1.CommunicationServices(root, this._client);
        this._apiUrl.push(Constants_1.Constants.getAssessmentListPath(this.subscription.subscriptionId));
        this._apiUrl.push(Constants_1.Constants.getConnectorListPath(this.subscription.subscriptionId));
        this._apiUrl.push(Constants_1.Constants.getAlertListPath(this.subscription.subscriptionId));
    }
    get apiUrl() {
        return this._apiUrl;
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
        const filterSettingsTemp = await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, this.subscription.subscriptionId);
        if (filterSettingsTemp === undefined) {
            await (0, ConfigUtils_1.setConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, this.subscription.subscriptionId, new FilterSettings_1.FilterSettings().settings, vscode.ConfigurationTarget.Global);
        }
        const alerts = new AlertsTreeDataProvider_1.AlertsTreeDataProvider("Security Alerts", this, this._client.getSecurityCenterClient());
        const recommendations = new RecommendationsTreeDataProvider_1.RecommendationsTreeDataProvider("Recommendations", this, this._client.getSecurityCenterClient());
        const connectors = new ConnectorsTreeDataProvider_1.ConnectorsTreeDataProvider("Connectors", this, this._client.getSecurityCenterClient());
        return [connectors, recommendations, alerts];
    }
}
exports.SubscriptionTreeItem = SubscriptionTreeItem;
//# sourceMappingURL=SubscriptionTreeItem.js.map