"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorsTreeDataProvider = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const filterVulnerabilities_1 = require("../../Commands/filterVulnerabilities");
const treeUtils_1 = require("../../Utility/treeUtils");
const configUtils_1 = require("../../Utility/configUtils");
const CloudProviderTreeItem_1 = require("./CloudProviderTreeItem");
const axios_1 = require("axios");
const connectorOfferings_enum_1 = require("../../Models/connectorOfferings.enum");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
class ConnectorsTreeDataProvider extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._children = [];
        this.contextValue = 'securityCenter.connectors';
        this.label = label;
        this.iconPath = treeUtils_1.TreeUtils.getIconPath(constants_1.Constants.connectorIcon);
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
            const token = await this.subscription.credentials.getToken();
            await axios_1.default.get(constants_1.Constants.getConnectorsList(this.subscription.subscriptionId), {
                headers: {
                    'authorization': `Bearer ${token.accessToken}`
                }
            }).then(request => {
                const connectorList = request.data.value;
                connectorList.map((connector) => {
                    if (connector.environmentName === 'AWS') {
                        awsConnector.appendChild(new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, connector.offerings, Object.keys(connectorOfferings_enum_1.AWSOfferings), awsConnector));
                    }
                    else if (connector.environmentName === 'GCP') {
                        gcpConnector.appendChild(new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, connector.offerings, Object.keys(connectorOfferings_enum_1.GCPOfferings), gcpConnector));
                    }
                    else {
                        githubConnector.appendChild(new ConnectorTreeItem_1.ConnectorTreeItem(connector.name, connector.offerings, Object.keys(connectorOfferings_enum_1.GithubOfferings), githubConnector));
                    }
                });
            });
            this._children = [awsConnector, azureConnector, gcpConnector, githubConnector];
        }
        return (0, filterVulnerabilities_1.connectorsFiltering)((await (0, configUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.filtering, this.subscription.subscriptionId)), this.children);
    }
    hasMoreChildrenImpl() {
        return false;
    }
}
exports.ConnectorsTreeDataProvider = ConnectorsTreeDataProvider;
//# sourceMappingURL=ConnectorsTreeDataProvider.js.map