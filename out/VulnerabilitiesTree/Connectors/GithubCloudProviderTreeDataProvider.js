"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubCloudProviderTreeDataProvider = void 0;
const constants_1 = require("../../constants");
const treeUtils_1 = require("../../Utility/treeUtils");
const CloudProviderTreeItemts_1 = require("./CloudProviderTreeItemts");
class GithubCloudProviderTreeDataProvider extends CloudProviderTreeItemts_1.CloudProviderTreeDataProvider {
    constructor(label, parent) {
        super(label, parent);
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.cloudConnector);
    }
    async loadMoreChildrenImpl() {
        // const connectorsList = await (await this.client.securityConnectors.list().byPage().next()).value;
        // this.children = connectorsList.filter((connector: SecurityConnector) => {
        //     if (connector.cloudName === "Github") {
        //         // return new GithubConnectorTreeItem(connector.name!, connector.offerings, this);
        //     }
        // });
        // this.label = `${this.title}, (${this.children.length})`;
        return this.children;
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.GithubCloudProviderTreeDataProvider = GithubCloudProviderTreeDataProvider;
//# sourceMappingURL=GithubCloudProviderTreeDataProvider.js.map