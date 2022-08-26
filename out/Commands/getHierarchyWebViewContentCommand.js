"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHierarchyWebViewContent = void 0;
const path = require("path");
const vscode = require("vscode");
const Constants_1 = require("../Constants");
function getHierarchyWebViewContent(panel, context, tree) {
    return `<div id="tree"></div>
<script id="script" value=${tree} src=${panel.webview.asWebviewUri(vscode.Uri.file(path.join(Constants_1.Constants.resourcesFolderPath, 'Hierarchy', 'HierarchyTree.js')))}></script>
<link rel="stylesheet" href=${panel.webview.asWebviewUri(vscode.Uri.file(path.join(Constants_1.Constants.resourcesFolderPath, 'Hierarchy', 'HierarchyTree.css')))} />`;
}
exports.getHierarchyWebViewContent = getHierarchyWebViewContent;
//# sourceMappingURL=GetHierarchyWebViewContentCommand.js.map