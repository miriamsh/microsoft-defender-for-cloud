"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEdge = exports.createLabel = exports.createIconPath = void 0;
const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
function createIconPath(panel, context, type) {
    let iconPath = path.join(context.extensionPath, 'resources', `${type}.svg`);
    if (!fs.existsSync(iconPath)) {
        iconPath = path.join(context.extensionPath, 'resources', 'all-types.svg');
    }
    return panel.webview.asWebviewUri(vscode.Uri.file(path.join(iconPath))).toString();
}
exports.createIconPath = createIconPath;
function createLabel(name, type) {
    return name ? `${type}(${name})` : type;
}
exports.createLabel = createLabel;
function addEdge(prop, value, from, to, edges) {
    if (value['$ref'] !== undefined) {
        let edge = (({ from: from.id, to: to[prop]['$ref'], arrows: "to" }));
        edges.push(edge);
    }
    return edges;
}
exports.addEdge = addEdge;
//# sourceMappingURL=GlobalCommand.js.map