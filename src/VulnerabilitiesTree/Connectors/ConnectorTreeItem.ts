import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/connectorOfferings.enum";
import { ConnectorOfferingTreeItem } from "./ConnecorOfferingTreeItem";


export class ConnectorTreeItem extends AzExtParentTreeItem {

	public label: string;
	// private readonly _possibleOfferings: { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[];
	private _children: AzExtTreeItem[]=[];
	private _cloudOfferings!: string[];

	constructor(label: string, possibleOfferings: { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[], cloudOfferings: string[], parent: AzExtParentTreeItem, id: string) {
		super(parent);
		this.label = label;
		// this._possibleOfferings = possibleOfferings;
		this._cloudOfferings = cloudOfferings;
		this.id = id;
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