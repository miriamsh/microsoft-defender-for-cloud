import * as vscode from 'vscode';

//TODO:VALIDATION
export function getConfigurationSettings(extensionPrefix: string, section: string) {
    const mdcConfig = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`);
    const configurationsSettings: any = Object.assign({}, mdcConfig);
    return configurationsSettings;
}

export async function setConfigurationSettings(extensionPrefix: string, section: string, subscriptionId: string, settings: any, target: vscode.ConfigurationTarget) {
    const configurationsSettings = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`, {});
    const updatedSetting = { ...configurationsSettings,  [subscriptionId]: settings };
    await vscode.workspace.getConfiguration().update(`${extensionPrefix}.${section}`, updatedSetting,  target);
}