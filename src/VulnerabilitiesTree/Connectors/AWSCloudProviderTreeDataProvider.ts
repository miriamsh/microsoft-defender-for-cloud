import { Constants } from "../../constants";
import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { TreeUtils } from "../../Utility/treeUtils";
import { ConnectorSetting, AuthenticationDetailsPropertiesUnion, SecurityConnectors, SecurityConnector } from "@azure/arm-security";
import { ConnectorTreeItem } from "./ConnectorTreeItem";
import { CloudProviderTreeItem } from "./CloudProviderTreeItem";


export class AWSCloudProviderTreeDataProvider extends CloudProviderTreeItem{

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(label, parent);
        this.iconPath = TreeUtils.getIconPath(Constants.cloudConnector);
    }

    public async loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {
        // const connectorsList = await (await this.client.securityConnectors.list().byPage().next()).value;
        // this.children = connectorsList.filter((connector: SecurityConnector) => {
        //     if (connector.cloudName === "AWS") {
        //         return new AWSConnectorTreeItem(connector.name!, connector.offerings, this);
        //     }
        // });
        // this.label = `${this.title} (${this.children.length})`;
        return this.children;
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }

}