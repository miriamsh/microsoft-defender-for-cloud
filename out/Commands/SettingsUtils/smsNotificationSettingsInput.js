"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleStepInputBox = void 0;
const vscode = require("vscode");
//Shows inputBoxMenu
async function singleStepInputBox(placeHolder, title) {
    const options = {
        "placeHolder": placeHolder,
        "title": title,
        "ignoreFocusOut": true
    };
    const input = await vscode.window.showInputBox(options);
    return input !== undefined ? input : "";
}
exports.singleStepInputBox = singleStepInputBox;
//# sourceMappingURL=smsNotificationSettingsInput.js.map