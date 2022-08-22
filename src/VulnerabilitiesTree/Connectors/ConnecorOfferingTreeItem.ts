import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";

export class ConnectorOfferingTreeItem extends AzExtTreeItem {
    public label: string;
    
    private _enable : boolean;

    public readonly contextValue = "securityCenter.connectors.cloudProvider.offering";

    constructor(label: string, parent: AzExtParentTreeItem, enable:boolean) {
        super(parent);
        this.label = label;
        this._enable = enable;  
    }

    public get enable() : boolean {
        return this._enable;
    }

}