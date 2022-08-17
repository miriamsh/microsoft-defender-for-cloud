"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCPConnectorTreeItem = void 0;
const ConnecorOfferingTreeItem_1 = require("./ConnecorOfferingTreeItem");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
class GCPConnectorTreeItem extends ConnectorTreeItem_1.ConnectorTreeItem {
    constructor(label, plans, parent) {
        super(label, plans, parent);
        this.offeringsOptions = [];
        //TODO:github types of offering
        // this.offeringsOptions = [
        //     KnownOfferingType.CspmMonitorAws, KnownOfferingType.DefenderForContainersAws, KnownOfferingType.DefenderForServersAws, KnownOfferingType.InformationProtectionAws
        // ];
    }
    async loadMoreChildrenImpl() {
        this.children = this.offeringsOptions.map((offering) => {
            const enable = this.concreteOfferings.findIndex(o => o.description === offering) !== -1;
            return new ConnecorOfferingTreeItem_1.ConnectorOffering(offering.toString(), this, enable);
        });
        return this.children;
    }
    hasMoreChildrenImpl() {
        return true;
    }
}
exports.GCPConnectorTreeItem = GCPConnectorTreeItem;
//# sourceMappingURL=GCPConnectorTreeItem.js.map