"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsCloudProviderTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
class ConnectorsCloudProviderTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider';
        this.title = label;
        this.label = label;
        this.cloudProvider = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
}
exports.ConnectorsCloudProviderTreeDataProvider = ConnectorsCloudProviderTreeDataProvider;
//# sourceMappingURL=ConnectorsCloudProviderTreeDataProvider.js.map