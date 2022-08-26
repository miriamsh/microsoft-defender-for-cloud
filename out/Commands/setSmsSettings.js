"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSmsNotificationSettings = void 0;
//Sets SMS notification Command
async function setSmsNotificationSettings(resource) {
    const ans = await resource.verifyRequiredInfrastructure();
    if (ans) {
        const set = await resource.updateToPhoneNumber();
        if (set) {
            return true;
        }
    }
    return false;
}
exports.setSmsNotificationSettings = setSmsNotificationSettings;
//# sourceMappingURL=SetSmsSettings.js.map