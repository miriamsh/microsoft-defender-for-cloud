import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";

export class ResourceTreeItem extends AzExtTreeItem {
	public label: string;
	public contextValue: string;
	constructor(contextValue: string, parent: AzExtParentTreeItem) {
		super(parent);
		this.label = contextValue;
		this.contextValue = contextValue;
	}

}