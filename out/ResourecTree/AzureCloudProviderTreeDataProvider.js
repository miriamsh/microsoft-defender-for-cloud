"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureCloudProviderTreeDataProvider = void 0;
const constants_1 = require("../constants");
const ConnectorsCloudProviderTreeDataProvider_1 = require("./ConnectorsCloudProviderTreeDataProvider");
const treeUtils_1 = require("../Utility/treeUtils");
class AzureCloudProviderTreeDataProvider extends ConnectorsCloudProviderTreeDataProvider_1.ConnectorsCloudProviderTreeDataProvider {
    constructor(label, parent) {
        super(label, parent);
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.cloudConnector);
        ;
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
        return [];
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.AzureCloudProviderTreeDataProvider = AzureCloudProviderTreeDataProvider;
//# sourceMappingURL=AzureCloudProviderTreeDataProvider.js.map