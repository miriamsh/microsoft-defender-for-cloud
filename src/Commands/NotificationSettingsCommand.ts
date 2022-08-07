import { SecurityCenter, SecurityContact, SecurityContacts, SecurityTask } from "@azure/arm-security";
import * as vscode from 'vscode';
import { extensionPrefix, emailNotificationSettings, smsNotificationSettings, communicationResourceAccessKey } from "../constants";
import { getConfigurationSettings, setConfigurationSettings } from '../configOperations';
import { ResourceManagementClient, DeploymentProperties, Deployment, ResourceGroup, DeploymentOperation, DeploymentOperations } from '@azure/arm-resources';
import { CommunicationServiceCreateOrUpdateOptionalParams, CommunicationService, CommunicationServiceGetOptionalParams, CommunicationServiceManagementClient, CommunicationServiceResource } from "@azure/arm-communication";
import { RestError, URLBuilder } from "@azure/ms-rest-js";
import { PhoneNumbersClient, PurchasePhoneNumbersResult, SearchAvailablePhoneNumbersRequest } from "@azure/communication-phone-numbers";
import { ISubscriptionContext } from "vscode-azureextensionui";


//ToDo:
//function for setSmsNotification
//add for each subscription notify object
//function to check the phone existence
//the send function itself


export class Notification {

    private readonly resourceGroupName: string = "vscodeExSmsNotification";
    private readonly communicationResourceName: string = "smsNotification-2";

    private resourceManagementClient: ResourceManagementClient;
    private communicationManagementClient: CommunicationServiceManagementClient;
    private securityCenterClient: SecurityCenter;
    private phoneNumberClient!: PhoneNumbersClient;
    private subscription: ISubscriptionContext;

    constructor(subscription: ISubscriptionContext) {
        this.subscription = subscription;
        this.resourceManagementClient = new ResourceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.communicationManagementClient = new CommunicationServiceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.securityCenterClient = new SecurityCenter(subscription.credentials, subscription.subscriptionId);
    }

    //SetSmsNotification Command
    public async setSmsNotificationSettings() {

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
    public async verifyRequiredInfrastructure(): Promise<boolean> {
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
            const connectionString = await (await this.getAccessKey()).primaryConnectionString!;
            this.phoneNumberClient = new PhoneNumbersClient(connectionString);
            const purchasedPhone = (await (await this.phoneNumberClient.listPurchasedPhoneNumbers()).byPage().next()).value;
            if (purchasedPhone.length > 0) {
                return true;
            }
        }

        const phoneNumber = await this.purchasePhoneNumber();
        if (phoneNumber === "") {
            return false;
        }
        setConfigurationSettings(extensionPrefix, smsNotificationSettings, this.subscription.subscriptionId, { "from": phoneNumber, "to": "" }, vscode.ConfigurationTarget.Global);
        return true;
    };

    //Check existence of Azure Communication Services resource
    async checkExistenceResource(): Promise<boolean | undefined> {
        try {
            await this.communicationManagementClient.communicationService.get(this.resourceGroupName, this.communicationResourceName);
            return true;
        }
        catch (error: RestError | any) {
            if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
                return false;
            }
            vscode.window.showErrorMessage("Error occurred while trying to get to Communication Services resource. Try again later.");
            return undefined;
        }
    }

    //Create Azure Communication Services resource
    async createCommunicationServiceResource(): Promise<boolean> {
        try {
            const pick = await vscode.window.showInformationMessage("Azure communication Services is required, and doesn't exist in this subscription", "Create Resource", "Cancel");
            if (pick === "Create Resource") {
                {
                    const resourceGroupParams: ResourceGroup = {
                        "location": "eastus"
                    };

                    await this.resourceManagementClient.resourceGroups.createOrUpdate(this.communicationResourceName, resourceGroupParams);

                    const properties: CommunicationServiceResource = {
                        "location": "Global",
                        "dataLocation": "United States",
                    };

                    const params: CommunicationServiceCreateOrUpdateOptionalParams = {
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
            await vscode.window.showErrorMessage("Error ocurred while creating Communication Services resource.");
            return false;
        }
    }

    //Purchase phone number
    async purchasePhoneNumber(): Promise<String> {
        try {
            const purchase = await vscode.window.showInformationMessage("Purchase a Phone number. Note: In this operation you will be charged the required rate", "OK", "Cancel")
            if (purchase === "OK") {

                if (this.phoneNumberClient === undefined) {
                    const connectionString = await (await this.getAccessKey()).primaryConnectionString!;
                    this.phoneNumberClient = new PhoneNumbersClient(connectionString);
                }

                const searchRequest: SearchAvailablePhoneNumbersRequest = {
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
        const phonesList = await this.inputPhoneBox();
        if (phonesList === "") {
            vscode.window.showErrorMessage("No phone numbers have been entered");
            return false;
        }
        const smsConfig = getConfigurationSettings(extensionPrefix, smsNotificationSettings)[this.subscription.subscriptionId];
        await setConfigurationSettings(extensionPrefix, smsNotificationSettings, this.subscription.subscriptionId, { "from": smsConfig.from, "to": phonesList }, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("The recipient's phone list saved successfully");
        return true;
    }

    //Show inputBoxMenu
    async inputPhoneBox(): Promise<string> {
        const options: vscode.InputBoxOptions = {
            "placeHolder": "list of phone numbers, separated by ,",
            "title": "Enter phone numbers to send the sms messages to",
        };
        const phoneList = await vscode.window.showInputBox(options);
        return phoneList !== undefined ? phoneList : "";
    }

    //Sets or updates email notification for alerts 
    public async setEmailNotificationSettings() {
        const contactsDetails: SecurityContact = {
            email: "b-mkleiner@microsoft.com",
            phone: "0587171443",
            alertNotifications: "on",
            alertsToAdmins: "on"
        };

        await this.securityCenterClient.securityContacts.create("default", contactsDetails,).then(async (response) => {
            await setConfigurationSettings(extensionPrefix, emailNotificationSettings, this.securityCenterClient.subscriptionId, response, vscode.ConfigurationTarget.Global);
        }).catch(error => {
            console.log(error.message);
        });
    }

}



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