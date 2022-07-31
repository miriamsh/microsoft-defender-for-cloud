import * as vscode from 'vscode';
import { AssessmentsMetadata, Assessments, SecurityCenter, SecurityAssessmentResponse } from "@azure/arm-security";
import { AzExtParentTreeItem, IActionContext, TreeItemIconPath } from "@microsoft/vscode-azext-utils";
import EventEmitter = require("events");
import { assesmentIcon } from "../constants";
import { AssessmentTreeItem } from "./AssesmentTreeItem";
import { recommendationsFiltering } from '../Commands/FilterCommand';
import { SubscriptionTreeItem } from './SubscriptionTreeItem';


export class RecommendationsTreeDataProvider extends AzExtParentTreeItem {


    private _onDidChangeTreeData: vscode.EventEmitter<AssessmentTreeItem | undefined | null | void> = new vscode.EventEmitter<AssessmentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AssessmentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    public label: string;
    private readonly assessments: Assessments;
    private client!: SecurityCenter;
    private context!: IActionContext;
    private children: AssessmentTreeItem[] = [];
    private title: string;

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.title = label;
        this.label = label;
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = assesmentIcon;
    }

    public readonly contextValue: string = 'securityCenter.recommendations';

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtParentTreeItem[]> {
        this.context = context;
        if (this.children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const value = await (await this.client.assessments.list(subscriptionId).byPage().next()).value;
            for (let item of value) {
                this.children.push(new AssessmentTreeItem(item.displayName, item.name, item.severity, item.status.code, item.resourceDetails.Source, this));
            }
        }
        const filteredItems = recommendationsFiltering((this.parent as SubscriptionTreeItem).filteringSettings, this.children);
        this.label = this.title + " " + `(${filteredItems.length})`; 
        return filteredItems;
    }

    

    public hasMoreChildrenImpl(): boolean {
        return true;
    }


}