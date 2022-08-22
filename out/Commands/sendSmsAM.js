"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsWithAzureMonitor = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
//Sends SMS messages, using Monitor service of Azure Monitor
async function sendSmsWithAzureMonitor(context, client, monitor) {
    const _monitor = monitor;
    const name = _monitor.getResourceGroup();
    const ans = await _monitor.verifyRequiredInfrastructure();
    if (ans) {
        const response = await axios_1.default.get(`https://today2dayfunc.azurewebsites.net/api/HttpTrigger1?code=nDhyw-27FKoetpSDlQHEHLsvrKknUQ5Lc3ZcabGU8QSxAzFuobKWig==&name=${name}`).then(async (res) => {
            //const phone = getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId,
            await vscode.window.showInformationMessage("SMS message will be sent in a few minutes");
        }).catch(async (error) => {
            await vscode.window.showErrorMessage("SMS won't be sent due to an error. Try again later");
        });
    }
    else {
        await vscode.window.showErrorMessage("Couldn't complete the required operations for sending the SMS message");
    }
}
exports.sendSmsWithAzureMonitor = sendSmsWithAzureMonitor;
//# sourceMappingURL=sendSmsAM.js.map