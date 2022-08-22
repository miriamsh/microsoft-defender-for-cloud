"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmailNotificationSettings = void 0;
const vscode = require("vscode");
const emailSettingsInputs_1 = require("./InputsUtils/emailSettingsInputs");
const constants_1 = require("../constants");
const configUtils_1 = require("../Utility/configUtils");
//Sets or updates email notification for alerts 
async function setEmailNotificationSettings(context, client, subscription) {
    let contactsDetails;
    const _client = client;
    await (0, emailSettingsInputs_1.emailSettingsInput)(context, subscription).then(response => {
        contactsDetails = response;
    }).catch(console.error);
    await _client.getSecurityCenterClient().securityContacts.create("default", contactsDetails).then(async (response) => {
        await (0, configUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.emailNotificationSettings, _client.getSecurityCenterClient().subscriptionId, response, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("Email notification settings are updated successfully.");
    }).then().catch(error => {
        vscode.window.showErrorMessage("Error while saving Email notification settings.");
    });
}
exports.setEmailNotificationSettings = setEmailNotificationSettings;
//# sourceMappingURL=setEmailSettings.js.map