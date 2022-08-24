"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHierarchy = void 0;
const vscode = require("vscode");
const TreeItem_1 = require("../TreeItem");
const getHierarchyWebViewContentCommand_1 = require("./getHierarchyWebViewContentCommand");
const GlobalCommand_1 = require("../../Commands/GlobalCommand");
function createHierarchy(entities, context) {
    const panel = vscode.window.createWebviewPanel('Security Alert Hierarchy', 'Security Alert Hierarchy', vscode.ViewColumn.One, {
        enableScripts: true
    });
    let entitiesById = new Map();
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
        const name = (0, GlobalCommand_1.createLabel)(entity['name'], entity['type']);
        const parentValue = { name: name, type: entity['type'], children: children, hasFather: false };
        entitiesById.set(entity['$id'], parentValue);
    }
    let tree = [];
    entitiesById.forEach((value, key) => {
        if (value.hasFather === false) {
            let iconPath = (0, GlobalCommand_1.createIconPath)(panel, context, value['type']);
            let subTree = new TreeItem_1.TreeItem(value.name, true, iconPath, null);
            subTree.setChildren(createSubTree(panel, context, value.children, entitiesById));
            tree.push(subTree);
        }
    });
    panel.webview.html = (0, getHierarchyWebViewContentCommand_1.getHierarchyWebViewContent)(panel, context, JSON.stringify(tree));
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
            const iconPath = (0, GlobalCommand_1.createIconPath)(panel, context, childDetails.type);
            let subTreeItem = new TreeItem_1.TreeItem(childDetails.name, false, iconPath, null);
            subTreeItem.setChildren(createSubTree(panel, context, childDetails.children, entitiesById));
            subTree.push(subTreeItem);
        });
        return subTree;
    }
}
//# sourceMappingURL=createHierarchyCommand.js.map