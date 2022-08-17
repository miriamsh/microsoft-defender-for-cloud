"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offering = void 0;
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
class Offering extends vscode_azureextensionui_1.AzExtTreeItem {
    constructor(label, parent) {
        super(parent);
        this.contextValue = "cloudProvider.offering";
        this.label = label;
    }
}
exports.Offering = Offering;
//# sourceMappingURL=offering.js.map