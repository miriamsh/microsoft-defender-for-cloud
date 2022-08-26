"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraph = void 0;
const vscode = require("vscode");
const GetGrapWebViewContentCommand_1 = require("./GetGrapWebViewContentCommand");
const nodeUtils_1 = require("../Utility/nodeUtils");
function createGraph(entities, context) {
    if (entities === undefined) {
        vscode.window.showInformationMessage("There are no entities to display.");
    }
    else {
        const panel = vscode.window.createWebviewPanel('Security Alert Graph', 'Security Alert Graph', vscode.ViewColumn.One, {
            enableScripts: true
        });
        let edges = [];
        let nodes = [];
        for (let entity of entities) {
            const imagePath = (0, nodeUtils_1.createIconPath)(panel, context, entity['type']);
            const label = (0, nodeUtils_1.createLabel)(entity['name'], entity['type']);
            const node = (({ id: entity['$id'], label: label, image: imagePath, shape: "image", font: { color: "white", size: 15 }, }));
            nodes.push(node);
            let prop;
            for (prop in entity) {
                edges = (0, nodeUtils_1.addEdge)(prop, entity[prop], node, entity, edges);
            }
        }
        panel.webview.html = (0, GetGrapWebViewContentCommand_1.getGraphWebviewContent)(nodes, edges);
    }
}
exports.createGraph = createGraph;
//# sourceMappingURL=CreateGraphCommand.js.map