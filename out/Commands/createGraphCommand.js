"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraph = void 0;
const vscode = require("vscode");
const getGrapWebViewContentCommand_1 = require("./getGrapWebViewContentCommand");
const GlobalCommand_1 = require("../../Commands/GlobalCommand");
function createGraph(entities, context) {
    const panel = vscode.window.createWebviewPanel('Security Alert Graph', 'Security Alert Graph', vscode.ViewColumn.One, {
        enableScripts: true
    });
    let edges = [];
    let nodes = [];
    for (let entity of entities) {
        const imagePath = (0, GlobalCommand_1.createIconPath)(panel, context, entity['type']);
        const label = (0, GlobalCommand_1.createLabel)(entity['name'], entity['type']);
        const node = (({ id: entity['$id'], label: label, image: imagePath, shape: "image", font: { color: "white", size: 15 }, }));
        nodes.push(node);
        let prop;
        for (prop in entity) {
            edges = (0, GlobalCommand_1.addEdge)(prop, entity[prop], node, entity, edges);
        }
    }
    panel.webview.html = (0, getGrapWebViewContentCommand_1.getGraphWebviewContent)(nodes, edges);
}
exports.createGraph = createGraph;
//# sourceMappingURL=createGraphCommand.js.map