"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHierarchy = void 0;
const vscode = require("vscode");
const GetHierarchyWebViewContentCommand_1 = require("./GetHierarchyWebViewContentCommand");
const NodeUtils_1 = require("../Utility/NodeUtils");
const HierarchyTreeItem_1 = require("./HierarchyTreeItem");
function createHierarchy(entities, context) {
    if (entities === undefined) {
        vscode.window.showInformationMessage("There are no entities to display.");
    }
    else {
        const panel = vscode.window.createWebviewPanel('Security Alert Hierarchy', 'Security Alert Hierarchy', vscode.ViewColumn.One, {
            enableScripts: true
        });
        let entitiesById = new Map();
        if (entities === undefined) {
            return;
        }
        for (const entity of entities) {
            let children = [];
            let prop;
            for (prop in entity) {
                const refId = entity[prop]['$ref'];
                if (refId !== undefined) {
                    let childValue = entitiesById.get(refId);
                    childValue['hasFather'] = true;
                    entitiesById.set(refId, childValue);
                    children.push(refId);
                }
            }
            const name = (0, NodeUtils_1.createLabel)(entity['name'], entity['type']);
            const parentValue = { name: name, type: entity['type'], children: children, hasFather: false };
            entitiesById.set(entity['$id'], parentValue);
        }
        let tree = [];
        entitiesById.forEach((value, key) => {
            if (value.hasFather === false) {
                let iconPath = (0, NodeUtils_1.createIconPath)(panel, context, value['type']);
                let subTree = new HierarchyTreeItem_1.HierarchyTreeItem(value.name, true, iconPath, null);
                subTree.setChildren(createSubTree(panel, context, value.children, entitiesById));
                tree.push(subTree);
            }
        });
        panel.webview.html = (0, GetHierarchyWebViewContentCommand_1.getHierarchyWebViewContent)(panel, context, JSON.stringify(tree));
    }
}
exports.createHierarchy = createHierarchy;
function createSubTree(panel, context, children, entitiesById) {
    if (children === undefined) {
        return undefined;
    }
    else {
        let subTree = [];
        children.forEach((child) => {
            const childDetails = entitiesById.get(child);
            const iconPath = (0, NodeUtils_1.createIconPath)(panel, context, childDetails.type);
            let subTreeItem = new HierarchyTreeItem_1.HierarchyTreeItem(childDetails.name, false, iconPath, null);
            subTreeItem.setChildren(createSubTree(panel, context, childDetails.children, entitiesById));
            subTree.push(subTreeItem);
        });
        return subTree;
    }
}
//# sourceMappingURL=CreateHierarchyCommand.js.map