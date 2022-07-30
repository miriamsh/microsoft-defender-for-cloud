import * as vscode from 'vscode';
import { AzureAccountTreeItem } from './Tree/AzureAccountTreeItem';
import { createAzExtOutputChannel, AzExtTreeDataProvider, registerCommand } from '@microsoft/vscode-azext-utils';
import { registerAzureUtilsExtensionVariables } from '@microsoft/vscode-azext-azureutils';
import { selectFilters, showFilteringMenu } from './Commands/FilterCommand';
//import { SeverityFilters, StatusFilters, EnvironmentFilters } from './Models/filters.enum';


export async function activate(context: vscode.ExtensionContext) {

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
    context.subscriptions.push(vscode.window.createTreeView("package-resources", { treeDataProvider }));

    vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.status', async (args) => {
       await selectFilters(args,"recommendations", "status");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.environment', async (args) => {
       await selectFilters(args,"recommendations", "environment");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.severity', async (args) => {
       await selectFilters(args,"alerts", "status");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alerts.filter.status', async (args) => {
       await selectFilters(args,"alerts", "severity");
    }));

    context.subscriptions.push(vscode.commands.registerCommand('connectors.filter.cloudExplorer', async (args) => {
       await selectFilters(args,"connectors", "cloudExplorer");
    }));

    registerCommand("recommendation.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://portal.azure.com/#view/Microsoft_Azure_Security/RecommendationsBladeV2/subscription/${item.parent._id.slice(item.parent._id.lastIndexOf("/"))}`));
    });
}



// this method is called when your extension is deactivated
export function deactivate() { }
