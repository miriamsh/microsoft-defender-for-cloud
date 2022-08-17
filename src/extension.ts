import * as vscode from 'vscode';
import * as fs from 'fs';
import { AzureAccountTreeItem } from './VulnerabilitiesTree/AzureAccountTreeItem';
import { createAzExtOutputChannel, AzExtTreeDataProvider, registerCommand } from '@microsoft/vscode-azext-utils';
import { registerAzureUtilsExtensionVariables } from '@microsoft/vscode-azext-azureutils';
import { selectFiltersCommand } from './Commands/filterVulnerabilities';
import { sendSmsNotification } from './Commands/sendSms';
import { Constants } from './constants';
import { createNewAlertRule } from './NotificationByAzureMonitor/CreateInfrastructure';
import { setEmailNotificationSettings } from './Commands/setEmailSettings';
import { setSmsNotificationSettings } from './Commands/setSmsSettings';

export async function activate(context: vscode.ExtensionContext) {

    Constants.initialize(context);
    
    const uiExtensionVariables = {
        context,
        ignoreBundle: false,
        outputChannel: createAzExtOutputChannel('Azure Identity', ''),
        prefix: ''
    };

    registerAzureUtilsExtensionVariables(uiExtensionVariables);

    const azureAccountTreeItem = new AzureAccountTreeItem();   
    context.subscriptions.push(azureAccountTreeItem);
    const treeDataProvider = new AzExtTreeDataProvider(azureAccountTreeItem, "subscription.getSubscription");

    //context.subscriptions.push(vscode.window.createTreeView("package-resources", { treeDataProvider }));

    vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);

    context.subscriptions.push(vscode.commands.registerCommand('subscription.email.notification.settings', async (args) => {
         await setEmailNotificationSettings(context,args.getClient(),args);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('subscription.sms.notification.settings', async (args) => {
         await setSmsNotificationSettings(args.getCommunicationServices());
    }));

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.status', async (args) => {
         await selectFiltersCommand(args, "recommendations", "status");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.environment', async (args) => {
        await selectFiltersCommand(args, "recommendations", "environment");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.severity', async (args) => {
        await selectFiltersCommand(args, "alerts", "severity");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.status', async (args) => {
        await selectFiltersCommand(args, "alerts", "status");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('connectors.filter.cloudProvider', async (args) => {
        await selectFiltersCommand(args, "connectors", "cloudProvider");
    }));

    registerCommand("recommendation.menu.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/${item.assessmentId}/showSecurityCenterCommandBar~/false`));
    });

    //TODO: change the URL to concrete URl of alerts in Azure portal
    registerCommand("alerts.menu.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://portal.azure.com/#view/Microsoft_Azure_Security/RecommendationsBladeV2/subscription/${item.parent._id.slice(item.parent._id.lastIndexOf("/"))}`));
    });

    registerCommand("recommendations.menu.showDetailed", (event, item) => {
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
         await  createNewAlertRule (args.parent.subscription);
    }));
}



// this method is called when your extension is deactivated
export function deactivate() { }
