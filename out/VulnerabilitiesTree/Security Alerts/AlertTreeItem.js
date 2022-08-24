"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const vscode_1 = require("vscode");
class AlertTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, severity, status, parent, jsonItem, name, resourceGroupName, location, entities, alertUri, id, client) {
        super(parent);
        this.contextValue = "securityCenter.securityAlerts.affectedResources.alert";
        this.label = label;
        if (status === "Dismissed") {
            this.label += " (Dismissed)";
        }
        this._severity = severity;
        this._status = status;
        this._jsonItem = jsonItem;
        this._name = name;
        this._resourceGroupName = resourceGroupName;
        this.location = location;
        this._client = client;
        this._entities = entities;
        this.id = id;
        this._alertUri = alertUri;
        this._alertName = label;
        this._entities = entities;
    }
    get jsonItem() {
        return this._jsonItem;
    }
    get entities() {
        return this._entities;
    }
    get severity() {
        return this._severity;
    }
    get status() {
        return this._status;
    }
    get alertUri() {
        return this._alertUri;
    }
    //Dismisses a security alert
    async dismiss() {
        this._client.alerts.updateResourceGroupLevelStateToDismiss(this.location, this._name, this._resourceGroupName).then(() => {
            vscode_1.window.showInformationMessage(this._alertName + " Dismissed");
            this.label += " (Dismissed)";
        }).catch((err) => {
            vscode_1.window.showErrorMessage(err.code + ": " + err.message);
        });
    }
    //Activates a security alert
    async activate() {
        this._client.alerts.updateResourceGroupLevelStateToActivate(this.location, this._name, this._resourceGroupName).then(() => {
            vscode_1.window.showInformationMessage(this._alertName + " Activate");
            this.label = this._alertName;
        }).catch((err) => {
            vscode_1.window.showErrorMessage(err.code + ": " + err.message);
        });
    }
}
exports.AlertTreeItem = AlertTreeItem;
//# sourceMappingURL=AlertTreeItem.js.map