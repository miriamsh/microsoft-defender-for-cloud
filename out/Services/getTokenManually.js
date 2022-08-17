"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
async function getToken(subscription) {
    const token = subscription.credentials.getToken();
    return token;
}
exports.getToken = getToken;
//# sourceMappingURL=getTokenManually.js.map