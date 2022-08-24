"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorOfferingTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ConnectorOfferingTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, parent) {
        super(parent);
        this.contextValue = "securityCenter.connectors.cloudProvider.offering";
        this.label = label;
    }
}
exports.ConnectorOfferingTreeItem = ConnectorOfferingTreeItem;
//# sourceMappingURL=ConnecorOfferingTreeItem.js.map