"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBy = void 0;
const vscode = require("vscode");
const filtering_1 = require("../Models/filtering");
async function filterBy(context, key, filters, category) {
    try {
        const picks = await vscode.window.showQuickPick(filters, {
            canPickMany: true,
            placeHolder: `Filter ${category} By...`,
        });
        if (picks) {
            filters.map(f => {
                if (picks.indexOf(f) === -1) {
                    f.picked = false;
                }
            });
            context.globalState.update(`${key}`, filters);
            const filterBy = new filtering_1.Filtering(category, picks.map(p => p.label));
            console.log(picks);
        }
    }
    catch (error) {
        throw error;
    }
}
exports.filterBy = filterBy;
//# sourceMappingURL=filterByCommand.js.map