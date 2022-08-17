"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const ConnecorOfferingTreeItem_1 = require("./ConnecorOfferingTreeItem");
class ConnectorTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, enableOfferings, cloudOfferings, parent) {
        super(parent);
        this.contextValue = 'securityCenter.connectors.cloudProvider.connector';
        this.children = [];
        this.label = label;
        this.enableOfferings = enableOfferings;
        this.CloudOfferings = cloudOfferings;
    }
    async loadMoreChildrenImpl() {
        this.children = this.CloudOfferings.map((offering) => {
            const enable = this.enableOfferings.findIndex(o => o.offeringType === offering) !== -1;
            return new ConnecorOfferingTreeItem_1.ConnectorOfferingTreeItem(offering.toString(), this, enable);
        });
        return this.children;
    }
    hasMoreChildrenImpl() {
        return true;
    }
}
exports.ConnectorTreeItem = ConnectorTreeItem;
//# sourceMappingURL=ConnectorTreeItem.js.map