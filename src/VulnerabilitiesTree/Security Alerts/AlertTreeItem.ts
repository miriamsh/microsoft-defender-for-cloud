import { AlertEntity, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { window } from "vscode";

export class AlertTreeItem extends AzExtTreeItem {

	private _jsonItem!: string;
	public label: string;
	private _severity!: string;
	private _status!: string;
	private client: SecurityCenter;
	private name: string;
	private resourceGroupName: string;
	private location: string;
	private _alertUri!: string;
	private _entities: AlertEntity[];
	private alertName: string;

	public readonly contextValue: string = "securityCenter.securityAlerts.affected-resources.alert";

	public get jsonItem(): string {
		return this._jsonItem;
	}

	public set jsonItem(item: string) {
		this._jsonItem = item;
	}

	public get entities(): AlertEntity[] {
		return this._entities;
	}

	public set entities(item: AlertEntity[]) {
		this._entities = item;
	}

	public get severity(): string {
		return this._severity;
	}

	public set severity(s: string) {
		this._severity = s;
	}

	public get status(): string {
		return this._status;
	}

	public set status(s: string) {
		this._status = s;
	}

	public get alertUri(): string {
		return this._alertUri;
	}

	public set alertUri(uri: string) {
		this._alertUri = uri;
	}

	constructor(label: string, severity: string, status: string, parent: AzExtParentTreeItem, jsonItem: string, name: string, resourceGroupName: string, location: string, entities: AlertEntity[], alertUri: string, id: string) {
		super(parent);
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
		this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
		this._entities = entities;
		this.id = id;
		this.alertUri = alertUri;
		this.alertName = label;
		this._entities = entities;
	}

	public async dismiss(): Promise<void> {
		this.client.alerts.updateResourceGroupLevelStateToDismiss(this.location, this.name, this.resourceGroupName).then(() => {
			window.showInformationMessage(this.alertName + " Dismissed");
			this.label += " (Dismissed)";
		}).catch((err) => {
			window.showErrorMessage(err.code + ": " + err.message);
		});
	}

	public async activate(): Promise<void> {
		this.client.alerts.updateResourceGroupLevelStateToActivate(this.location, this.name, this.resourceGroupName).then(() => {
			window.showInformationMessage(this.alertName + " Activate");
			this.label = this.alertName;
		}).catch((err) => {
			window.showErrorMessage(err.code + ": " + err.message);
		});
	}

}