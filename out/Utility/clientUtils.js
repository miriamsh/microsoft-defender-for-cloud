"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const arm_security_1 = require("@azure/arm-security");
const arm_resources_1 = require("@azure/arm-resources");
const arm_communication_1 = require("@azure/arm-communication");
class Client {
    constructor(subscription) {
        this.resourceManagementClient = new arm_resources_1.ResourceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.communicationManagementClient = new arm_communication_1.CommunicationServiceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.securityCenterClient = new arm_security_1.SecurityCenter(subscription.credentials, subscription.subscriptionId);
    }
    getResourceManagementClient() {
        return this.resourceManagementClient;
    }
    getCommunicationManagementClient() {
        return this.communicationManagementClient;
    }
    getSecurityCenterClient() {
        return this.securityCenterClient;
    }
}
exports.Client = Client;
//# sourceMappingURL=clientUtils.js.map