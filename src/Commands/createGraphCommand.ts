import { AlertEntity } from "@azure/arm-security";
import path = require("path");
import * as vscode from 'vscode';
import { getGraphWebviewContent } from "./GetGrapWebViewContentCommand";
import * as fs from 'fs';
import { addEdge, createIconPath, createLabel } from '../Utility/nodeUtils';

export function createGraph(entities: AlertEntity[], context: vscode.ExtensionContext) {
   if (entities === undefined) {
      vscode.window.showInformationMessage("There are no entities to display.");
   }
   else {
      const panel = vscode.window.createWebviewPanel(
         'Security Alert Graph',
         'Security Alert Graph',
         vscode.ViewColumn.One,
         {
            enableScripts: true
         }
      );

      let edges: {}[] = [];
      let nodes: { id: string }[] = [];


      for (let entity of entities) {

         const imagePath = createIconPath(panel, context, entity['type']!);
         const label = createLabel(entity['name'], entity['type']!);

         const node = (({ id: entity['$id'], label: label!, image: imagePath, shape: "image", font: { color: "white", size: 15 }, }));
         nodes.push(node);

         let prop: keyof typeof entity;
         for (prop in entity) {
            edges = addEdge(prop, entity[prop], node, entity, edges)!;
         }
      }

      panel.webview.html = getGraphWebviewContent(nodes, edges);
   }
}
