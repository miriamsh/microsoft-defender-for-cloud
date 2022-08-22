"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSmsNotification = void 0;
const vscode = require("vscode");
const constants_1 = require("../constants");
const configUtils_1 = require("../Utility/configUtils");
const setSmsNotification = async (subscriptionId, monitor) => {
    const _monitor = monitor;
    const name = (await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, subscriptionId))?.notificationSettings?.name;
    const code = (await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, subscriptionId))?.notificationSettings?.code;
    const phone = (await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, subscriptionId))?.notificationSettings?.phone;
    const actionGroup = await _monitor.createActionGroup(name, code, phone);
    if (actionGroup === true) {
        const alertRule = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Saving SMS settings ...`
            });
            return await _monitor.createAlertRule();
        });
        if (alertRule === true) {
            await vscode.window.showInformationMessage("SMS settings have been saved successfully");
            return;
        }
    }
    await vscode.window.showErrorMessage("Error while saving SMS notification");
    return;
};
exports.setSmsNotification = setSmsNotification;
//# sourceMappingURL=setSmsSettingsAM.js.map