import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { Constants } from "../../constants";
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/ConnectorOfferings.enum";
import { ConnectorOfferingTreeItem } from "./ConnecorOfferingTreeItem";
import { Connectors } from "./ConnectorModel";


export class ConnectorTreeItem extends AzExtParentTreeItem {

	public label: string;
	// private readonly _possibleOfferings: { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[];
	private _children: AzExtTreeItem[]=[];
	private _cloudOfferings!: string[];
	private _resourceGroupName!: string;
	public model: any[]=[new Connectors()] ;
	private _apiUrl: string[]=[];

	constructor(label: string, possibleOfferings: { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[], cloudOfferings: string[], parent: AzExtParentTreeItem, id: string,resourceGroupName:string) {
		super(parent);
		this.label = label;
		// this._possibleOfferings = possibleOfferings;
		this._cloudOfferings = cloudOfferings;
		this.id = id;		this._resourceGroupName = resourceGroupName;
		this._apiUrl.push(Constants.getConnectorPath(this.subscription.subscriptionId,resourceGroupName,label));

	}
	public get resourceGroupName(): string {
		return this._resourceGroupName;
	}
	public set resourceGroupName(resourceGroupName: string) {
		this._resourceGroupName = resourceGroupName;
	}
	public get apiUrl(): string[] {
		return this._apiUrl;
	}
	public set apiUrl(apiUrl: string[]) {
		this._apiUrl = apiUrl;
	}
	public readonly contextValue: string = 'securityCenter.connectors.cloudProvider.connector';

	public hasMoreChildrenImpl(): boolean {
		return false;
	}

	public async loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {
		this._children= this._cloudOfferings.map((offering) => {
			//if (this._possibleOfferings.findIndex(o => o.offeringType === offering) !== -1) {
				return new ConnectorOfferingTreeItem(offering.toString(), this);
			//}
		});

		return this._children;
	}
}