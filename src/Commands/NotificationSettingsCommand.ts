import { SecurityCenter, SecurityContact, SecurityTask } from "@azure/arm-security";
import { getVSCodeDownloadUrl } from "@vscode/test-electron/out/util";
import * as vscode from 'vscode';
import { MessageChannel } from "worker_threads";
import { multiStepInput } from "../Models/multiStepInput";
import { ext } from "../extensionVariables";
import { extensionPrefix, notificationSettings } from "../constants";
import { AssessmentTreeItem } from "../ResourecTree/AssesmentTreeItem";
import { AzureAccountTreeItem } from "../ResourecTree/AzureAccountTreeItem";
import { setConfigurationSettings } from '../configOperations';
import az from 'az-ts';
import { ResourceManagementClient, DeploymentProperties, Deployment, ResourceGroup, DeploymentOperation, DeploymentOperations } from '@azure/arm-resources';
import { ISubscriptionContext } from "vscode-azureextensionui";
import { TemplateSpecsClient } from "@azure/arm-templatespecs";
import { ErrorModel } from "@azure/cognitiveservices-face/esm/models";
import { CommunicationServiceCreateOrUpdateOptionalParams, CommunicationService, CommunicationServiceGetOptionalParams, CommunicationServiceManagementClient, CommunicationServiceResource } from "@azure/arm-communication";
import { RestError } from "@azure/ms-rest-js";
import { PhoneNumbersClient, SearchAvailablePhoneNumbersRequest } from "@azure/communication-phone-numbers";
import { DeviceCodeCredential } from '@azure/identity';



const resourceGroupName: string = "vscodeExSmsNotification";
const communicationResourceName: string = "smsNotification-1";


// PUT: sets or updates SMS notification settings per subscription.Uses SmsClient, and saves the details as a configuration
export async function setSmsNotificationSettings(resourceClient: ResourceManagementClient, communicationClient: CommunicationServiceManagementClient, credentials: DeviceCodeCredential, context: vscode.ExtensionContext) {
    await checkCommunicationServiceResource(resourceClient, communicationClient, context).then(async (permission) => {
        if (permission && permission === true) {
            await purchasePhoneNumber(credentials);
            vscode.window.showInputBox().then();
        }
    });

}

async function purchasePhoneNumber(credentials: DeviceCodeCredential) {
    const endpoint: String = `https://${communicationResourceName}.communication.azure.com`;
    const connectionString = `endpoint=https://smsnotification-1.communication.azure.com/;accessKey=${credentials}`;
    const client = new PhoneNumbersClient(connectionString);
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

    const searchPoller = await client.beginSearchAvailablePhoneNumbers(searchRequest).catch();

    // The search is underway. Wait to receive searchId.
    const searchResults = await searchPoller.pollUntilDone();
    console.log(`Found phone number: ${searchResults.phoneNumbers[0]}`);
    console.log(`searchId: ${searchResults.searchId}`);

    const t= client.beginPurchasePhoneNumbers(searchResults.searchId);
}

export async function getSmsNotificationSettings() {
    //checks if a resource exists (using connection string from configuration etc.)
    //if not- call createCommunicationServiceResource, and then setNotificationSettings
    //else: returns the Sms settings from configuration
}

//POST: creating azure communication services resource, if not exists. returns connection string
async function checkCommunicationServiceResource(resourceClient: ResourceManagementClient, communicationClient: CommunicationServiceManagementClient, context: vscode.ExtensionContext): Promise<boolean | undefined> {
    try {
        //const id = "'/subscriptions/2f69bcc6-e7d1-4de5-9006-d8ede4c4c6d5/resourceGroups/notificationForVscodevb01/providers/Microsoft.Communication/communicationServices/superheart'";
        const result = await communicationClient.communicationService.get(resourceGroupName, communicationResourceName).then(d => { return true; }).catch((error: RestError) => {
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
    };
}

async function createCommunicationServiceResource(resourceClient: ResourceManagementClient, communicationClient: CommunicationServiceManagementClient): Promise<boolean> {
    try {
        const resourceGroup: ResourceGroup = await resourceClient.resourceGroups.createOrUpdate(resourceGroupName, { "location": "eastus" });

        const service: CommunicationServiceResource = {
            "location": "Global",
            "dataLocation": "United States"

        };
        const params: CommunicationServiceCreateOrUpdateOptionalParams = {
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
export async function sendSmsNotification() {
    //calls getSmsNotificationSettings
    //now, should have the sms settings
    //uses arm-smsSend client to send sms message
}

//PUT: sets or updates email notification settings per subscription. uses SecurityCenter client
export async function setEmailNotificationSettings(client: SecurityCenter) {
    const contactsDetails: SecurityContact = {
        email: "b-mkleiner@microsoft.com",
        phone: "0587171443",
        alertNotifications: "on",
        alertsToAdmins: "on"
    };

    await client.securityContacts.create("default", contactsDetails,).then(async (response) => {
        await setConfigurationSettings(extensionPrefix, notificationSettings, client.subscriptionId, response, vscode.ConfigurationTarget.Global);
    }).catch(error => {
        console.log(error.message);
    });
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