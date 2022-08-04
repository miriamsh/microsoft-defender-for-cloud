"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmailNotificationSettings = exports.sendSmsNotification = exports.getSmsNotificationSettings = exports.setSmsNotificationSettings = void 0;
const vscode = require("vscode");
const constants_1 = require("../constants");
const configOperations_1 = require("../configOperations");
const communication_phone_numbers_1 = require("@azure/communication-phone-numbers");
const resourceGroupName = "vscodeExSmsNotification";
const communicationResourceName = "smsNotification-1";
// PUT: sets or updates SMS notification settings per subscription.Uses SmsClient, and saves the details as a configuration
async function setSmsNotificationSettings(resourceClient, communicationClient, credentials, context) {
    await checkCommunicationServiceResource(resourceClient, communicationClient, context).then(async (permission) => {
        if (permission && permission === true) {
            await purchasePhoneNumber(credentials);
            vscode.window.showInputBox().then();
        }
    });
}
exports.setSmsNotificationSettings = setSmsNotificationSettings;
async function purchasePhoneNumber(credentials) {
    const endpoint = `https://${communicationResourceName}.communication.azure.com`;
    const connectionString = `endpoint=https://smsnotification-1.communication.azure.com/;accessKey=${credentials}`;
    const client = new communication_phone_numbers_1.PhoneNumbersClient(connectionString);
    const searchRequest = {
        countryCode: "US",
        phoneNumberType: "tollFree",
        assignmentType: "application",
        capabilities: {
            sms: "outbound",
            calling: "outbound"
        },
        quantity: 1
    };
    const searchPoller = await client.beginSearchAvailablePhoneNumbers(searchRequest).catch();
    // The search is underway. Wait to receive searchId.
    const searchResults = await searchPoller.pollUntilDone();
    console.log(`Found phone number: ${searchResults.phoneNumbers[0]}`);
    console.log(`searchId: ${searchResults.searchId}`);
    const t = client.beginPurchasePhoneNumbers(searchResults.searchId);
}
async function getSmsNotificationSettings() {
    //checks if a resource exists (using connection string from configuration etc.)
    //if not- call createCommunicationServiceResource, and then setNotificationSettings
    //else: returns the Sms settings from configuration
}
exports.getSmsNotificationSettings = getSmsNotificationSettings;
//POST: creating azure communication services resource, if not exists. returns connection string
async function checkCommunicationServiceResource(resourceClient, communicationClient, context) {
    try {
        //const id = "'/subscriptions/2f69bcc6-e7d1-4de5-9006-d8ede4c4c6d5/resourceGroups/notificationForVscodevb01/providers/Microsoft.Communication/communicationServices/superheart'";
        const result = await communicationClient.communicationService.get(resourceGroupName, communicationResourceName).then(d => { return true; }).catch((error) => {
            //NOTE:check the type of the error
            if (error.code === 'ResourceNotFound' || 'ResourceGroupNotFound') {
                return vscode.window.showInformationMessage("Azure communication services doesn't exists in the current subscription", "Create Resource", "Cancel").then(pick => {
                    if (pick === "Create Resource") {
                        return vscode.window.showInformationMessage("Note: In this operation you will be charged the required rate", "OK", "Cancel").then(async (pick) => {
                            if (pick === "OK") {
                                return await createCommunicationServiceResource(resourceClient, communicationClient);
                            }
                        });
                    }
                    return false;
                });
            }
            else {
                vscode.window.showErrorMessage("Error occurred while trying to get to Communication Services resource. Try again later.");
                return false;
            }
        });
        return result;
    }
    catch (err) {
        vscode.window.showErrorMessage("" + err);
        return Promise.resolve(false);
    }
    ;
}
async function createCommunicationServiceResource(resourceClient, communicationClient) {
    try {
        const resourceGroup = await resourceClient.resourceGroups.createOrUpdate(resourceGroupName, { "location": "eastus" });
        const service = {
            "location": "Global",
            "dataLocation": "United States"
        };
        const params = {
            "parameters": service
        };
        const id = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Creating communication services resource ...`
            });
            const resource = await communicationClient.communicationService.beginCreateOrUpdate(resourceGroupName, communicationResourceName, params);
        });
        vscode.window.showInformationMessage("Resource created successfully. Resource id will be shown soon");
        return true;
    }
    catch (error) {
        vscode.window.showErrorMessage("Error ocurred while creating Communication Services resource.");
        return false;
    }
}
async function sendSmsNotification() {
    //calls getSmsNotificationSettings
    //now, should have the sms settings
    //uses arm-smsSend client to send sms message
}
exports.sendSmsNotification = sendSmsNotification;
//PUT: sets or updates email notification settings per subscription. uses SecurityCenter client
async function setEmailNotificationSettings(client) {
    const contactsDetails = {
        email: "b-mkleiner@microsoft.com",
        phone: "0587171443",
        alertNotifications: "on",
        alertsToAdmins: "on"
    };
    await client.securityContacts.create("default", contactsDetails).then(async (response) => {
        await (0, configOperations_1.setConfigurationSettings)(constants_1.extensionPrefix, constants_1.notificationSettings, client.subscriptionId, response, vscode.ConfigurationTarget.Global);
    }).catch(error => {
        console.log(error.message);
    });
}
exports.setEmailNotificationSettings = setEmailNotificationSettings;
// multiStepInput(context)
//     .catch(console.error);
// const properties: DeploymentProperties = {
//     "mode": "Incremental",
//     // "templateLink": {
//     //     "relativePath": './communicationSerivces01.json'
//     // }
//     "template": {
//         "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
//         "contentVersion": "1.0.0.0",
//         "parameters": {},
//         "functions": [],
//         "variables": {},
//         "resources": [
//             {
//                 "type": "Microsoft.Communication/communicationServices",
//                 "apiVersion": "2021-10-01-preview",
//                 "name": "smsNotification",
//                 "location": "Global",
//                 "properties": {
//                     "dataLocation": "United States"
//                 }
//             }
//         ],
//         "outputs": {}
//     }
// };
// const deployment: Deployment = {
//     "properties": properties
// };
//const resource = await resourceClient.deployments.beginCreateOrUpdate(resourceGroup.name!, "deploymentCommunication", deployment);
// const resource = await resourceClient.resources.beginCreateOrUpdate(resourceGroupName,"Microsoft.Communication","","communicationServices","SmsNotification-01","2021-10-01-preview",);
// const existence=await resourceClient.resources.checkExistenceById();
//# sourceMappingURL=NotificationSettingsCommand.js.map