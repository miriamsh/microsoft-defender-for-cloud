"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorTreeItem = void 0;
const vscode_azext_utils_1 = require("@microsoft/vscode-azext-utils");
const constants_1 = require("../../constants");
const ConnecorOfferingTreeItem_1 = require("./ConnecorOfferingTreeItem");
const ConnectorModel_1 = require("./ConnectorModel");
class ConnectorTreeItem extends vscode_azext_utils_1.AzExtParentTreeItem {
    constructor(label, possibleOfferings, cloudOfferings, parent, id, resourceGroupName) {
        super(parent);
        // private readonly _possibleOfferings: { "offeringType": AWSOfferings | GCPOfferings | GithubOfferings }[];
        this._children = [];
        this.model = [new ConnectorModel_1.Connectors()];
        this._apiUrl = [];
        this.contextValue = 'securityCenter.connectors.cloudProvider.connector';
        this.label = label;
        // this._possibleOfferings = possibleOfferings;
        this._cloudOfferings = cloudOfferings;
        this.id = id;
        this._resourceGroupName = resourceGroupName;
        this._apiUrl.push(constants_1.Constants.getConnectorPath(this.subscription.subscriptionId, resourceGroupName, label));
    }
    get resourceGroupName() {
        return this._resourceGroupName;
    }
    set resourceGroupName(resourceGroupName) {
        this._resourceGroupName = resourceGroupName;
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
    async loadMoreChildrenImpl() {
        this._children = this._cloudOfferings.map((offering) => {
            //if (this._possibleOfferings.findIndex(o => o.offeringType === offering) !== -1) {
            return new ConnecorOfferingTreeItem_1.ConnectorOfferingTreeItem(offering.toString(), this);
            //}
        });
        return this._children;
    }
}
exports.ConnectorTreeItem = ConnectorTreeItem;
//# sourceMappingURL=ConnectorTreeItem.js.map