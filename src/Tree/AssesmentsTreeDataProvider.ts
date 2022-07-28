import * as vscode from 'vscode';
import { AssessmentsMetadata, Assessments, SecurityCenter, SecurityAssessmentResponse } from "@azure/arm-security";
import { AzExtParentTreeItem, IActionContext, TreeItemIconPath } from "@microsoft/vscode-azext-utils";
import EventEmitter = require("events");
import { assesmentIcon } from "../constants";
import { AssessmentTreeItem } from "./AssesmentTreeItem";
import { recommendationsFiltering } from '../Commands/FilterCommand';
import { SubscriptionTreeItem } from './SubscriptionTreeItem';


export class AssessmentsTreeDataProvider extends AzExtParentTreeItem {

    private _onDidChangeTreeData: vscode.EventEmitter<AssessmentTreeItem | undefined | null | void> = new vscode.EventEmitter<AssessmentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AssessmentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    public label: string;
    private readonly assessments: Assessments;
    private client!: SecurityCenter;
    public context!: IActionContext;
    private children: AssessmentTreeItem[] = [];

    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
        this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.assessments = this.client.assessments;
        this.iconPath = assesmentIcon;
    }

    public readonly contextValue: string = 'securityCenter.assesments';

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtParentTreeItem[]> {
        this.context = context;
        let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
        let value = await (await this.client.assessments.list(subscriptionId).byPage().next()).value;
        if (this.children.length === 0) {
            for (let item of value) {
                const jsonItem = JSON.stringify(item);
                this.children.push(new AssessmentTreeItem("Assessment", item.displayName, item.name, item.severity, item.status.code, item.resourceDetails.Source, this));
            }
        }
        return recommendationsFiltering((this.parent as SubscriptionTreeItem).filteringSettings, this.children);
    }

    public hasMoreChildrenImpl(): boolean {
        return false;
    }
}