"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsCloudProviderTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ConnectorsCloudProviderTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider';
        this.label = label;
        this.cloudProvider = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
    async loadMoreChildrenImpl() {
        // if (this.children.length === 0) {
        //     const connectorsList = await (await this.client.connectors.list().byPage().next()).value;
        //     connectorsList.map((connector: ConnectorsGetResponse) => {
        //         const cloudProvider = getCloudProvider(connector);
        //         this.children.push(new ConnectorTreeItem("Connector", connector.name!, connector.id!, this));
        //     });
        // }
        // return connectorsFiltering((this.parent as SubscriptionTreeItem).filteringSettings, this.children);
        return this.children;
    }
    getChildren() {
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.ConnectorsCloudProviderTreeItem = ConnectorsCloudProviderTreeItem;
//# sourceMappingURL=ConnectorsCloudProviderTreeItem.js.map