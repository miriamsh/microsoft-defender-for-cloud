"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorsFiltering = exports.alertsFiltering = exports.recommendationsFiltering = exports.selectFiltersCommand = void 0;
const vscode = require("vscode");
const filterSettings_1 = require("../Models/filterSettings");
const constants_1 = require("../constants");
const configUtils_1 = require("../Utility/configUtils");
const FilterSettingsInput_1 = require("./FilteringUtils/FilterSettingsInput");
async function selectFiltersCommand(args, type, property) {
    const subscriptionId = args.parent.subscription.subscriptionId;
    const configurations = await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, subscriptionId);
    const filtersSettings = (0, filterSettings_1.getConcreteProperty)(type, property, configurations);
    const quickPickItems = filtersSettings.map((filter) => {
        return {
            label: `${filter.option}`,
            picked: filter.enable
        };
    });
    ;
    const picks = await (0, FilterSettingsInput_1.showFilteringMenu)(quickPickItems, property).then(data => {
        return data?.map(p => p.label);
    });
    if (picks) {
        const newFilters = filtersSettings.map((f) => {
            f.enable = picks.indexOf(f.option) !== -1;
            return f;
        });
        await (0, configUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, subscriptionId, (0, filterSettings_1.updateConcreteProperty)(type, property, (0, filterSettings_1.getConcreteProperty)(type, property, configurations), configurations, newFilters), vscode.ConfigurationTarget.Global);
        args.refresh();
    }
}
exports.selectFiltersCommand = selectFiltersCommand;
//Filters recommendations vulnerability list
function recommendationsFiltering(filteringSettings, assessments) {
    const statusFilters = (0, filterSettings_1.getConcreteProperty)("recommendations", "status", filteringSettings);
    const environmentFilters = (0, filterSettings_1.getConcreteProperty)("recommendations", "environment", filteringSettings);
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
//Filters alerts vulnerability list
//TODO: Change format, to match the requirements
function alertsFiltering(filteringSettings, affectedResources) {
    const statusFilters = (0, filterSettings_1.getConcreteProperty)("alerts", "severity", filteringSettings);
    const severityFilters = (0, filterSettings_1.getConcreteProperty)("alerts", "status", filteringSettings);
    let filteredAffectedResource = [];
    affectedResources.map((resource) => {
        let relevantData = resource.children.filter(alert => {
            if (statusFilters?.findIndex(status => { return status.option === alert.status && status.enable; }) !== -1) {
                return alert;
            }
            ;
        });
        relevantData.filter(alert => {
            if (severityFilters?.findIndex(severity => { return severity.option === alert.severity && severity.enable; }) !== -1) {
                return alert;
            }
            ;
        });
        if (relevantData !== undefined) {
            const updatedaffectedResource = resource;
            updatedaffectedResource.children = relevantData;
            filteredAffectedResource.push(updatedaffectedResource);
        }
    });
    return filteredAffectedResource;
}
exports.alertsFiltering = alertsFiltering;
//filters connectors vulnerability list
function connectorsFiltering(filteringSettings, connectors) {
    const cloudFilters = (0, filterSettings_1.getConcreteProperty)("connectors", "cloudProvider", filteringSettings);
    return connectors.filter(a => {
        if (cloudFilters?.findIndex(cloudExplorer => { return cloudExplorer.option === a.cloudProvider && cloudExplorer.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.connectorsFiltering = connectorsFiltering;
//# sourceMappingURL=filterVulnerabilities.js.map