"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode = require("vscode");
const constants_1 = require("../constants");
const configUtils_1 = require("../Utility/configUtils");
const arm_resources_1 = require("@azure/arm-resources");
const arm_communication_1 = require("@azure/arm-communication");
const communication_phone_numbers_1 = require("@azure/communication-phone-numbers");
// import { multiStepInput } from "../multiStepInput";
class Notification {
    constructor(subscription) {
        this.resourceGroupName = "vscodeExSmsNotification";
        this.communicationResourceName = "smsNotification-2";
        this.subscription = subscription;
        this.resourceManagementClient = new arm_resources_1.ResourceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.communicationManagementClient = new arm_communication_1.CommunicationServiceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.securityCenterClient = new arm_security_1.SecurityCenter(subscription.credentials, subscription.subscriptionId);
    }
    //SetSmsNotification Command
    async setSmsNotificationSettings() {
        const ans = await this.verifyRequiredInfrastructure();
        if (ans) {
            const set = await this.setPhoneNumbersAsConfig();
            if (set) {
                return true;
            }
        }
        return false;
    }
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
            const connectionString = await (await this.getAccessKey()).primaryConnectionString;
            this.phoneNumberClient = new communication_phone_numbers_1.PhoneNumbersClient(connectionString);
            const purchasedPhone = (await (await this.phoneNumberClient.listPurchasedPhoneNumbers()).byPage().next()).value;
            //const purchasedPhone = [];           
            if (purchasedPhone.length > 0) {
                return true;
            }
        }
        const phoneNumber = await this.purchasePhoneNumber();
        if (phoneNumber === "") {
            return false;
        }
        (0, configUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.smsNotificationSettings, this.subscription.subscriptionId, { "from": phoneNumber, "to": "" }, vscode.ConfigurationTarget.Global);
        return true;
    }
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
        try {
            const pick = await vscode.window.showInformationMessage("Azure communication Services is required, and doesn't exist in this subscription", "Create Resource", "Cancel");
            if (pick === "Create Resource") {
                {
                    const resourceGroupParams = {
                        "location": "eastus"
                    };
                    await this.resourceManagementClient.resourceGroups.createOrUpdate(this.communicationResourceName, resourceGroupParams);
                    const properties = {
                        "location": "Global",
                        "dataLocation": "United States",
                    };
                    const params = {
                        "parameters": properties,
                    };
                    //Show vscode loader
                    const resource = await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                    }, async (progress) => {
                        progress.report({
                            message: `Creating Communication Services resource ...`
                        });
                        return await this.communicationManagementClient.communicationService.beginCreateOrUpdateAndWait(this.resourceGroupName, this.communicationResourceName, params);
                    });
                    //save the accessKey for the resource as config
                    //const accessKey=await this.communicationManagementClient.communicationService.listKeys(this.resourceGroupName, this.communicationResourceName);
                    //await setConfigurationSettings(extensionPrefix, communicationResourceAccessKey,this.subscriptionId, {"accessKey":accessKey.primaryConnectionString},vscode.ConfigurationTarget.Global);
                    await vscode.window.showInformationMessage("Communication Services resource created successfully. Resource id:" + resource.id);
                    return true;
                }
            }
            else {
                await vscode.window.showErrorMessage("The action is cancelled");
                return false;
            }
        }
        catch (error) {
            await vscode.window.showErrorMessage("Error ocurred while creating Communication Services resource. " + error);
            return false;
        }
    }
    //Purchase phone number
    async purchasePhoneNumber() {
        try {
            const purchase = await vscode.window.showInformationMessage("Purchase a Phone number. Note: In this operation you will be charged the required rate", "OK", "Cancel");
            if (purchase === "OK") {
                if (this.phoneNumberClient === undefined) {
                    const connectionString = await (await this.getAccessKey()).primaryConnectionString;
                    this.phoneNumberClient = new communication_phone_numbers_1.PhoneNumbersClient(connectionString);
                }
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
                const searchPoller = await this.phoneNumberClient.beginSearchAvailablePhoneNumbers(searchRequest);
                // The search is underway. Wait to receive searchId.
                const searchResults = await searchPoller.pollUntilDone();
                console.log(`Found phone number: ${searchResults.phoneNumbers[0]}`);
                console.log(`searchId: ${searchResults.searchId}`);
                const purchasePoller = await this.phoneNumberClient.beginPurchasePhoneNumbers(searchResults.searchId);
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
    //Return accessKey for Azure Communication Services resource
    async getAccessKey() {
        const accessKey = await this.communicationManagementClient.communicationService.listKeys(this.resourceGroupName, this.communicationResourceName);
        return accessKey;
    }
    //Get a phone list  as an input, save it as config
    async setPhoneNumbersAsConfig() {
        const phonesList = await this.inputBox("6505135041, 9508477714", "List of phone numbers (separated by commas)");
        if (phonesList === "") {
            vscode.window.showErrorMessage("No phone numbers have been entered");
            return false;
        }
        const smsConfig = (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.smsNotificationSettings)[this.subscription.subscriptionId];
        await (0, configUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.smsNotificationSettings, this.subscription.subscriptionId, { "from": smsConfig.from, "to": phonesList }, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("The recipient's phone list saved successfully");
        return true;
    }
    //Show inputBoxMenu
    async inputBox(placeHolder, title) {
        const options = {
            "placeHolder": placeHolder,
            "title": title,
            "ignoreFocusOut": true
        };
        const input = await vscode.window.showInputBox(options);
        return input !== undefined ? input : "";
    }
}
exports.Notification = Notification;
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
//# sourceMappingURL=SetSmsNotificationSettingsCommand.js.map