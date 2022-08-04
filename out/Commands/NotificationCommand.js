"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSecurityContact = void 0;
const vscode = require("vscode");
async function createSecurityContact(client, subscriptionName) {
    const email = await vscode.window.showInputBox();
    const contactsDetails = {
        email: "b-tariely@microsoft.com",
        phone: "0527171443",
        alertNotifications: "on",
        alertsToAdmins: "on"
    };
    // {
    //     "properties": {
    //       "notificationsByRole": {
    //         "state": "On",
    //         "roles": [
    //           "Owner"
    //         ]
    //       },
    //       "emails":"john@contoso.com;jane@contoso.com",
    //       "phone": "0527171443",
    //       "alertNotifications": {
    //         "state": "On",
    //         "minimalSeverity": "Low"
    //       }
    //     }
    //   }
    await client.securityContacts.create("default", contactsDetails).then(response => {
        console.log(response);
        //vscode.window.createOutputChannel(`Email notifications settings for subscription '${subscriptionName}' were saved successfully`);
    }).catch(error => {
        //vscode.window.createOutputChannel("OUTPUT");
        console.log(error.message);
    });
}
exports.createSecurityContact = createSecurityContact;
//# sourceMappingURL=NotificationCommand.js.map