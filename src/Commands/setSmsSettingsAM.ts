import * as vscode from 'vscode';
import { Monitor } from '../azure/azureMonitor';
import { Constants } from '../constants';
import { getConfigurationSettings } from '../Utility/configUtils';

export const setSmsNotification = async (subscriptionId:string,monitor: Monitor) => {
    const _monitor: Monitor = monitor;
    
    const name = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId))?.notificationSettings?.name;
    const code = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId))?.notificationSettings?.code;
    const phone = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId))?.notificationSettings?.phone;

    const actionGroup = await _monitor.createActionGroup(name, code, phone);
    if (actionGroup === true) {
        const alertRule = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Saving SMS settings ...`
            });
            return await _monitor.createAlertRule();
        });

        if (alertRule === true) {
            await vscode.window.showInformationMessage("SMS settings have been saved successfully");
            return;
        }
    }
    await vscode.window.showErrorMessage("Error while saving SMS notification");
    return;
};