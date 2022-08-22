"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const vscode_1 = require("vscode");
class AlertTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, severity, status, parent, jsonItem, name, resourceGroupName, location, entities, alertUri, id) {
        super(parent);
        this.contextValue = "securityCenter.alerts";
        this.label = label;
        if (status === "Dismissed") {
            this.label += " (Dismissed)";
        }
        this.severity = severity;
        this.status = status;
        this.jsonItem = jsonItem;
        this.name = name;
        this.resourceGroupName = resourceGroupName;
        this.location = location;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this._entities = entities;
        this.id = id;
        this.alertUri = alertUri;
        this.alertName = label;
        this._entities = entities;
    }
    get jsonItem() {
        return this._jsonItem;
    }
    set jsonItem(item) {
        this._jsonItem = item;
    }
    get entities() {
        return this._entities;
    }
    set entities(item) {
        this._entities = item;
    }
    get severity() {
        return this._severity;
    }
    set severity(s) {
        this._severity = s;
    }
    get status() {
        return this._status;
    }
    set status(s) {
        this._status = s;
    }
    get alertUri() {
        return this._alertUri;
    }
    set alertUri(uri) {
        this._alertUri = uri;
    }
    async dismiss() {
        this.client.alerts.updateResourceGroupLevelStateToDismiss(this.location, this.name, this.resourceGroupName).then(() => {
            vscode_1.window.showInformationMessage(this.alertName + " Dismissed");
            this.label += " (Dismissed)";
        }).catch((err) => {
            vscode_1.window.showErrorMessage(err.code + ": " + err.message);
        });
    }
    async activate() {
        this.client.alerts.updateResourceGroupLevelStateToActivate(this.location, this.name, this.resourceGroupName).then(() => {
            vscode_1.window.showInformationMessage(this.alertName + " Activate");
            //this.parent?.refresh(this.context);
            this.label = this.alertName;
        }).catch((err) => {
            vscode_1.window.showErrorMessage(err.code + ": " + err.message);
        });
    }
}
exports.AlertTreeItem = AlertTreeItem;
//# sourceMappingURL=AlertTreeItem%20(1).js.map