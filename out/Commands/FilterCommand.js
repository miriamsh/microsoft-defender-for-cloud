"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsFiltering = exports.selectFilters = void 0;
const vscode = require("vscode");
async function selectFilters(filters, category) {
    try {
        const picks = await vscode.window.showQuickPick(filters, {
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
exports.selectFilters = selectFilters;
function recommendationsFiltering(filteringSettings, assesments) {
    const statusFilters = filteringSettings.recommendations.get('status');
    const severityFilters = filteringSettings.recommendations.get('severity');
    const cloudFilters = filteringSettings.recommendations.get('environment');
    const temp = assesments;
    let relevantData = temp.filter(a => {
        if (statusFilters?.findIndex(status => { return status.option === a.status && status.enable; }) !== -1) {
            return a;
        }
        ;
    });
    relevantData = relevantData.filter(a => {
        if (cloudFilters?.findIndex(status => { return status.option === a.cloud && status.enable; }) !== -1) {
            return a;
        }
        ;
    });
    return relevantData;
}
exports.recommendationsFiltering = recommendationsFiltering;
//# sourceMappingURL=FilterCommand.js.map