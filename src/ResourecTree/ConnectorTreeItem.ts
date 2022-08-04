import { SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";

export class ConnectorTreeItem extends AzExtTreeItem {

	public contextValue: string;
	readonly label: string;
    public cloudProvider!:string;
	constructor(contextValue: string,label:string,cloudProvider:string, parent: AzExtParentTreeItem) {
		super(parent);
		this.contextValue = contextValue;
		this.label = label;
        this.cloudProvider=cloudProvider;
	}
}