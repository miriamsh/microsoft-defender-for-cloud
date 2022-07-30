import { Alert, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";

export class AlertTreeItem extends AzExtTreeItem {
	public contextValue: string;
	public label: string;
    public severity!:string;
    public status!:string;
	constructor(contextValue: string,label:string, severity:string, status:string,parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this.contextValue = contextValue;
		this.severity = severity;
		this.status = status;
	}

    
}