"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=extClient.js.map