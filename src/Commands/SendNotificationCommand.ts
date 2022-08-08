import { Alert } from "@azure/arm-security";
import { SmsClient, SmsSendRequest } from "@azure/communication-sms";
import { getVSCodeDownloadUrl } from "@vscode/test-electron/out/util";
import { getCipherInfo } from "crypto";
import { ISubscriptionContext } from "vscode-azureextensionui";
import { getConfigurationSettings } from "../configOperations";
import { Constants } from "../constants";
import { Notification } from "./NotificationSettingsCommand";
import * as vscode from 'vscode';
import { Context } from "mocha";


export async function sendSmsNotification(subscription: ISubscriptionContext, notify: Notification, alert: Alert) {
    try {

        const _notify: Notification = notify;
        const ans = await _notify.verifyRequiredInfrastructure();

        if (ans) {
            const phoneList = getConfigurationSettings(Constants.extensionPrefix, Constants.smsNotificationSettings)[subscription.subscriptionId].to;
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

        const connectionString = await (await _notify.getAccessKey()).primaryConnectionString!;
        const smsClient = new SmsClient(connectionString);
        const smsData = await getConfigurationSettings(Constants.extensionPrefix, Constants.smsNotificationSettings);
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