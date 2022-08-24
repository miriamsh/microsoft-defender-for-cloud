import * as vscode from 'vscode';

//Get configuration object by subscriptionId
export async function getConfigurationSettings(extensionPrefix: string, section: string, subscriptionId: string) {
    const mdcConfig = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`);
    const configurationsSettings: any = Object.assign({}, mdcConfig);
    return configurationsSettings[subscriptionId] !== undefined ? configurationsSettings[subscriptionId] : undefined;
}
//Set configuration object by subscriptionId
export async function setConfigurationSettings(extensionPrefix: string, section: string, subscriptionId: string, settings: any, target: vscode.ConfigurationTarget) {
    const configurationsSettings = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`, {});
    const updatedSetting = { ...configurationsSettings, [subscriptionId]: settings };
    await vscode.workspace.getConfiguration().update(`${extensionPrefix}.${section}`, updatedSetting, target);
}

//Set configuration value
export const setGeneralConfiguration = async (extensionPrefix: string, section: string, info: any, target: vscode.ConfigurationTarget) => {
    await vscode.workspace.getConfiguration().update(`${extensionPrefix}.${section}`, info, target);
};

//Get configuration value
export const getGeneralConfiguration = async (extensionPrefix: string, section: string) => {
    return await vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`);
};