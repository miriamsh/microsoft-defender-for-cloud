import { AlertEntity, SecurityCenter } from "@azure/arm-security";
import { RestError } from "@azure/ms-rest-js";
import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { window } from "vscode";
import { Constants } from "../../constants";
import { Alerts } from "./AlertModel";

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
	private _apiUrl: string[]=[];
	public model:any[]=[new Alerts()];

	public readonly contextValue: string = "securityCenter.securityAlerts.affectedResources.alert";

	public get apiUrl(): string[] {
		return this._apiUrl;
	}
	public set apiUrl(apiUrl: string[]) {
		this._apiUrl = apiUrl;
	}
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
		this._apiUrl.push(Constants.getAlertPath(this.subscription.subscriptionId,location,name));

	}

	//Dismisses a security alert
	public async dismiss(): Promise<void> {
		try {
			this._client.alerts.updateResourceGroupLevelStateToDismiss(this.location, this._name, this._resourceGroupName);
			await window.showInformationMessage("Security alert:" + this._alertName + " dismissed");
			this.label += " (Dismissed)";
		}
		catch (error: RestError | any) {
			if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
				{
					await window.showInformationMessage("The action is not supported for the selected security alert");
				}
				await window.showErrorMessage("Error occurred while dismissing the selected security alert");
			};
		}
	}

	//Activates a security alert
	public async activate(): Promise<void> {
		try {
			this._client.alerts.updateResourceGroupLevelStateToActivate(this.location, this._name, this._resourceGroupName);
			await window.showInformationMessage("Security alert:" + this._alertName + " activated");
			this.label = this._alertName;
		}
		catch (error: RestError | any) {
			if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
				{
					await window.showInformationMessage("The action is not supported for the selected security alert");
				}
				await window.showErrorMessage("Error occurred while activating the selected security alert");
			};
		}
	}

}