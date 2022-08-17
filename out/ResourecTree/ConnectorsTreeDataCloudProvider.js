"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsTreeDataCloudProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
const FilterCommand_1 = require("../Commands/FilterCommand");
const connectorsUtility_1 = require("../Utility/connectorsUtility");
class ConnectorsTreeDataCloudProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
    }
    async loadMoreChildrenImpl() {
        if (this.children.length === 0) {
            const connectorsList = await (await this.client.connectors.list().byPage().next()).value;
            connectorsList.map((connector) => {
                const cloudProvider = (0, connectorsUtility_1.getCloudProvider)(connector);
                this.children.push(new ConnectorTreeItem_1.ConnectorTreeItem("Connector", connector.name, connector.id, this));
            });
        }
        return (0, FilterCommand_1.connectorsFiltering)(this.parent.filteringSettings, this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.ConnectorsTreeDataCloudProvider = ConnectorsTreeDataCloudProvider;
//# sourceMappingURL=ConnectorsTreeDataCloudProvider.js.map