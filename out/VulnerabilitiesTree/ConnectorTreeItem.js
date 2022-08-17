"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ConnectorTreeItem extends vscode_azext_utils_1.AzExtTreeItem {
    //public plans!:Plans[];
    constructor(label, parent) {
        super(parent);
        this.contextValue = 'securityCenter.connectors.cloudProvider.connector';
        this.label = label;
        // this.plans= ;
    }
}
exports.ConnectorTreeItem = ConnectorTreeItem;
//# sourceMappingURL=ConnectorTreeItem.js.map