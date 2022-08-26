"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsNotification = void 0;
const communication_sms_1 = require("@azure/communication-sms");
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const Constants_1 = require("../Constants");
const vscode = require("vscode");
async function sendSmsNotification(subscription, notify, alert) {
    try {
        const _notify = notify;
        const ans = await _notify.verifyRequiredInfrastructure();
        if (ans) {
            const phoneList = (await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.smsNotificationSettings, subscription.subscriptionId)).to;
            if (phoneList === undefined || phoneList === "") {
                const set = await _notify.updateToPhoneNumber();
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
        const smsData = await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.smsNotificationSettings, subscription.subscriptionId);
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
//# sourceMappingURL=SendSms.js.map