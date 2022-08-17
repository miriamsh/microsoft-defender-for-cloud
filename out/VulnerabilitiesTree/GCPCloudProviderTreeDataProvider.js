"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCPCloudProviderTreeDataProvider = void 0;
const constants_1 = require("../constants");
const ConnectorsCloudProviderTreeDataProvider_1 = require("./ConnectorsCloudProviderTreeDataProvider");
const treeUtils_1 = require("../Utility/treeUtils");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
class GCPCloudProviderTreeDataProvider extends ConnectorsCloudProviderTreeDataProvider_1.ConnectorsCloudProviderTreeDataProvider {
    constructor(label, parent) {
        super(label, parent);
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.gcpConnector);
        ;
    }
    async loadMoreChildrenImpl() {
        const connectorsList = await (await this.client.connectors.list().byPage().next()).value;
        this.children = connectorsList.filter((connector) => {
            if (connector.authenticationDetails?.authenticationType === 'gcpCredentials') {
                return new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, this);
            }
        });
        this.label = `${this.title}, (${this.children.length})`;
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.GCPCloudProviderTreeDataProvider = GCPCloudProviderTreeDataProvider;
//# sourceMappingURL=GCPCloudProviderTreeDataProvider.js.map