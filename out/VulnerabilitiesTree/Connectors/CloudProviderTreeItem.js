"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudProviderTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const Constants_1 = require("../../Constants");
const TreeUtils_1 = require("../../Utility/TreeUtils");
const ConnectorFilter_1 = require("./ConnectorFilter");
const ConnectorModel_1 = require("./ConnectorModel");
class CloudProviderTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, parent) {
        super(parent);
        this._children = [];
        this._apiUrl = [];
        this.model = [new ConnectorModel_1.Connectors()];
        this.contextValue = 'securityCenter.connectors.cloudProvider';
        this._title = label;
        this.label = label;
        this.cloudProvider = label;
        this.iconPath = TreeUtils_1.TreeUtils.getIconPath(Constants_1.Constants.cloudConnector);
        this._apiUrl.push(Constants_1.Constants.getConnectorListPath(this.subscription.subscriptionId));
        this.filter = new ConnectorFilter_1.ConnectorFilter();
        this.filter.properties['environmentName'] = this.label;
    }
    get apiUrl() {
        return this._apiUrl;
    }
    set apiUrl(apiUrl) {
        this._apiUrl = apiUrl;
    }
    hasMoreChildrenImpl() {
        return false;
    }
    loadMoreChildrenImpl() {
        this.suppressMaskLabel = true;
        this.label = `${this._title} (${this._children.length})`;
        return Promise.resolve(this._children);
    }
    appendChild(child) {
        this._children.push(child);
    }
}
exports.CloudProviderTreeItem = CloudProviderTreeItem;
//# sourceMappingURL=CloudProviderTreeItem.js.map