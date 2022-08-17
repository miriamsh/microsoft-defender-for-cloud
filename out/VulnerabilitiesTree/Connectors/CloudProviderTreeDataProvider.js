"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudProviderTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
// import { connectorsFiltering } from "../Commands/FilterCommand";
const treeUtils_1 = require("../../Utility/treeUtils");
class CloudProviderTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider';
        this.title = label;
        this.label = label;
        this.cloudProvider = label;
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.cloudConnector);
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
    appendChild(child) {
        this.children.push(child);
    }
    loadMoreChildrenImpl() {
        return Promise.resolve(this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.CloudProviderTreeDataProvider = CloudProviderTreeDataProvider;
//# sourceMappingURL=CloudProviderTreeDataProvider.js.map