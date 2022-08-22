import { DefaultAzureCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { MonitorClient } from "@azure/arm-monitor";
import { ServiceClient } from "@azure/ms-rest-js";
import { IActionContext } from "vscode-azureextensionui";
import { AzExtGenericClientInfo, createGenericClient, AzExtGenericCredentials } from "@microsoft/vscode-azext-azureutils";
import { Environment } from "@azure/ms-rest-azure-env";


// export class ExtClient {

//     private subscriptionId = '9355a384-3349-404c-9589-1796edfdf799';

//     // Create Azure authentication credentials
//     private credentials = new DefaultAzureCredential();

//     private extMonitorClient:MonitorClient;

//     private extGenericClient!:ServiceClient;

//     constructor(){
//         this.extMonitorClient=new MonitorClient(this.credentials, this.subscriptionId);
//     }


//     public getExtMonitorClient = async () => {
//         return this.extMonitorClient;
//     };

//     public async getExtGenericClient(context: IActionContext) {
//         if (this.extGenericClient === undefined) {
//             this.extGenericClient = await createGenericClient(context, this.getClientInfo());
//         }
//         return this.extGenericClient;
//     }

//     private getClientInfo(): AzExtGenericClientInfo {
//         return {
//             credentials: new DefaultAzureCredential(),
//             environment: new Environment({""});
//         };
//     }
// }

