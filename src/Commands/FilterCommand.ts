import * as vscode from 'vscode';
import { AssessmentTreeItem } from '../ResourecTree/AssesmentTreeItem';
import { FilterSettings, getConcreteProperty, setConcreteProperty } from '../Models/FilterSettings';
import { AlertTreeItem } from '../ResourecTree/AlertTreeItem';
import { ConnectorTreeItem } from '../ResourecTree/ConnectorTreeItem';
import { extensionPrefix, filtering } from '../constants';
import { getConfigurationSettings, setConfigurationSettings } from '../configOperations';

export async function selectFilters(args: any, type: string, property: string) {
    const subscriptionId: string = args.parent.root.subscriptionId;
    const configurations = getConfigurationSettings(extensionPrefix, filtering)[subscriptionId];
    const filtersSettings = getConcreteProperty(type, property, configurations);

    const quickPickItems = filtersSettings.map((filter: { option: string; enable: boolean; }) => {
        return {
            label: `${filter.option}`,
            picked: filter.enable
        };
    });;

    const picks = await showFilteringMenu(quickPickItems, property).then(data => {
        return data?.map(p => p.label);
    });
    if (picks) {
        
        const newFilters = filtersSettings.map((f: { option: string; enable: boolean; }) => {
            f.enable = picks!.indexOf(f.option) !== -1;
            return f;
        });

        await setConfigurationSettings(extensionPrefix, filtering, subscriptionId, setConcreteProperty(type, property, configurations, newFilters), vscode.ConfigurationTarget.Global);

        args.refresh();
    }
}

export async function showFilteringMenu(filters: vscode.QuickPickItem[], category: string) {
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

export function recommendationsFiltering(filteringSettings: any, assessments: AssessmentTreeItem[]): AssessmentTreeItem[] {
    const statusFilters = getConcreteProperty("recommendations", "status", filteringSettings);
    const environmentFilters = getConcreteProperty("recommendations", "environment", filteringSettings);

    const relevantData = assessments.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) { return a; };
    });
    return relevantData.filter(a => {
        if (environmentFilters?.findIndex(environment => { return environment.option === a.cloud && environment.enable; }) !== -1) { return a; };
    });
}

export function alertsFiltering(filteringSettings: FilterSettings, alerts: AlertTreeItem[]): AlertTreeItem[] {
    const statusFilters = getConcreteProperty("alerts", "status", filteringSettings);
    const severityFilters = getConcreteProperty("alerts", "severity", filteringSettings);

    const relevantData = alerts.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) { return a; };
    });
    return relevantData.filter(a => {
        if (severityFilters?.findIndex(severity => { return severity.option === a.severity && severity.enable; }) !== -1) { return a; };
    });
}

export function connectorsFiltering(filteringSettings: FilterSettings, connectors: ConnectorTreeItem[]): ConnectorTreeItem[] {
    const cloudFilters = getConcreteProperty("connectors", "cloudExplorer", filteringSettings);

    return connectors.filter(a => {
        if (cloudFilters?.findIndex(cloudExplorer => { return cloudExplorer.option === a.cloudProvider && cloudExplorer.enable; }) !== -1) { return a; };
    });
}