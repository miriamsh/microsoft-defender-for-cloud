import { Alert } from "@azure/arm-security";
import { SmsClient, SmsSendRequest } from "@azure/communication-sms";
import { ISubscriptionContext } from "vscode-azureextensionui";
import { getConfigurationSettings } from "../Utility/ConfigUtils";
import { Constants } from "../Constants";
import * as vscode from 'vscode';
import { CommunicationServices } from "../azure/CommunicationServices";


export async function sendSmsNotification(subscription: ISubscriptionContext, notify: CommunicationServices, alert: Alert) {
    try {

        const _notify: CommunicationServices = notify;
        const ans = await _notify.verifyRequiredInfrastructure();

        if (ans) {
            const phoneList = (await getConfigurationSettings(Constants.extensionPrefix, Constants.smsNotificationSettings, subscription.subscriptionId)).to;
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

        const connectionString = await (await _notify.getAccessKey()).primaryConnectionString!;
        const smsClient = new SmsClient(connectionString);
        const smsData = await getConfigurationSettings(Constants.extensionPrefix, Constants.smsNotificationSettings, subscription.subscriptionId);
        const sendRequest: SmsSendRequest = {
            "from": smsData.from,
            "to": smsData.to.split(','),
            "message": alert.alertUri!
        };

        await smsClient.send(sendRequest);
    }
    catch (error) {

        vscode.window.showErrorMessage("Error: " + error);

    }
}