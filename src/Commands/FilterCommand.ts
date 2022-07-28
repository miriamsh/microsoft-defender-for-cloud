import * as vscode from 'vscode';
import { AzExtParentTreeItem, IActionContext, TreeItemIconPath } from "@microsoft/vscode-azext-utils";
import { AssessmentTreeItem } from '../Tree/AssesmentTreeItem';
import { ISubscriptionContext } from 'vscode-azureextensionui';
import { FilterSettings } from '../Models/FilterSettings';

export async function selectFilters(filters: vscode.QuickPickItem[], category: string) {

    try {
        const picks: vscode.QuickPickItem[] | undefined = await vscode.window.showQuickPick(
            filters,
            {
                canPickMany: true,
                placeHolder: `Filter ${category} By...`,
            });
        if (picks) {
            return picks;
        }
        return undefined;
    }
    catch (error) {
        throw error;
    }
}

export function recommendationsFiltering(filteringSettings: FilterSettings, assesments: AssessmentTreeItem[]): AssessmentTreeItem[] {
    const statusFilters = filteringSettings.recommendations.get('status');
    const severityFilters = filteringSettings.recommendations.get('severity');
    const cloudFilters = filteringSettings.recommendations.get('environment');
    const temp = assesments;
    let relevantData = temp.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) { return a; };
    });
    relevantData = relevantData.filter(a => {
        if (cloudFilters?.findIndex(status => { return status.option === a.cloud && status.enable; }) !== -1) { return a; };
    });
    return relevantData;
}