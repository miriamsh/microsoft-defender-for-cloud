import * as vscode from 'vscode'
import { SecurityContact } from "@azure/arm-security";
import { multiStepInput } from './SettingsServices/emailNotificationSettingsInput';
import { ISubscriptionContext } from 'vscode-azureextensionui';
import { Constants } from '../constants';
import { setConfigurationSettings } from '../Utility/configUtils';
import { Client } from '../Utility/clientUtils';


//Sets or updates email notification for alerts 
export  async function setEmailNotificationSettings(context: vscode.ExtensionContext,client:Client, subscription: ISubscriptionContext) {

    let contactsDetails: SecurityContact;
    const _client:Client = client;

    await multiStepInput(context, subscription).then(response => {
        contactsDetails = response;
    }).catch(console.error);

    await _client.getSecurityCenterClient().securityContacts.create("default", contactsDetails!).then(async (response) => {
        await setConfigurationSettings(Constants.extensionPrefix, Constants.emailNotificationSettings, _client.getSecurityCenterClient().subscriptionId, response, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("Email notification settings are updated successfully.");
    }).then().catch(error => {
        vscode.window.showErrorMessage("Error while saving Email notification settings.");
    });

}