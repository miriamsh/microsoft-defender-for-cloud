"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorsFiltering = exports.alertsFiltering = exports.recommendationsFiltering = exports.showFilteringMenu = exports.selectFilters = void 0;
const vscode = require("vscode");
const FilterSettings_1 = require("../Models/FilterSettings");
const constants_1 = require("../constants");
const configOperations_1 = require("../configOperations");
async function selectFilters(args, type, property) {
    const subscriptionId = args.parent.root.subscriptionId;
    const configurations = (0, configOperations_1.getConfigurationSettings)(constants_1.extensionPrefix, constants_1.filtering)[subscriptionId];
    const filtersSettings = (0, FilterSettings_1.getConcreteProperty)(type, property, configurations);
    const quickPickItems = filtersSettings.map((filter) => {
        return {
            label: `${filter.option}`,
            picked: filter.enable
        };
    });
    ;
    const picks = await showFilteringMenu(quickPickItems, property).then(data => {
        return data?.map(p => p.label);
    });
    if (picks) {
        const newFilters = filtersSettings.map((f) => {
            f.enable = picks.indexOf(f.option) !== -1;
            return f;
        });
        await (0, configOperations_1.setConfigurationSettings)(constants_1.extensionPrefix, constants_1.filtering, subscriptionId, (0, FilterSettings_1.setConcreteProperty)(type, property, configurations, newFilters), vscode.ConfigurationTarget.Global);
        args.refresh();
    }
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
function recommendationsFiltering(filteringSettings, assessments) {
    const statusFilters = (0, FilterSettings_1.getConcreteProperty)("recommendations", "status", filteringSettings);
    const environmentFilters = (0, FilterSettings_1.getConcreteProperty)("recommendations", "environment", filteringSettings);
    const relevantData = assessments.filter(a => {
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
    const statusFilters = (0, FilterSettings_1.getConcreteProperty)("alerts", "status", filteringSettings);
    const severityFilters = (0, FilterSettings_1.getConcreteProperty)("alerts", "severity", filteringSettings);
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
    const cloudFilters = (0, FilterSettings_1.getConcreteProperty)("connectors", "cloudExplorer", filteringSettings);
    return connectors.filter(a => {
        if (cloudFilters?.findIndex(cloudExplorer => { return cloudExplorer.option === a.cloudProvider && cloudExplorer.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.connectorsFiltering = connectorsFiltering;
//# sourceMappingURL=FilterCommand.js.map