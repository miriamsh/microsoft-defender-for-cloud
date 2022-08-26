"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationServices = void 0;
const vscode = require("vscode");
const Constants_1 = require("../Constants");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const communication_phone_numbers_1 = require("@azure/communication-phone-numbers");
const SingleStepInputBox_1 = require("../Commands/Inputs/SingleStepInputBox");
class CommunicationServices {
    constructor(subscription, client) {
        this.resourceGroupName = "vscodeExSmsNotification";
        this.communicationResourceName = "smsNotification";
        this.subscription = subscription;
        this._client = client;
        this.resourceManagementClient = client.getResourceManagementClient();
        this.communicationManagementClient = client.getCommunicationManagementClient();
    }
    //Checks (and creates if needed) the required infrastructure for sending SMS messages
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
        await (0, ConfigUtils_1.setConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.smsNotificationSettings, this.subscription.subscriptionId, { "from": phoneNumber, "to": "" }, vscode.ConfigurationTarget.Global);
        return true;
    }
    //Checks existence of Azure Communication Services resource
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
    //Creates Azure Communication Services resource
    async createCommunicationServiceResource() {
        try {
            const pick = await vscode.window.showInformationMessage("Azure communication Services is required, and doesn't exist in this subscription", "Create Resource", "Cancel");
            if (pick === "Create Resource") {
                {
                    //TODO:set these properties as configuration settings
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
    //Purchases a phone number
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
    //Returns accessKey for Azure Communication Services resource
    async getAccessKey() {
        const accessKey = await this.communicationManagementClient.communicationService.listKeys(this.resourceGroupName, this.communicationResourceName);
        return accessKey;
    }
    //Gets a phone list  as an input, saves it as config
    async updateToPhoneNumber() {
        const phonesList = await (0, SingleStepInputBox_1.singleStepInputBox)("6505135041, 9508477714", "List of phone numbers (separated by commas)");
        if (phonesList === "") {
            vscode.window.showErrorMessage("No phone numbers have been entered");
            return false;
        }
        const smsConfig = await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.smsNotificationSettings, this.subscription.subscriptionId);
        await (0, ConfigUtils_1.setConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.smsNotificationSettings, this.subscription.subscriptionId, { "from": smsConfig.from, "to": phonesList }, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("The recipient's phone list saved successfully");
        return true;
    }
}
exports.CommunicationServices = CommunicationServices;
//# sourceMappingURL=CommunicationServices.js.map