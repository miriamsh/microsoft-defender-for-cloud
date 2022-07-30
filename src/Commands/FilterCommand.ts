import * as vscode from 'vscode';
import { AzExtParentTreeItem, IActionContext, TreeItemIconPath } from "@microsoft/vscode-azext-utils";
import { AssessmentTreeItem } from '../Tree/AssesmentTreeItem';
import { ISubscriptionContext } from 'vscode-azureextensionui';
import { FilterSettings } from '../Models/FilterSettings';
import { AlertTreeItem } from '../Tree/AlertTreeItem';
import { ConnectorTreeItem } from '../Tree/ConnectorTreeItem';

export async function selectFilters(args:any, filter:string, option:string){
    const filtersSettings = args.parent.filteringSettings.getType(filter)?.get(option);
    const quickPickItems = filtersSettings.map((filter: { option: string; enable: boolean; }) => {
        return {
            label: `${filter.option}`,
            picked: filter.enable
        };
    });;

    const picks = await showFilteringMenu(quickPickItems, option).then(data => {
        return data?.map(p => p.label);
    });

    const newFilters = filtersSettings.map((f: { option: string; enable: boolean; }) => {
        f.enable = picks!.indexOf(f.option) !== -1;
        return f;
    });

    args.parent.filteringSettings.getType(filter)?.set(option, newFilters);
    args.refresh();
}

export async function showFilteringMenu(filters:vscode.QuickPickItem[], category:string){
    try {
        const picks: vscode.QuickPickItem[] | undefined = await vscode.window.showQuickPick(
            filters,
            {
                canPickMany: true,
                placeHolder: `Filter ${category} By...`,
            });
        return picks ? picks : undefined;
    }
    catch (error) {
        throw error;
    }
}

export function recommendationsFiltering(filteringSettings: FilterSettings, assesments: AssessmentTreeItem[]): AssessmentTreeItem[] {
    const statusFilters = filteringSettings.getType("recommendations")?.get('status');
    const environmentFilters = filteringSettings.getType("recommendations")?.get('environment');

    const relevantData = assesments.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) { return a; };
    });
    return relevantData.filter(a => {
        if (environmentFilters?.findIndex(environment => { return environment.option === a.cloud && environment.enable; }) !== -1) { return a; };
    });
}

export function alertsFiltering(filteringSettings: FilterSettings, alerts: AlertTreeItem[]): AlertTreeItem[] {
    const statusFilters = filteringSettings.getType("alerts")?.get('status');
    const severityFilters = filteringSettings.getType("alerts")?.get('severity');

    const relevantData = alerts.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) { return a; };
    });
    return relevantData.filter(a => {
        if (severityFilters?.findIndex(severity => { return severity.option === a.severity && severity.enable; }) !== -1) { return a; };
    });
}

export function connectorsFiltering(filteringSettings: FilterSettings, connectors: ConnectorTreeItem[]): ConnectorTreeItem[] {
    const cloudFilters = filteringSettings.getType("connectors")?.get('cloudExplorer');
 
    return connectors.filter(a => {
        if (cloudFilters?.findIndex(cloudExplorer => { return cloudExplorer.option === a.cloudProvider && cloudExplorer.enable; }) !== -1) { return a; };
    });
}