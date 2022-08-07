import { SecurityCenter, SecurityContact, SecurityContacts, SecurityTask } from "@azure/arm-security";
import * as vscode from 'vscode';
import { extensionPrefix, emailNotificationSettings, smsNotificationSettings } from "../constants";
import { getConfigurationSettings, setConfigurationSettings } from '../configOperations';
import { ResourceManagementClient, DeploymentProperties, Deployment, ResourceGroup, DeploymentOperation, DeploymentOperations } from '@azure/arm-resources';
import { CommunicationServiceCreateOrUpdateOptionalParams, CommunicationService, CommunicationServiceGetOptionalParams, CommunicationServiceManagementClient, CommunicationServiceResource } from "@azure/arm-communication";
import { RestError } from "@azure/ms-rest-js";
import { PhoneNumbersClient, PurchasePhoneNumbersResult, SearchAvailablePhoneNumbersRequest } from "@azure/communication-phone-numbers";
import { DeviceCodeCredential } from '@azure/identity';


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
    private subscriptionId: string;
    private credentials: DeviceCodeCredential;
    private context: vscode.ExtensionContext;

    constructor(subscriptionId: string, credentials: DeviceCodeCredential, context: vscode.ExtensionContext) {
        this.subscriptionId = subscriptionId;
        this.credentials = credentials;
        this.context = context;
        this.resourceManagementClient = new ResourceManagementClient(this.credentials, this.subscriptionId);
        this.communicationManagementClient = new CommunicationServiceManagementClient(this.credentials, this.subscriptionId);
        this.securityCenterClient = new SecurityCenter(this.credentials, this.subscriptionId);
    }

    //Required:: check if there is a phone number
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
            //check if there is a phone number
            //if yes (save if as config?) return true;
        }
        const phoneNumber = await this.purchasePhoneNumber(this.credentials);
        if (phoneNumber === "") {
            return false;
        }
        setConfigurationSettings(extensionPrefix, smsNotificationSettings, this.subscriptionId, { "from": phoneNumber, "to": "" }, vscode.ConfigurationTarget.Global);
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
        const resourcegroupParams: ResourceGroup = {
            "location": "eastus"
        };

        const resourceGroup = this.resourceManagementClient.resourceGroups.createOrUpdate(this.communicationResourceName, resourcegroupParams);
        try {
            const pick = await vscode.window.showInformationMessage("Azure communication services doesn't exist in the current subscription", "Create Resource", "Cancel");
            if (pick === "Create Resource") {
                {
                    const properties: CommunicationServiceResource = {
                        "location": "Global",
                        "dataLocation": "United States",
                    };

                    const params: CommunicationServiceCreateOrUpdateOptionalParams = {
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
    async purchasePhoneNumber(credentials: DeviceCodeCredential): Promise<String> {
        try {
            const purchase = await vscode.window.showInformationMessage("Purchase a Phone number. Note: In this operation you will be charged the required rate", "OK", "Cancel")
            if (purchase === "OK") {
                const connectionString = `endpoint=https://${this.communicationResourceName}.communication.azure.com/;accessKey=${credentials}`;
                const phoneNumberClient = new PhoneNumbersClient(connectionString);

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
    public async setPhoneNumbersAsConfig() {
        const phonesList = await this.inputPhoneBox();
        if (phonesList === "") {
            return false;
        }
        const smsConfig = getConfigurationSettings(extensionPrefix, smsNotificationSettings)[this.subscriptionId];
        setConfigurationSettings(extensionPrefix, smsNotificationSettings, this.subscriptionId, { "from": smsConfig.from, "to": phonesList }, vscode.ConfigurationTarget.Global);
        return true;
    }

    //Show inputBoxMenu
    async inputPhoneBox(): Promise<string> {
        const options: vscode.InputBoxOptions = {
            "placeHolder": "list of recipient's phone numbers, separated by ;",
            "title": "Press phone numbers",
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