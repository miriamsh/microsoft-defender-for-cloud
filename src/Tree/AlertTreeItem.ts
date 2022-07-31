import { Alert, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";

export class AlertTreeItem extends AzExtParentTreeItem {
	
	public contextValue: string;
	private client!: SecurityCenter;
	public label: string;
    public severity!:string;
    public status!:string;

	constructor(contextValue: string,label:string, severity:string, status:string,parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this.contextValue = contextValue;
		this.severity = severity;
		this.status = status;
		this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
	}

	public loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
		throw new Error("Method not implemented.");
	}

	public hasMoreChildrenImpl(): boolean {

		return false;
	}

    
}