"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsTreeDataProvider = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const FilterVulnerabilities_1 = require("../../Commands/FilterVulnerabilities");
const TreeUtils_1 = require("../../Utility/TreeUtils");
const ConfigUtils_1 = require("../../Utility/ConfigUtils");
const CloudProviderTreeItem_1 = require("./CloudProviderTreeItem");
const connectorOfferings_enum_1 = require("../../Models/connectorOfferings.enum");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
class ConnectorsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent, client) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.connectors';
        this.label = label;
        this._client = client;
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(constants_1.Constants.connectorIcon);
    }
    get children() {
        return this._children;
    }
    async loadMoreChildrenImpl() {
        if (this._children.length === 0) {
            const awsConnector = new CloudProviderTreeItem_1.CloudProviderTreeItem("AWS", this);
            const azureConnector = new CloudProviderTreeItem_1.CloudProviderTreeItem("Azure", this);
            const githubConnector = new CloudProviderTreeItem_1.CloudProviderTreeItem("Github", this);
            const gcpConnector = new CloudProviderTreeItem_1.CloudProviderTreeItem("GCP", this);
            const data = (await this._client.securityConnectors.list().byPage().next()).value;
            data.map((connector) => {
                if (connector.properties.environmentName === 'AWS') {
                    awsConnector.appendChild(new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, connector.properties.offerings, Object.keys(connectorOfferings_enum_1.AWSOfferings), awsConnector, connector.id));
                }
                else if (connector.properties.environmentName === 'GCP') {
                    gcpConnector.appendChild(new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, connector.properties.offerings, Object.keys(connectorOfferings_enum_1.GCPOfferings), gcpConnector, connector.id));
                }
                else {
                    githubConnector.appendChild(new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, connector.properties.offerings, Object.keys(connectorOfferings_enum_1.GithubOfferings), githubConnector, connector.id));
                }
            });
            this._children = [awsConnector, azureConnector, gcpConnector, githubConnector];
        }
        return (0, FilterVulnerabilities_1.connectorsFiltering)((await (0, ConfigUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId)), this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.ConnectorsTreeDataProvider = ConnectorsTreeDataProvider;
//# sourceMappingURL=ConnectorsTreeDataProvider.js.map