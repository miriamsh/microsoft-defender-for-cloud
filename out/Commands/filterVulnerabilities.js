"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorsFiltering = exports.alertsFiltering = exports.recommendationsFiltering = exports.selectFiltersCommand = void 0;
const vscode = require("vscode");
const FilterSettings_1 = require("../Models/FilterSettings");
const Constants_1 = require("../Constants");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const FilterSettingsInput_1 = require("./Inputs/FilterSettingsInput");
const AffectedResourceTreeItem_1 = require("../VulnerabilitiesTree/Security Alerts/AffectedResourceTreeItem");
async function selectFiltersCommand(args, type, property) {
    const subscriptionId = args.parent.subscription.subscriptionId;
    const configurations = await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, subscriptionId);
    const filtersSettings = (0, FilterSettings_1.getConcreteProperty)(type, property, configurations);
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
        (0, FilterSettings_1.updateConcreteProperty)(type, property, (0, FilterSettings_1.getConcreteProperty)(type, property, configurations), configurations, newFilters);
        const updatedSettings = await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, subscriptionId);
        await (0, ConfigUtils_1.setConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.filtering, subscriptionId, updatedSettings, vscode.ConfigurationTarget.Global);
        args.refresh();
    }
}
exports.selectFiltersCommand = selectFiltersCommand;
//Filters recommendations vulnerability list
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
        if (environmentFilters?.findIndex(environment => { return environment.option === a.environment && environment.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.recommendationsFiltering = recommendationsFiltering;
//Filters alerts vulnerability list
//TODO: IMP
function alertsFiltering(filteringSettings, affectedResources) {
    const statusFilters = (0, FilterSettings_1.getConcreteProperty)("alerts", "status", filteringSettings);
    const severityFilters = (0, FilterSettings_1.getConcreteProperty)("alerts", "severity", filteringSettings);
    let filteredAffectedResource = [];
    affectedResources.map((resource) => {
        let relevantData = resource.children.filter(alert => {
            if (statusFilters?.findIndex(status => { return status.option === alert.status && status.enable; }) !== -1) {
                return alert;
            }
            ;
        });
        relevantData = relevantData.filter(alert => {
            if (severityFilters?.findIndex(severity => { return severity.option === alert.severity && severity.enable; }) !== -1) {
                return alert;
            }
            ;
        });
        if (relevantData.length > 0) {
            const updatedAffectedResource = new AffectedResourceTreeItem_1.AffectedResourceTreeItem(resource.label, resource.parent);
            updatedAffectedResource.children = relevantData;
            filteredAffectedResource.push(updatedAffectedResource);
        }
    });
    return filteredAffectedResource;
}
exports.alertsFiltering = alertsFiltering;
//filters connectors vulnerability list
function connectorsFiltering(filteringSettings, connectors) {
    const cloudFilters = (0, FilterSettings_1.getConcreteProperty)("connectors", "cloudProvider", filteringSettings);
    return connectors.filter(a => {
        if (cloudFilters?.findIndex(cloudExplorer => { return cloudExplorer.option === a.cloudProvider && cloudExplorer.enable; }) !== -1) {
            return a;
        }
        ;
    });
}
exports.connectorsFiltering = connectorsFiltering;
//# sourceMappingURL=FilterVulnerabilities.js.map