"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const vscode_1 = require("vscode");
const constants_1 = require("../../constants");
const AlertModel_1 = require("./AlertModel");
class AlertTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, severity, status, parent, jsonItem, name, resourceGroupName, location, entities, alertUri, id, client) {
        super(parent);
        this._apiUrl = [];
        this.model = [new AlertModel_1.Alerts()];
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
        this._apiUrl.push(constants_1.Constants.getAlertPath(this.subscription.subscriptionId, location, name));
    }
    get apiUrl() {
        return this._apiUrl;
    }
    set apiUrl(apiUrl) {
        this._apiUrl = apiUrl;
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
        try {
            this._client.alerts.updateResourceGroupLevelStateToDismiss(this.location, this._name, this._resourceGroupName);
            await vscode_1.window.showInformationMessage("Security alert:" + this._alertName + " dismissed");
            this.label += " (Dismissed)";
        }
        catch (error) {
            if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
                {
                    await vscode_1.window.showInformationMessage("The action is not supported for the selected security alert");
                }
                await vscode_1.window.showErrorMessage("Error occurred while dismissing the selected security alert");
            }
            ;
        }
    }
    //Activates a security alert
    async activate() {
        try {
            this._client.alerts.updateResourceGroupLevelStateToActivate(this.location, this._name, this._resourceGroupName);
            await vscode_1.window.showInformationMessage("Security alert:" + this._alertName + " activated");
            this.label = this._alertName;
        }
        catch (error) {
            if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
                {
                    await vscode_1.window.showInformationMessage("The action is not supported for the selected security alert");
                }
                await vscode_1.window.showErrorMessage("Error occurred while activating the selected security alert");
            }
            ;
        }
    }
}
exports.AlertTreeItem = AlertTreeItem;
//# sourceMappingURL=AlertTreeItem.js.map