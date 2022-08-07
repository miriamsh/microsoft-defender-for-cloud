"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode = require("vscode");
const constants_1 = require("../constants");
const configOperations_1 = require("../configOperations");
const arm_resources_1 = require("@azure/arm-resources");
const arm_communication_1 = require("@azure/arm-communication");
const communication_phone_numbers_1 = require("@azure/communication-phone-numbers");
//ToDo:
//function for setSmsNotification
//add for each subscription notify object
//function to check the phone existence
//the send function itself
class Notification {
    constructor(subscriptionId, credentials, context) {
        this.resourceGroupName = "vscodeExSmsNotification";
        this.communicationResourceName = "smsNotification-2";
        this.subscriptionId = subscriptionId;
        this.credentials = credentials;
        this.context = context;
        this.resourceManagementClient = new arm_resources_1.ResourceManagementClient(this.credentials, this.subscriptionId);
        this.communicationManagementClient = new arm_communication_1.CommunicationServiceManagementClient(this.credentials, this.subscriptionId);
        this.securityCenterClient = new arm_security_1.SecurityCenter(this.credentials, this.subscriptionId);
    }
    //Required:: check if there is a phone number
    //Checks (and creates if needed) the required infrastructure for send sms messages
    async verifyRequiredInfrastructure() {
        const exists = await this.checkExistenceResource();
        if (exists === undefined) {
            return false;
        }
        if (!exists) {
            const createdResource = await this.createCommunicationServiceResource();
            if (!createdResource) {
                return false;
            }
        }
        if (exists) {
            //check if there is a phone number
            //if yes (save if as config?) return true;
        }
        const phoneNumber = await this.purchasePhoneNumber(this.credentials);
        if (phoneNumber === "") {
            return false;
        }
        (0, configOperations_1.setConfigurationSettings)(constants_1.extensionPrefix, constants_1.smsNotificationSettings, this.subscriptionId, { "from": phoneNumber, "to": "" }, vscode.ConfigurationTarget.Global);
        return true;
    }
    ;
    //Check existence of Azure Communication Services resource
    async checkExistenceResource() {
        try {
            await this.communicationManagementClient.communicationService.get(this.resourceGroupName, this.communicationResourceName);
            return true;
        }
        catch (error) {
            if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
                return false;
            }
            vscode.window.showErrorMessage("Error occurred while trying to get to Communication Services resource. Try again later.");
            return undefined;
        }
    }
    //Create Azure Communication Services resource
    async createCommunicationServiceResource() {
        const resourcegroupParams = {
            "location": "eastus"
        };
        const resourceGroup = this.resourceManagementClient.resourceGroups.createOrUpdate(this.communicationResourceName, resourcegroupParams);
        try {
            const pick = await vscode.window.showInformationMessage("Azure communication services doesn't exist in the current subscription", "Create Resource", "Cancel");
            if (pick === "Create Resource") {
                {
                    const properties = {
                        "location": "Global",
                        "dataLocation": "United States",
                    };
                    const params = {
                        "parameters": properties,
                    };
                    //Show vscode loader
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                    }, async (progress) => {
                        progress.report({
                            message: `Creating communication services resource ...`
                        });
                        await this.communicationManagementClient.communicationService.beginCreateOrUpdate(this.resourceGroupName, this.communicationResourceName, params);
                    });
                    vscode.window.showInformationMessage("Resource created successfully. Resource id will be shown soon");
                    return true;
                }
            }
            else {
                vscode.window.showErrorMessage("The action is cancelled");
                return false;
            }
        }
        catch (error) {
            vscode.window.showErrorMessage("Error ocurred while creating Communication Services resource.");
            return false;
        }
    }
    //Purchase phone number
    async purchasePhoneNumber(credentials) {
        try {
            const purchase = await vscode.window.showInformationMessage("Purchase a Phone number. Note: In this operation you will be charged the required rate", "OK", "Cancel");
            if (purchase === "OK") {
                const connectionString = `endpoint=https://${this.communicationResourceName}.communication.azure.com/;accessKey=${credentials}`;
                const phoneNumberClient = new communication_phone_numbers_1.PhoneNumbersClient(connectionString);
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
                const searchPoller = await phoneNumberClient.beginSearchAvailablePhoneNumbers(searchRequest);
                // The search is underway. Wait to receive searchId.
                const searchResults = await searchPoller.pollUntilDone();
                console.log(`Found phone number: ${searchResults.phoneNumbers[0]}`);
                console.log(`searchId: ${searchResults.searchId}`);
                const purchasePoller = await phoneNumberClient.beginPurchasePhoneNumbers(searchResults.searchId);
                const purchaseResult = await purchasePoller.pollUntilDone();
                console.log(`Purchase Result:${purchaseResult}`);
                return "00000000";
            }
            else {
                return "";
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
            return "";
        }
        //If the purchase is succeeded, return the phone number
        //else, show error message, return undefined;
    }
    //Set phone list with input, save it as config
    async setPhoneNumbersAsConfig() {
        const phonesList = await this.inputPhoneBox();
        if (phonesList === "") {
            return false;
        }
        const smsConfig = (0, configOperations_1.getConfigurationSettings)(constants_1.extensionPrefix, constants_1.smsNotificationSettings)[this.subscriptionId];
        (0, configOperations_1.setConfigurationSettings)(constants_1.extensionPrefix, constants_1.smsNotificationSettings, this.subscriptionId, { "from": smsConfig.from, "to": phonesList }, vscode.ConfigurationTarget.Global);
        return true;
    }
    //Show inputBoxMenu
    async inputPhoneBox() {
        const options = {
            "placeHolder": "list of recipient's phone numbers, separated by ;",
            "title": "Press phone numbers",
        };
        const phoneList = await vscode.window.showInputBox(options);
        return phoneList !== undefined ? phoneList : "";
    }
    //Sets or updates email notification for alerts 
    async setEmailNotificationSettings() {
        const contactsDetails = {
            email: "b-mkleiner@microsoft.com",
            phone: "0587171443",
            alertNotifications: "on",
            alertsToAdmins: "on"
        };
        await this.securityCenterClient.securityContacts.create("default", contactsDetails).then(async (response) => {
            await (0, configOperations_1.setConfigurationSettings)(constants_1.extensionPrefix, constants_1.emailNotificationSettings, this.securityCenterClient.subscriptionId, response, vscode.ConfigurationTarget.Global);
        }).catch(error => {
            console.log(error.message);
        });
    }
}
exports.Notification = Notification;
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