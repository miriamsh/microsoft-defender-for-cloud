"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHierarchyWebViewContent = void 0;
const path = require("path");
const vscode = require("vscode");
function getHierarchyWebViewContent(panel, context, tree) {
    return `<div id="tree"></div>
<script id="script" value=${tree} src=${panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src', 'Hierarchy', 'hierarchyTree.js')))}></script>
<link rel="stylesheet" href=${panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src', 'Hierarchy', 'hierarchyTree.css')))} />
`;
}
exports.getHierarchyWebViewContent = getHierarchyWebViewContent;
//# sourceMappingURL=getHierarchyWebViewContentCommand.js.map