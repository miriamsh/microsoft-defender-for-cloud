"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneralConfiguration = exports.setGeneralConfiguration = exports.setConfigurationSettings = exports.getConfigurationSettings = void 0;
const vscode = require("vscode");
//Get configuration object by subscriptionId
async function getConfigurationSettings(extensionPrefix, section, subscriptionId) {
    const mdcConfig = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`);
    const configurationsSettings = Object.assign({}, mdcConfig);
    return configurationsSettings[subscriptionId] !== undefined ? configurationsSettings[subscriptionId] : undefined;
}
exports.getConfigurationSettings = getConfigurationSettings;
//Set configuration object by subscriptionId
async function setConfigurationSettings(extensionPrefix, section, subscriptionId, settings, target) {
    const configurationsSettings = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`, {});
    const updatedSetting = { ...configurationsSettings, [subscriptionId]: settings };
    await vscode.workspace.getConfiguration().update(`${extensionPrefix}.${section}`, updatedSetting, target);
}
exports.setConfigurationSettings = setConfigurationSettings;
//Set configuration value
const setGeneralConfiguration = async (extensionPrefix, section, info, target) => {
    await vscode.workspace.getConfiguration().update(`${extensionPrefix}.${section}`, info, target);
};
exports.setGeneralConfiguration = setGeneralConfiguration;
//Get configuration value
const getGeneralConfiguration = async (extensionPrefix, section) => {
    return await vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`);
};
exports.getGeneralConfiguration = getGeneralConfiguration;
//# sourceMappingURL=ConfigUtils.js.map