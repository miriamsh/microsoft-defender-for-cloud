import { AlertEntity } from "@azure/arm-security";
import path = require("path");
import * as vscode from 'vscode';
import { getHierarchyWebViewContent } from "./GetHierarchyWebViewContentCommand";
import * as fs from 'fs';
import { createIconPath, createLabel } from '../Utility/NodeUtils';
import { HierarchyTreeItem } from "./HierarchyTreeItem";

export function createHierarchy(entities: AlertEntity[], context: vscode.ExtensionContext) {
    if (entities === undefined) {
        vscode.window.showInformationMessage("There are no entities to display.");
    }
    else {
        const panel = vscode.window.createWebviewPanel(
            'Security Alert Hierarchy',
            'Security Alert Hierarchy',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        let entitiesById: Map<string, { name: string, type: string, children: string[], hasFather: boolean }> = new Map<string, { name: string, type: string, children: string[], hasFather: boolean }>();
        if (entities === undefined) { return; }
        for (const entity of entities) {
            let children = [];

            let prop: keyof typeof entity;
            for (prop in entity) {

                const refId = entity[prop]['$ref'];
                if (refId !== undefined) {

                    let childValue = entitiesById.get(refId);

                    childValue!['hasFather'] = true;
                    entitiesById.set(refId, childValue!);
                    children.push(refId);
                }
            }

            const name = createLabel(entity['name'], entity['type']!);
            const parentValue = { name: name!, type: entity['type']!, children: children, hasFather: false };
            entitiesById.set(entity['$id'], parentValue);
        }

        let tree: HierarchyTreeItem[] = [];
        entitiesById.forEach((value: { name: string, type: string, children: string[]; hasFather: boolean; }, key: string) => {

            if (value.hasFather === false) {
                let iconPath = createIconPath(panel, context, value['type']!);
                let subTree = new HierarchyTreeItem(value.name, true, iconPath, null);
                subTree.setChildren(createSubTree(panel, context, value.children, entitiesById)!);
                tree.push(subTree);
            }
        }
        );

        panel.webview.html = getHierarchyWebViewContent(panel, context, JSON.stringify(tree));
    }
}

function createSubTree(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, children: string[] | undefined, entitiesById: Map<string, { name: string, type: string, children: string[], hasFather: boolean }>): HierarchyTreeItem[] | undefined {

    if (children === undefined) {
        return undefined;
    }

    else {
        let subTree: HierarchyTreeItem[] = [];

        children.forEach((child: string) => {

            const childDetails = entitiesById.get(child);
            const iconPath = createIconPath(panel, context, childDetails!.type);
            let subTreeItem = new HierarchyTreeItem(childDetails!.name, false, iconPath, null);
            subTreeItem.setChildren(createSubTree(panel, context, childDetails!.children, entitiesById)!);
            subTree.push(subTreeItem);
        });

        return subTree!;
    }
}