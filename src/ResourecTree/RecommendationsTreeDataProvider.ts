import * as vscode from 'vscode';
import { AssessmentsMetadata, Assessments, SecurityCenter, SecurityAssessmentResponse } from "@azure/arm-security";
import { AzExtParentTreeItem, IActionContext, TreeItemIconPath } from "@microsoft/vscode-azext-utils";
import EventEmitter = require("events");
import { Constants } from "../constants";
import { AssessmentTreeItem } from "./AssesmentTreeItem";
import { recommendationsFiltering } from '../Commands/FilterCommand';
import { SubscriptionTreeItem } from './SubscriptionTreeItem';
import { getConfigurationSettings } from '../configOperations';
import { TreeUtils } from '../Utility/treeUtils';


export class RecommendationsTreeDataProvider extends AzExtParentTreeItem {
    private _onDidChangeTreeData: vscode.EventEmitter<AssessmentTreeItem | undefined | null | void> = new vscode.EventEmitter<AssessmentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AssessmentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
        

    public label: string;
    private readonly assessments: Assessments;
    private client!: SecurityCenter;
    private children: AssessmentTreeItem[] = [];
    private title:string;
 
    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = TreeUtils.getIconPath(Constants.assessmentIcon);
        this.title=label;
    }

    public readonly contextValue: string = 'securityCenter.recommendations';

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtParentTreeItem[]> {
        if (this.children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const value = await (await this.client.assessments.list(subscriptionId).byPage().next()).value;
            for (let item of value) {
                //how to get the severity of an assessments??
                this.children.push(new AssessmentTreeItem(item.displayName, item.name, item.severity, item.status.code, item.resourceDetails.Source, this, item));
            }
        }
         this.label+=`${this.children.length}`;
        //this.label = this.title + " " + `(${this.children.length})`;
        return recommendationsFiltering(getConfigurationSettings(Constants.extensionPrefix,Constants.filtering)[this.subscription.subscriptionId], this.children);
    }

    public hasMoreChildrenImpl(): boolean {
        return true;
    }


}