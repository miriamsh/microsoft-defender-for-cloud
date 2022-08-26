"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSmsNotification = void 0;
const vscode = require("vscode");
const Constants_1 = require("../Constants");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const setSmsNotification = async (subscriptionId, monitor) => {
    const _monitor = monitor;
    const name = (await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.actionGroupId, subscriptionId))?.notificationSettings?.name;
    const code = (await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.actionGroupId, subscriptionId))?.notificationSettings?.code;
    const phone = (await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.actionGroupId, subscriptionId))?.notificationSettings?.phone;
    const actionGroupParams = await _monitor.getActionGroupParams(name, code, phone);
    const alertRule = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
    }, async (progress) => {
        progress.report({
            message: `Saving SMS settings ...`
        });
        const actionGroup = await _monitor.createActionGroup(actionGroupParams);
        return actionGroup ? await _monitor.createAlertRule() : false;
    });
    if (alertRule) {
        await vscode.window.showInformationMessage("SMS settings have been saved successfully");
        return;
    }
    await vscode.window.showErrorMessage("Error while saving SMS notification");
    return;
};
exports.setSmsNotification = setSmsNotification;
//# sourceMappingURL=SetSmsSettingsAM.js.map