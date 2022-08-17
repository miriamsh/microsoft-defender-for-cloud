"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorOffering = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ConnectorOffering extends vscode_azext_utils_1.AzExtTreeItem {
    constructor(label, parent, enable) {
        super(parent);
        this.contextValue = "securityCenter.connectors.cloudProvider.offering";
        this.label = label;
        this.enable = enable;
    }
}
exports.ConnectorOffering = ConnectorOffering;
//# sourceMappingURL=ConnecorOffering.js.map