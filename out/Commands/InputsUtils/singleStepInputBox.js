"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleStepPickInputBox = exports.singleStepInputBox = void 0;
const vscode = require("vscode");
//Shows inputBoxMenu
async function singleStepInputBox(placeHolder, title, value) {
    const options = {
        "placeHolder": placeHolder,
        "title": title,
        "ignoreFocusOut": true,
        value: value ? value : ''
    };
    const input = await vscode.window.showInputBox(options);
    return input !== undefined ? input : "";
}
exports.singleStepInputBox = singleStepInputBox;
//Shows quickPickInputBox
async function singleStepPickInputBox(items, title) {
    const options = {
        "canPickMany": false,
        "title": title
    };
    const picked = await vscode.window.showQuickPick(items);
    return picked !== undefined ? picked : "";
}
exports.singleStepPickInputBox = singleStepPickInputBox;
//# sourceMappingURL=singleStepInputBox.js.map