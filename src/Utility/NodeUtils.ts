import path = require("path");
import * as vscode from 'vscode';
import * as fs from 'fs';

export function createIconPath(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, type: string) {

   let iconPath = path.join(context.extensionPath, 'resources', `${type}.svg`);
   if (!fs.existsSync(iconPath)) {

      iconPath = path.join(context.extensionPath, 'resources', 'all-types.svg');

   }
   
   return panel.webview.asWebviewUri(vscode.Uri.file(
      path.join(iconPath))).toString();
}

export function createLabel(name: string, type: string) {
   return name ? `${type}(${name})` : type;

}

export function addEdge(prop: string, value: any, from: any, to: any, edges: {}[]): {}[] {
   if (value['$ref'] !== undefined) {
      let edge = (({ from: from.id, to: to[prop]['$ref'], arrows: "to" }));
      edges.push(edge);
   }
   return edges;

}