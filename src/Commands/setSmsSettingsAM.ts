import { ActionGroupResource } from '@azure/arm-monitor';
import * as vscode from 'vscode';
import { Monitor } from '../azure/AzureMonitor';
import { Constants } from '../Constants';
import { getConfigurationSettings } from '../Utility/ConfigUtils';

export const setSmsNotification = async (subscriptionId: string, monitor: Monitor) => {
    const _monitor: Monitor = monitor;

    const name = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId))?.notificationSettings?.name;
    const code = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId))?.notificationSettings?.code;
    const phone = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, subscriptionId))?.notificationSettings?.phone;

    const actionGroupParams: ActionGroupResource =await _monitor.getActionGroupParams(name, code, phone);
    const alertRule = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
    }, async (progress) => {
        progress.report({
            message: `Saving SMS settings ...`
        });
        const actionGroup = await _monitor.createActionGroup(actionGroupParams);
        return actionGroup ? await _monitor.createAlertRule() : false;
    });

    if (alertRule) {
        await vscode.window.showInformationMessage("SMS settings have been saved successfully");
        return;
    }

    await vscode.window.showErrorMessage("Error while saving SMS notification");
    return;
};