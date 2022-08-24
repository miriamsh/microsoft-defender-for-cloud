import { AlertEntity, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { window } from "vscode";

export class AlertTreeItem extends AzExtTreeItem {

	private _jsonItem!: string;
	public label: string;
	private _severity!: string;
	private _status!: string;
	private _client: SecurityCenter;
	private _name: string;
	private _resourceGroupName: string;
	private location: string;
	private _alertUri!: string;
	private _entities: AlertEntity[];
	private _alertName: string;

	public readonly contextValue: string = "securityCenter.securityAlerts.affected-resources.alert";

	public get jsonItem(): string {
		return this._jsonItem;
	}

	public get entities(): AlertEntity[] {
		return this._entities;
	}

	public get severity(): string {
		return this._severity;
	}

	public get status(): string {
		return this._status;
	}

	public get alertUri(): string {
		return this._alertUri;
	}

	constructor(label: string, severity: string, status: string, parent: AzExtParentTreeItem, jsonItem: string, name: string, resourceGroupName: string, location: string, entities: AlertEntity[], alertUri: string, id: string, client: SecurityCenter) {
		super(parent);
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

	//Dismisses a security alert
	public async dismiss(): Promise<void> {
		this._client.alerts.updateResourceGroupLevelStateToDismiss(this.location, this._name, this._resourceGroupName).then(() => {
			window.showInformationMessage(this._alertName + " Dismissed");
			this.label += " (Dismissed)";
		}).catch((err) => {
			window.showErrorMessage(err.code + ": " + err.message);
		});
	}

	//Activates a security alert
	public async activate(): Promise<void> {
		this._client.alerts.updateResourceGroupLevelStateToActivate(this.location, this._name, this._resourceGroupName).then(() => {
			window.showInformationMessage(this._alertName + " Activate");
			this.label = this._alertName;
		}).catch((err) => {
			window.showErrorMessage(err.code + ": " + err.message);
		});
	}

}