import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";

export class ConnectorOfferingTreeItem extends AzExtTreeItem {
    public label: string;

    public readonly contextValue = "securityCenter.connectors.cloudProvider.offering";

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
    }

}