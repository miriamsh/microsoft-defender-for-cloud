"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsTreeDataProvider = void 0;
const arm_security_1 = require("@azure/arm-security");
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../constants");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
const FilterCommand_1 = require("../Commands/FilterCommand");
class ConnectorsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this.children = [];
        this.contextValue = 'securityCenter.connectors';
        this.label = label;
        this.client = new arm_security_1.SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.connectors = this.client.connectors;
        this.iconPath = constants_1.connectorIcon;
    }
    async loadMoreChildrenImpl(clearCache, context) {
        this.context = context;
        if (this.children.length === 0) {
            const value = await (await this.client.connectors.list().byPage().next()).value;
            for (let item of value) {
                this.children.push(new ConnectorTreeItem_1.ConnectorTreeItem("Connector", item.name, item.cloudProvider, this));
            }
        }
        return (0, FilterCommand_1.connectorsFiltering)(this.parent.filteringSettings, this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.ConnectorsTreeDataProvider = ConnectorsTreeDataProvider;
//# sourceMappingURL=ConnectorsTreeDataProvider.js.map