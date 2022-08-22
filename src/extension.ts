import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from "path";
import { AzureAccountTreeItem } from './VulnerabilitiesTree/AzureAccountTreeItem';
import { createAzExtOutputChannel, AzExtTreeDataProvider, registerCommand } from '@microsoft/vscode-azext-utils';
import { registerAzureUtilsExtensionVariables } from '@microsoft/vscode-azext-azureutils';
import { selectFiltersCommand } from './Commands/filterVulnerabilities';
import { Constants } from './constants';
import { setEmailNotificationSettings } from './Commands/setEmailSettings';
import { callWithTelemetryAndErrorHandling, IActionContext } from 'vscode-azureextensionui';
import { sendSmsWithAzureMonitor } from './Commands/sendSmsAM';
import { setSmsNotification } from './Commands/setSmsSettingsAM';
import { AlertTreeItem } from './VulnerabilitiesTree/Security Alerts/AlertTreeItem';
import { AssessmentTreeItem } from './VulnerabilitiesTree/Recommendations/AssesmentTreeItem';


export async function activate(context: vscode.ExtensionContext) {

    Constants.initialize(context);

    const uiExtensionVariables = {
        context,
        ignoreBundle: false,
        outputChannel: createAzExtOutputChannel('Azure Identity', ''),
        prefix: '',
    };

    registerAzureUtilsExtensionVariables(uiExtensionVariables);

    await callWithTelemetryAndErrorHandling('mdc.Activate', async (activateContext: IActionContext) => {
        activateContext.telemetry.properties.isActivationEvent = 'true';

        const azureAccountTreeItem = new AzureAccountTreeItem();
        context.subscriptions.push(azureAccountTreeItem);
        const treeDataProvider = new AzExtTreeDataProvider(azureAccountTreeItem, "subscription.getSubscription");
        vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);

        await registerCommands(context);
    });
}

async function registerCommands(context: vscode.ExtensionContext) {

    registerCommand('subscription.email.notification.settings', async (_context: IActionContext, node) => {
        await setEmailNotificationSettings(context, node.client, node.root);
    });

    registerCommand('subscription.sms.notification.settings', async (_context: IActionContext, node) => {
        //await setSmsNotificationSettings(args.getCommunicationServices());
        await setSmsNotification(node.subscription.subscriptionId, await node.getMonitor(_context));
    });

    registerCommand('recommendation.filter.status', async (_context: IActionContext, node) => {
        await selectFiltersCommand(node, "recommendations", "status");
    });

    registerCommand('recommendation.filter.environment', async (_context: IActionContext, node) => {
        await selectFiltersCommand(node, "recommendations", "environment");
    });

    registerCommand('alerts.filter.severity', async (_context: IActionContext, node) => {
        await selectFiltersCommand(node, "alerts", "severity");
    });

    registerCommand('alerts.filter.status', async (_context: IActionContext, node) => {
        await selectFiltersCommand(node, "alerts", "status");
    });

    registerCommand('connectors.filter.cloudProvider', async (_context: IActionContext, node) => {
        await selectFiltersCommand(node, "connectors", "cloudProvider");
    });

    registerCommand("recommendation.menu.showInBrowser", (_context: IActionContext, node) => {
        vscode.env.openExternal(vscode.Uri.parse(Constants.recommendationOnPortal(node.assessmentId)));
    });

    //TODO:Get the root file, of the project
    registerCommand("recommendations.menu.showDetailed", (_context: IActionContext, node) => {
        fs.writeFile(path.join(Constants.resourcesFolderPath, 'details.json'), JSON.stringify(node.jsonItem), (err) => { });
        vscode.window.showTextDocument(vscode.Uri.file(path.join(Constants.resourcesFolderPath, 'jsonFiles')));
    });

    registerCommand("alerts.menu.showInBrowser", (_context: IActionContext, node: AlertTreeItem) => {
        vscode.env.openExternal(vscode.Uri.parse(node.alertUri));
    });

    registerCommand("alerts.menu.showDetailed", (_context: IActionContext, node: AlertTreeItem) => {
        fs.writeFile(path.join(Constants.resourcesFolderPath, 'details.json'), JSON.stringify(node.jsonItem), (err) => { });
        vscode.window.showTextDocument(vscode.Uri.file(path.join(Constants.resourcesFolderPath, 'jsonFiles')));
    });

    //TODO:sync with the correct hierarchy
    registerCommand("alerts.menu.ActionMenu.sendNotifications", async (_context: IActionContext, node) => {
        await sendSmsWithAzureMonitor(_context, node.parent.client, await node.parent.getMonitor(_context));
    });

    registerCommand("alerts.menu.ActionMenu.Dismiss", (event, item: AlertTreeItem) => {
        item.dismiss();
    });

    registerCommand("alerts.menu.ActionMenu.Activate", (event, item: AlertTreeItem) => {
        item.activate();
    });
}





// this method is called when your extension is deactivated
export function deactivate() {
    fs.rm(path.join(Constants.resourcesFolderPath, 'details.json'), (err) => { });
}
