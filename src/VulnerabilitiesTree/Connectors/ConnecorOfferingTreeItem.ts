import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";

export class ConnectorOfferingTreeItem extends AzExtTreeItem {
    public label: string;
    private enable:boolean;

    public readonly contextValue = "securityCenter.connectors.cloudProvider.offering";

    constructor(label: string, parent: AzExtParentTreeItem, enable:boolean) {
        super(parent);
        this.label = label;
        this.enable = enable;  
    }


}