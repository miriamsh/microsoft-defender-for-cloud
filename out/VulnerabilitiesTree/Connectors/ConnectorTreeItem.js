"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const ConnecorOfferingTreeItem_1 = require("./ConnecorOfferingTreeItem");
class ConnectorTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, possibleOfferings, cloudOfferings, parent) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider.connector';
        this.label = label;
        this._possibleOfferings = possibleOfferings;
        this._cloudOfferings = cloudOfferings;
    }
    hasMoreChildrenImpl() {
        return false;
    }
    async loadMoreChildrenImpl() {
        this._children = this._cloudOfferings.map((offering) => {
            const enable = this._possibleOfferings.findIndex(o => o.offeringType === offering) !== -1;
            return new ConnecorOfferingTreeItem_1.ConnectorOfferingTreeItem(offering.toString(), this, enable);
        });
        return this._children;
    }
}
exports.ConnectorTreeItem = ConnectorTreeItem;
//# sourceMappingURL=ConnectorTreeItem.js.map