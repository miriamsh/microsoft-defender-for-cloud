"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorsFiltering = exports.alertsFiltering = exports.recommendationsFiltering = exports.showFilteringMenu = exports.selectFilters = void 0;
const vscode = require("vscode");
async function selectFilters(args, filter, option) {
    const filtersSettings = args.parent.filteringSettings.getType(filter)?.get(option);
    const quickPickItems = filtersSettings.map((filter) => {
        return {
            label: `${filter.option}`,
            picked: filter.enable
        };
    });
    ;
    const picks = await showFilteringMenu(quickPickItems, option).then(data => {
        return data?.map(p => p.label);
    });
    const newFilters = filtersSettings.map((f) => {
        f.enable = picks.indexOf(f.option) !== -1;
        return f;
    });
    args.parent.filteringSettings.getType(filter)?.set(option, newFilters);
    args.refresh();
}
exports.selectFilters = selectFilters;
async function showFilteringMenu(filters, category) {
    try {
        const picks = await vscode.window.showQuickPick(filters, {
            canPickMany: true,
            placeHolder: `Filter ${category} By...`,
        });
        return picks ? picks : undefined;
    }
    catch (error) {
        throw error;
    }
}
exports.showFilteringMenu = showFilteringMenu;
function recommendationsFiltering(filteringSettings, assesments) {
    const statusFilters = filteringSettings.getType("recommendations")?.get('status');
    const environmentFilters = filteringSettings.getType("recommendations")?.get('environment');
    const relevantData = assesments.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) {
            return a;
        }
        ;
    });
    return relevantData.filter(a => {
        if (environmentFilters?.findIndex(environment => { return environment.option === a.cloud && environment.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.recommendationsFiltering = recommendationsFiltering;
function alertsFiltering(filteringSettings, alerts) {
    const statusFilters = filteringSettings.getType("alerts")?.get('status');
    const severityFilters = filteringSettings.getType("alerts")?.get('severity');
    const relevantData = alerts.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) {
            return a;
        }
        ;
    });
    return relevantData.filter(a => {
        if (severityFilters?.findIndex(severity => { return severity.option === a.severity && severity.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.alertsFiltering = alertsFiltering;
function connectorsFiltering(filteringSettings, connectors) {
    const cloudFilters = filteringSettings.getType("connectors")?.get('cloudExplorer');
    return connectors.filter(a => {
        if (cloudFilters?.findIndex(cloudExplorer => { return cloudExplorer.option === a.cloudProvider && cloudExplorer.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.connectorsFiltering = connectorsFiltering;
//# sourceMappingURL=FilterCommand.js.map