import * as vscode from 'vscode';
import * as fs from 'fs';
import { AzureAccountTreeItem } from './ResourecTree/AzureAccountTreeItem';
import { createAzExtOutputChannel, AzExtTreeDataProvider, registerCommand } from '@microsoft/vscode-azext-utils';
import { registerAzureUtilsExtensionVariables } from '@microsoft/vscode-azext-azureutils';
import { selectFilters } from './Commands/FilterCommand';
import { sendSmsNotification } from './Commands/SendNotificationCommand';
import { Constants } from './constants';

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

    // context.subscriptions.push(vscode.window.createTreeView("package-resources", { treeDataProvider }));

    vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);

    context.subscriptions.push(vscode.commands.registerCommand('subscription.email.notification.settings', async (args) => {
         await args.getNotify().setEmailNotificationSettings(context);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('subscription.sms.notification.settings', async (args) => {
         await args.getNotify().setSmsNotificationSettings();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.status', async (args) => {
        await selectFilters(args, "recommendations", "status");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.environment', async (args) => {
        await selectFilters(args, "recommendations", "environment");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.severity', async (args) => {
        await selectFilters(args, "alerts", "severity");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.status', async (args) => {
        await selectFilters(args, "alerts", "status");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('connectors.filter.cloudExplorer', async (args) => {
        await selectFilters(args, "connectors", "cloudExplorer");
    }));

    registerCommand("recommendation.menu.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/${item.assessmentId}/showSecurityCenterCommandBar~/false`));
    });

    //change the URL to concrete URl of alerts in Azure portal
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
         await sendSmsNotification(args.parent.subscription, args.parent.notify, args.alert);
    }));
}



// this method is called when your extension is deactivated
export function deactivate() { }
