"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const AzureAccountTreeItem_1 = require("./VulnerabilitiesTree/AzureAccountTreeItem");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const filterVulnerabilities_1 = require("./Commands/filterVulnerabilities");
const constants_1 = require("./constants");
const setEmailSettings_1 = require("./Commands/setEmailSettings");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const sendSmsAM_1 = require("./Commands/sendSmsAM");
const setSmsSettingsAM_1 = require("./Commands/setSmsSettingsAM");
async function activate(context) {
    constants_1.Constants.initialize(context);
    const uiExtensionVariables = {
        context,
        ignoreBundle: false,
        outputChannel: (0, vscode_azext_utils_1.createAzExtOutputChannel)('Azure Identity', ''),
        prefix: '',
    };
    (0, vscode_azext_azureutils_1.registerAzureUtilsExtensionVariables)(uiExtensionVariables);
    await (0, vscode_azureextensionui_1.callWithTelemetryAndErrorHandling)('mdc.Activate', async (activateContext) => {
        activateContext.telemetry.properties.isActivationEvent = 'true';
        const azureAccountTreeItem = new AzureAccountTreeItem_1.AzureAccountTreeItem();
        context.subscriptions.push(azureAccountTreeItem);
        const treeDataProvider = new vscode_azext_utils_1.AzExtTreeDataProvider(azureAccountTreeItem, "subscription.getSubscription");
        vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);
        await registerCommands(context);
    });
}
exports.activate = activate;
async function registerCommands(context) {
    (0, vscode_azext_utils_1.registerCommand)('subscription.email.notification.settings', async (_context, node) => {
        await (0, setEmailSettings_1.setEmailNotificationSettings)(context, node.client, node.root);
    });
    (0, vscode_azext_utils_1.registerCommand)('subscription.sms.notification.settings', async (_context, node) => {
        //await setSmsNotificationSettings(args.getCommunicationServices());
        await (0, setSmsSettingsAM_1.setSmsNotification)(node.subscription.subscriptionId, await node.getMonitor(_context));
    });
    (0, vscode_azext_utils_1.registerCommand)('recommendation.filter.status', async (_context, node) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(node, "recommendations", "status");
    });
    (0, vscode_azext_utils_1.registerCommand)('recommendation.filter.environment', async (_context, node) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(node, "recommendations", "environment");
    });
    (0, vscode_azext_utils_1.registerCommand)('alerts.filter.severity', async (_context, node) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(node, "alerts", "severity");
    });
    (0, vscode_azext_utils_1.registerCommand)('alerts.filter.status', async (_context, node) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(node, "alerts", "status");
    });
    (0, vscode_azext_utils_1.registerCommand)('connectors.filter.cloudProvider', async (_context, node) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(node, "connectors", "cloudProvider");
    });
    (0, vscode_azext_utils_1.registerCommand)("recommendation.menu.showInBrowser", (_context, node) => {
        vscode.env.openExternal(vscode.Uri.parse(constants_1.Constants.recommendationOnPortal(node.assessmentId)));
    });
    //TODO:Get the root file, of the project
    (0, vscode_azext_utils_1.registerCommand)("recommendations.menu.showDetailed", (_context, node) => {
        fs.writeFile(path.join(constants_1.Constants.resourcesFolderPath, 'details.json'), JSON.stringify(node.jsonItem), (err) => { });
        vscode.window.showTextDocument(vscode.Uri.file(path.join(constants_1.Constants.resourcesFolderPath, 'jsonFiles')));
    });
    (0, vscode_azext_utils_1.registerCommand)("alerts.menu.showInBrowser", (_context, node) => {
        vscode.env.openExternal(vscode.Uri.parse(node.alertUri));
    });
    (0, vscode_azext_utils_1.registerCommand)("alerts.menu.showDetailed", (_context, node) => {
        fs.writeFile(path.join(constants_1.Constants.resourcesFolderPath, 'details.json'), JSON.stringify(node.jsonItem), (err) => { });
        vscode.window.showTextDocument(vscode.Uri.file(path.join(constants_1.Constants.resourcesFolderPath, 'jsonFiles')));
    });
    //TODO:sync with the correct hierarchy
    (0, vscode_azext_utils_1.registerCommand)("alerts.menu.ActionMenu.sendNotifications", async (_context, node) => {
        await (0, sendSmsAM_1.sendSmsWithAzureMonitor)(_context, node.parent.client, await node.parent.getMonitor(_context));
    });
    (0, vscode_azext_utils_1.registerCommand)("alerts.menu.ActionMenu.Dismiss", (event, item) => {
        item.dismiss();
    });
    (0, vscode_azext_utils_1.registerCommand)("alerts.menu.ActionMenu.Activate", (event, item) => {
        item.activate();
    });
}
// this method is called when your extension is deactivated
function deactivate() {
    fs.rm(path.join(constants_1.Constants.resourcesFolderPath, 'details.json'), (err) => { });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map