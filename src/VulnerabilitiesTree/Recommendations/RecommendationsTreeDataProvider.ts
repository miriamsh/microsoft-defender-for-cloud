import * as vscode from 'vscode';
import { SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem } from "@microsoft/vscode-azext-utils";
import { AssessmentTreeItem } from './AssesmentTreeItem';
import { TreeUtils } from '../../Utility/TreeUtils';
import { Constants } from '../../Constants';
import { recommendationsFiltering } from '../../Commands/FilterVulnerabilities';
import { getConfigurationSettings } from '../../Utility/ConfigUtils';
import { SecurityAssessment } from './SecurityAssessment.type';
import { json } from 'stream/consumers';
import { IActionContext } from 'vscode-azureextensionui';
import { Assessments } from './AssessmentModel';



export class RecommendationsTreeDataProvider extends AzExtParentTreeItem {

    private _onDidChangeTreeData: vscode.EventEmitter<AssessmentTreeItem | undefined | null | void> = new vscode.EventEmitter<AssessmentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AssessmentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    public label: string;
    private _client!: SecurityCenter;
    private _children: AssessmentTreeItem[] = [];
    private _title: string;
    private _nextLink: string | undefined;
    private _apiUrl: string[] = [];
    public model: any[] = [new Assessments()];
    public readonly contextValue: string = 'securityCenter.recommendations';

    constructor(label: string, parent: AzExtParentTreeItem, client: SecurityCenter) {
        super(parent);
        this._title = label;
        this.label = label;
        this._client = client;
        this.iconPath = TreeUtils.getIconPath(Constants.assessmentIcon);
        this._apiUrl.push(Constants.getAssessmentListPath(this.subscription.subscriptionId));
    }
    public get apiUrl(): string[] {
        return this._apiUrl;
    }
    public set apiUrl(apiUrl: string[]) {
        this._apiUrl = apiUrl;
    }
    public async loadMoreChildrenImpl(clearCache: boolean, _context: IActionContext): Promise<AzExtParentTreeItem[]> {
        if (clearCache) {
            this._nextLink = undefined;
        }

        if (this._children.length === 0) {
            const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
            const data =  this._nextLink === undefined ? await (await this._client.assessments.list(subscriptionId).byPage().next()).value:
            await (await this._client.assessments.list(subscriptionId).next()).value;
            //TODO:check if loadMoreChildren works. if it does - add this functionality to all the treeDataProvider classes 
            this._nextLink = data.next;
            data.map((assessment: SecurityAssessment) => {
                const parameters = new URLParameters(assessment.id);
                this._children.push(new AssessmentTreeItem(assessment.id, assessment.displayName, assessment.name, assessment.status.code, assessment.resourceDetails.Source, this, JSON.stringify(assessment), this._client,parameters.getResourceId()));
            });
        }
        
        const filteredRecommendations = recommendationsFiltering(await getConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId), this._children);
        this.childTypeLabel = `${this._title} (${filteredRecommendations.length})`;
        return filteredRecommendations;
    }


    public hasMoreChildrenImpl(): boolean {
        return this._nextLink !== undefined;

    }


}
export class URLParameters {
    private id: string;
    private startResourceId: string = "resourceGroups/";
    private endResourceId: string = "/providers/Microsoft.Security";
    constructor(id: string) {
        this.id = id;
    }

    public getResourceId(): string {
        let start = this.id.indexOf(this.startResourceId);
        if (start === -1) {
            start = this.id.indexOf(this.startResourceId.toLocaleLowerCase());
        }
        const end = this.id.indexOf(this.endResourceId);
        return this.id.slice(start + this.startResourceId.length, end);
    }
}