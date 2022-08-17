import { CommunicationServices } from "./communicationServices";

//Set SMS notification Command
export async function setSmsNotificationSettings(resource: CommunicationServices) {

    const ans = await resource.verifyRequiredInfrastructure();

    if (ans) {
        const set = await resource.setPhoneNumbersAsConfig();
        if (set) {
            return true;
        }
    }
    return false;
}




  



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