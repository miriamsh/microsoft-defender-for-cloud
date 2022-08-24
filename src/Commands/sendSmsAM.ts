import * as vscode from 'vscode';
import { IActionContext } from "vscode-azureextensionui";
import { Monitor } from "../azure/AzureMonitor";
import axios from 'axios';
import { Constants } from '../constants';
import { getConfigurationSettings } from '../Utility/ConfigUtils';


//Sends SMS messages, using Monitor service of Azure Monitor
export async function sendSmsWithAzureMonitor(context: IActionContext, subscriptionId: string, monitor: Monitor) {
    const _monitor: Monitor = monitor;
    const name = _monitor.getResourceGroup();
    try {
        const ans = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Verifying the requirements to complete this action ...`,
            });
            //return await _monitor.verifyRequiredInfrastructure();
            //NOTE: Preventing access to a private Azure account 
             return false;
        });

        if (ans) {
            await axios.get(Constants.sendSmsByAzureFunction(name));
            const phone = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId)).notificationSettings?.phoneNumber;
            await vscode.window.showInformationMessage(`SMS message will be sent in a few minutes.${phone!==undefined?"to:"+phone:""}`);
        }
        else {
            await vscode.window.showErrorMessage("Couldn't verify the requirements to complete this action");
        }
    }

    catch (error) {
        await vscode.window.showErrorMessage("SMS won't be sent due to an error. Try again later");

    }
}

const latency = () =>{
    const a = setTimeout(():boolean => {
        return false;
     } , 1000);
    
};