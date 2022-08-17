"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureConnectorTreeItem = void 0;
const arm_security_1 = require("@azure/arm-security");
const ConnecorOfferingTreeItem_1 = require("./ConnecorOfferingTreeItem");
const ConnectorTreeItem_1 = require("./ConnectorTreeItem");
class AzureConnectorTreeItem extends ConnectorTreeItem_1.ConnectorTreeItem {
    constructor(label, plans, parent) {
        super(label, plans, parent);
        this.offeringsOptions = [
            arm_security_1.KnownOfferingType.CspmMonitorAws, arm_security_1.KnownOfferingType.DefenderForContainersAws, arm_security_1.KnownOfferingType.DefenderForServersAws, arm_security_1.KnownOfferingType.InformationProtectionAws
        ];
    }
    async loadMoreChildrenImpl() {
        this.children = this.offeringsOptions.map((offering) => {
            const enable = this.concreteOfferings.findIndex(o => o.description === offering) !== -1;
            return new ConnecorOfferingTreeItem_1.ConnectorOffering(offering.toString(), this, enable);
        });
        return this.children;
    }
    hasMoreChildrenImpl() {
        throw new Error("Method not implemented.");
    }
}
exports.AzureConnectorTreeItem = AzureConnectorTreeItem;
//# sourceMappingURL=AzureConnectorTreeItem.js.map