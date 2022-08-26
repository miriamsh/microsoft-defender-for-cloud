import path = require('path');
import * as vscode from 'vscode';
import { Constants } from '../Constants';

export function getHierarchyWebViewContent(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, tree: string) {
   return `<div id="tree"></div>
<script id="script" value=${tree} src=${panel.webview.asWebviewUri(vscode.Uri.file(path.join(Constants.resourcesFolderPath,  'Hierarchy', 'HierarchyTree.js')))}></script>
<link rel="stylesheet" href=${panel.webview.asWebviewUri(vscode.Uri.file(path.join(Constants.resourcesFolderPath,  'Hierarchy', 'HierarchyTree.css')))} />`;
}