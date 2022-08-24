import * as vscode from 'vscode';
import { SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem } from "@microsoft/vscode-azext-utils";
import { AssessmentTreeItem } from './AssesmentTreeItem';
import { TreeUtils } from '../../Utility/TreeUtils';
import { Constants } from '../../constants';
import { recommendationsFiltering } from '../../Commands/FilterVulnerabilities';
import { getConfigurationSettings } from '../../Utility/ConfigUtils';
import { SecurityAssessment } from './SecurityAssessment.type';
import { json } from 'stream/consumers';



export class RecommendationsTreeDataProvider extends AzExtParentTreeItem {

    private _onDidChangeTreeData: vscode.EventEmitter<AssessmentTreeItem | undefined | null | void> = new vscode.EventEmitter<AssessmentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AssessmentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    public label: string;
    private _client!: SecurityCenter;
    private _children: AssessmentTreeItem[] = [];
    private _title: string;
    public readonly contextValue: string = 'securityCenter.recommendations';

    constructor(label: string, parent: AzExtParentTreeItem, client: SecurityCenter) {
        super(parent);
        this._title = label;
        this.label = label;
        this._client = client;
        this.iconPath = TreeUtils.getIconPath(Constants.assessmentIcon);
    }

    public async loadMoreChildrenImpl(): Promise<AzExtParentTreeItem[]> {
        if (this._children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const data = await (await this._client.assessments.list(subscriptionId).byPage().next()).value;
            data.map((assessment: SecurityAssessment) => {
                this._children.push(new AssessmentTreeItem(assessment.id, assessment.displayName, assessment.name, assessment.status.code, assessment.resourceDetails.Source, this, JSON.stringify(assessment), this._client));
            });
        }

        const filteredRecommendations = recommendationsFiltering(await getConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId), this._children);
        this.label = `${this._title} (${filteredRecommendations.length})`;
        return filteredRecommendations;
    }


    public hasMoreChildrenImpl(): boolean {
        return false;
    }


}