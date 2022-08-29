import { Assessments, AssessmentType, SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from "../../constants";
import { AssessmentTreeItem } from "./AssesmentTreeItem";
import { SubAssessments } from "./subAssessmentModel";


export class SubAssessmentTreeItem extends AzExtTreeItem {

    private _client!: SecurityCenter;
    public label: string;
    private _apiUrl: string[]=[];
    public model:any[]=[new SubAssessments()];

    constructor(label: string,name:string, parent: AzExtParentTreeItem, client:SecurityCenter) {
        super(parent);
        this.label = label;
         this._client = client;
         this._apiUrl.push(Constants.getSubAssessmentPath(this.subscription.subscriptionId,(this.parent as AssessmentTreeItem).assessmentName,name));

    }
	public get apiUrl(): string[] {
		return this._apiUrl;
	}
	public set apiUrl(apiUrl: string[]) {
		this._apiUrl = apiUrl;
	}
    public readonly contextValue: string= 'securityCenter.recommendations.assessments.subAssessments';

}