"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsNotification = void 0;
const communication_sms_1 = require("@azure/communication-sms");
const configUtils_1 = require("../Utility/configUtils");
const constants_1 = require("../constants");
const vscode = require("vscode");
async function sendSmsNotification(subscription, notify, alert) {
    try {
        const _notify = notify;
        const ans = await _notify.verifyRequiredInfrastructure();
        if (ans) {
            const phoneList = (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.smsNotificationSettings)[subscription.subscriptionId].to;
            if (phoneList === undefined || phoneList === "") {
                const set = await _notify.setPhoneNumbersAsConfig();
                if (!set) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        const connectionString = await (await _notify.getAccessKey()).primaryConnectionString;
        const smsClient = new communication_sms_1.SmsClient(connectionString);
        const smsData = await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.smsNotificationSettings);
        const sendRequest = {
            "from": smsData.from,
            "to": smsData.to.split(','),
            "message": alert.alertUri
        };
        await smsClient.send(sendRequest);
    }
    catch (error) {
        vscode.window.showErrorMessage("Error: " + error);
    }
}
exports.sendSmsNotification = sendSmsNotification;
//# sourceMappingURL=sendSMSCommand.js.map