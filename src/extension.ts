import * as vscode from 'vscode';
import { AzureAccountTreeItem } from './Tree/AzureAccountTreeItem';
import { createAzExtOutputChannel, AzExtTreeDataProvider, registerCommand } from '@microsoft/vscode-azext-utils';
import { registerAzureUtilsExtensionVariables } from '@microsoft/vscode-azext-azureutils';
import { selectFilters } from './Commands/FilterCommand';
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
        const filtersSettings = args.parent.filteringSettings.recommendations.get('status');
        const quickPickItems = filtersSettings.map((filter: { option: string; enable: boolean; }) => {
            return {
                label: `${filter.option}`,
                picked: filter.enable
            };
        });;

        const picks = await selectFilters(quickPickItems, "status").then(data => {
            return data?.map(p => p.label);
        });
        if (picks) {
            const newFilters = filtersSettings.map((f: { option: string; enable: boolean; }) => {
                if (picks!.indexOf(f.option) === -1) {
                    f.enable = false;
                }
                else{
                    f.enable=true;
                }
                return f;
            });
            args.parent.filteringSettings.recommendations.set('status', newFilters);
        }
        args.refresh();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.environment', async (args) => {
        const filtersSettings = args.parent.filteringSettings.recommendations.get('environment');
        const quickPickItems = filtersSettings.map((filter: { option: string; enable: boolean; }) => {
            return {
                label: `${filter.option}`,
                picked: filter.enable
            };
        });;

        const picks = await selectFilters(quickPickItems, "environment").then(data => {
            return data?.map(p => p.label);
        });
        if (picks) {
            const newFilters = filtersSettings.map((f: { option: string; enable: boolean; }) => {
                if (picks!.indexOf(f.option) === -1) {
                    f.enable = false;
                }
                else{
                    f.enable=true;
                }
                return f;
            });
            args.parent.filteringSettings.recommendations.set('environment', newFilters);
        }
        args.refresh();
    }));

    registerCommand("recommendation.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://portal.azure.com/#view/Microsoft_Azure_Security/RecommendationsBladeV2/subscription/${item.parent._id.slice(item.parent._id.lastIndexOf("/"))}`));
    });
}

// this method is called when your extension is deactivated
export function deactivate() { }
