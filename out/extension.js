"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const AzureAccountTreeItem_1 = require("./Tree/AzureAccountTreeItem");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const vscode_azext_azureutils_1 = require("@microsoft/vscode-azext-azureutils");
const FilterCommand_1 = require("./Commands/FilterCommand");
//import { SeverityFilters, StatusFilters, EnvironmentFilters } from './Models/filters.enum';
async function activate(context) {
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
    context.subscriptions.push(vscode.window.createTreeView("package-resources", { treeDataProvider }));
    vscode.window.registerTreeDataProvider('package-resources', treeDataProvider);
    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.status', async (args) => {
        const filtersSettings = args.parent.filteringSettings.recommendations.get('status');
        const quickPickItems = filtersSettings.map((filter) => {
            return {
                label: `${filter.option}`,
                picked: filter.enable
            };
        });
        ;
        const picks = await (0, FilterCommand_1.selectFilters)(quickPickItems, "status").then(data => {
            return data?.map(p => p.label);
        });
        if (picks) {
            const newFilters = filtersSettings.map((f) => {
                if (picks.indexOf(f.option) === -1) {
                    f.enable = false;
                }
                else {
                    f.enable = true;
                }
                return f;
            });
            args.parent.filteringSettings.recommendations.set('status', newFilters);
        }
        args.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('recommendation.filter.environment', async (args) => {
        const filtersSettings = args.parent.filteringSettings.recommendations.get('environment');
        const quickPickItems = filtersSettings.map((filter) => {
            return {
                label: `${filter.option}`,
                picked: filter.enable
            };
        });
        ;
        const picks = await (0, FilterCommand_1.selectFilters)(quickPickItems, "environment").then(data => {
            return data?.map(p => p.label);
        });
        if (picks) {
            const newFilters = filtersSettings.map((f) => {
                if (picks.indexOf(f.option) === -1) {
                    f.enable = false;
                }
                else {
                    f.enable = true;
                }
                return f;
            });
            args.parent.filteringSettings.recommendations.set('environment', newFilters);
        }
        args.refresh();
    }));
    (0, vscode_azext_utils_1.registerCommand)("recommendation.showInBrowser", (event, item) => {
        vscode.env.openExternal(vscode.Uri.parse(`https://portal.azure.com/#view/Microsoft_Azure_Security/RecommendationsBladeV2/subscription/${item.parent._id.slice(item.parent._id.lastIndexOf("/"))}`));
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map