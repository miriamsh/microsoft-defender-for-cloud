import * as vscode from 'vscode'
import { SecurityContact } from "@azure/arm-security";
import { emailSettingsInput } from './Inputs/EmailSettingsInputs';
import { ISubscriptionContext } from 'vscode-azureextensionui';
import { Constants } from '../Constants';
import { Client } from '../Utility/ClientUtils';
import { setConfigurationSettings } from '../Utility/ConfigUtils';


//Sets or updates email notification for alerts 
export async function setEmailNotificationSettings(context: vscode.ExtensionContext, client: Client, subscription: ISubscriptionContext) {

    let contactsDetails: SecurityContact;
    const _client: Client = client;

    await emailSettingsInput(context, subscription).then(response => {
        contactsDetails = response;
    }).catch(console.error);
    try {
        const data = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Saving Email notification settings ...`
            });
            return await _client.getSecurityCenterClient().securityContacts.create("default", contactsDetails!);
        });
        await setConfigurationSettings(Constants.extensionPrefix, Constants.emailNotificationSettings, _client.getSecurityCenterClient().subscriptionId, data, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("Email notification settings have been saved successfully");

    }
    catch (error) {
        vscode.window.showErrorMessage("Error occurred while saving Email notification settings");
    }

}