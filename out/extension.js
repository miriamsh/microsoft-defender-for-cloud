"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const AzureAccountTreeItem_1 = require("./VulnerabilitiesTree/AzureAccountTreeItem");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const filterVulnerabilities_1 = require("./Commands/filterVulnerabilities");
const constants_1 = require("./constants");
const CreateInfrastructure_1 = require("./NotificationByAzureMonitor/CreateInfrastructure");
const setEmailSettings_1 = require("./Commands/setEmailSettings");
const setSmsSettings_1 = require("./Commands/setSmsSettings");
async function activate(context) {
    constants_1.Constants.initialize(context);
    const uiExtensionVariables = {
        context,
        ignoreBundle: false,
        outputChannel: (0, vscode_azext_utils_1.createAzExtOutputChannel)('Azure Identity', ''),
        prefix: ''
    };
    (0, vscode_azext_azureutils_1.registerAzureUtilsExtensionVariables)(uiExtensionVariables);
    const azureAccountTreeItem = new AzureAccountTreeItem_1.AzureAccountTreeItem();
    context.subscriptions.push(azureAccountTreeItem);
    const treeDataProvider = new vscode_azext_utils_1.AzExtTreeDataProvider(azureAccountTreeItem, "subscription.getSubscription");
    //context.subscriptions.push(vscode.window.createTreeView("package-resources", { treeDataProvider }));
    vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);
    context.subscriptions.push(vscode.commands.registerCommand('subscription.email.notification.settings', async (args) => {
        await (0, setEmailSettings_1.setEmailNotificationSettings)(context, args.getClient(), args);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('subscription.sms.notification.settings', async (args) => {
        await (0, setSmsSettings_1.setSmsNotificationSettings)(args.getCommunicationServices());
    }));
    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.status', async (args) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(args, "recommendations", "status");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.environment', async (args) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(args, "recommendations", "environment");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.severity', async (args) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(args, "alerts", "severity");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.status', async (args) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(args, "alerts", "status");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('connectors.filter.cloudProvider', async (args) => {
        await (0, filterVulnerabilities_1.selectFiltersCommand)(args, "connectors", "cloudProvider");
    }));
    (0, vscode_azext_utils_1.registerCommand)("recommendation.menu.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/${item.assessmentId}/showSecurityCenterCommandBar~/false`));
    });
    //TODO: change the URL to concrete URl of alerts in Azure portal
    (0, vscode_azext_utils_1.registerCommand)("alerts.menu.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://portal.azure.com/#view/Microsoft_Azure_Security/RecommendationsBladeV2/subscription/${item.parent._id.slice(item.parent._id.lastIndexOf("/"))}`));
    });
    (0, vscode_azext_utils_1.registerCommand)("recommendations.menu.showDetailed", (event, item) => {
        fs.writeFile('C:/Users/מירי/.vscode/extensions/microsoft-defender-for-cloud/src/myFile.json', JSON.stringify(item.jsonItem), (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("complete!");
            }
        });
        vscode.window.showTextDocument(vscode.Uri.file('C:/Users/מירי/.vscode/extensions/microsoft-defender-for-cloud/src/myFile.json'));
    });
    context.subscriptions.push(vscode.commands.registerCommand("alerts.menu.ActionMenu.sendNotifications", async (args) => {
        await (0, CreateInfrastructure_1.createNewAlertRule)(args.parent.subscription);
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map