"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showFilteringMenu = void 0;
const vscode = require("vscode");
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
//# sourceMappingURL=FilterSettingsInput.js.map