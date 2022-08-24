"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsWithAzureMonitor = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const constants_1 = require("../constants");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
//Sends SMS messages, using Monitor service of Azure Monitor
async function sendSmsWithAzureMonitor(context, subscriptionId, monitor) {
    const _monitor = monitor;
    const name = _monitor.getResourceGroup();
    try {
        const ans = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Verifying the requirements to complete this action ...`,
            });
            //return await _monitor.verifyRequiredInfrastructure();
            //NOTE: Preventing access to a private Azure account 
            return false;
        });
        if (ans) {
            await axios_1.default.get(constants_1.Constants.sendSmsByAzureFunction(name));
            const phone = (await (0, ConfigUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, subscriptionId)).notificationSettings?.phoneNumber;
            await vscode.window.showInformationMessage(`SMS message will be sent in a few minutes.${phone !== undefined ? "to:" + phone : ""}`);
        }
        else {
            await vscode.window.showErrorMessage("Couldn't verify the requirements to complete this action");
        }
    }
    catch (error) {
        await vscode.window.showErrorMessage("SMS won't be sent due to an error. Try again later");
    }
}
exports.sendSmsWithAzureMonitor = sendSmsWithAzureMonitor;
const latency = () => {
    const a = setTimeout(() => {
        return false;
    }, 1000);
};
//# sourceMappingURL=SendSmsAM.js.map