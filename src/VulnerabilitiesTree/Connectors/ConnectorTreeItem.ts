import { SecurityCenter, SecurityConnectors, ConnectorSetting, Connectors, CloudOfferingUnion } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { AWSOfferings, GCPOfferings, GithubOfferings } from "../../Models/connectorOfferings.enum";
import { ConnectorOfferingTreeItem } from "./ConnecorOfferingTreeItem";


export class ConnectorTreeItem extends AzExtParentTreeItem {

	public readonly contextValue: string = 'securityCenter.connectors.cloudProvider.connector';

	readonly label: string;
	protected enableOfferings: { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[];
	protected children: AzExtTreeItem[] = [];
	private CloudOfferings!:string []; 

	constructor(label: string, enableOfferings: any[], cloudOfferings:string[], parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this.enableOfferings = enableOfferings;
		this.CloudOfferings = cloudOfferings;
	}

	public async loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {
		this.children = this.CloudOfferings.map((offering) => {
			const enable: boolean = this.enableOfferings.findIndex(o => o.offeringType === offering) !== -1;
			return new ConnectorOfferingTreeItem(offering.toString(), this, enable);
		});
		return this.children;
	}
	public hasMoreChildrenImpl(): boolean {
		 return true;
	}


}