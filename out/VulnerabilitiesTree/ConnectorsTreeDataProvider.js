"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const FilterCommand_1 = require("../Commands/FilterCommand");
const treeUtils_1 = require("../Utility/treeUtils");
const configOperations_1 = require("../configOperations");
const AWSCloudProviderTreeDataProvider_1 = require("./Connectors/AWSCloudProviderTreeDataProvider");
const GCPCloudProviderTreeDataProvider_1 = require("./Connectors/GCPCloudProviderTreeDataProvider");
const AzureCloudProviderTreeDataProvider_1 = require("./Connectors/AzureCloudProviderTreeDataProvider");
class ConnectorsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.connectors';
        this.label = label;
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.connectorIcon);
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
    async loadMoreChildrenImpl(clearCache, context) {
        if (this.children.length === 0) {
            const cloudProviderManager = new Map([
                ["AWS", new AWSCloudProviderTreeDataProvider_1.AWSCloudProviderTreeDataProvider("AWS", this)],
                ["GCP", new GCPCloudProviderTreeDataProvider_1.GCPCloudProviderTreeDataProvider("GCP", this)],
                ["Azure", new AzureCloudProviderTreeDataProvider_1.AzureCloudProviderTreeDataProvider("Azure", this)]
            ]);
            // const connectorsList = await (await this.client.connectors.list().byPage().next()).value;
            // connectorsList.map((connector: ConnectorSetting) => {
            //     const cloudProvider: ConnectorsCloudProviderTreeDataProvider = cloudProviderManager.get(connector.cloudName!)!;
            //     cloudProvider.getChildren().push(new ConnectorTreeItem(connector.name!, this));
            // });
            // const array =Array.from(cloudProviderManager.values());
            // array.map(v=>{
            //     v.label=`${v.cloudProvider} (${this.children.length})`;
            // });
            this.children.push(...Array.from(cloudProviderManager.values()));
        }
        return (0, FilterCommand_1.connectorsFiltering)((0, configOperations_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering)[this.subscription.subscriptionId], this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.ConnectorsTreeDataProvider = ConnectorsTreeDataProvider;
//# sourceMappingURL=ConnectorsTreeDataProvider.js.map