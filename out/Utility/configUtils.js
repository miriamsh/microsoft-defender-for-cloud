"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfigurationSettings = exports.getConfigurationSettings = void 0;
const vscode = require("vscode");
//TODO:VALIDATION
function getConfigurationSettings(extensionPrefix, section) {
    const mdcConfig = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`);
    const configurationsSettings = Object.assign({}, mdcConfig);
    return configurationsSettings;
}
exports.getConfigurationSettings = getConfigurationSettings;
async function setConfigurationSettings(extensionPrefix, section, subscriptionId, settings, target) {
    const configurationsSettings = vscode.workspace.getConfiguration().get(`${extensionPrefix}.${section}`, {});
    const updatedSetting = { ...configurationsSettings, [subscriptionId]: settings };
    await vscode.workspace.getConfiguration().update(`${extensionPrefix}.${section}`, updatedSetting, target);
}
exports.setConfigurationSettings = setConfigurationSettings;
//# sourceMappingURL=configUtils.js.map