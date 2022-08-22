import * as vscode from 'vscode';
import { ServiceClient } from "@azure/ms-rest-js";
import { IActionContext } from "vscode-azureextensionui";
import { Monitor } from "../azure/azureMonitor";
import { Client } from "../Utility/clientUtils";
import { getConfigurationSettings } from '../Utility/configUtils';
import { Constants } from '../constants';
import axios from 'axios';


//Sends SMS messages, using Monitor service of Azure Monitor
export async function sendSmsWithAzureMonitor(context: IActionContext, client: Client, monitor: Monitor) {
    const _monitor: Monitor = monitor;
    const name = _monitor.getResourceGroup();
    const ans = await _monitor.verifyRequiredInfrastructure();
    if (ans) {
         const response = await axios.get(`https://today2dayfunc.azurewebsites.net/api/HttpTrigger1?code=nDhyw-27FKoetpSDlQHEHLsvrKknUQ5Lc3ZcabGU8QSxAzFuobKWig==&name=${name}`
        ).then(async (res) => {
            //const phone = getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId,
            await vscode.window.showInformationMessage("SMS message will be sent in a few minutes");
        }).catch(async (error) => {
            await vscode.window.showErrorMessage("SMS won't be sent due to an error. Try again later");
        });
    }
    else {
        await vscode.window.showErrorMessage("Couldn't complete the required operations for sending the SMS message");
    }
}