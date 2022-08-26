"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmailNotificationSettings = void 0;
const vscode = require("vscode");
const EmailSettingsInputs_1 = require("./Inputs/EmailSettingsInputs");
const Constants_1 = require("../Constants");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
//Sets or updates email notification for alerts 
async function setEmailNotificationSettings(context, client, subscription) {
    let contactsDetails;
    const _client = client;
    await (0, EmailSettingsInputs_1.emailSettingsInput)(context, subscription).then(response => {
        contactsDetails = response;
    }).catch(console.error);
    try {
        const data = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Saving Email notification settings ...`
            });
            return await _client.getSecurityCenterClient().securityContacts.create("default", contactsDetails);
        });
        await (0, ConfigUtils_1.setConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.emailNotificationSettings, _client.getSecurityCenterClient().subscriptionId, data, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("Email notification settings have been saved successfully");
    }
    catch (error) {
        vscode.window.showErrorMessage("Error occurred while saving Email notification settings");
    }
}
exports.setEmailNotificationSettings = setEmailNotificationSettings;
//# sourceMappingURL=SetEmailSettings.js.map