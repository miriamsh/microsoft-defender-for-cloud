import {  SecurityCenter, SecuritySubAssessment, SubAssessments } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from "../../constants";
import { Assessments } from "./AssessmentModel";
import { SubAssessmentTreeItem } from "./SubAssessmentTreeItem";


export class AssessmentTreeItem extends AzExtParentTreeItem {
	public label: string;
	private _client!: SecurityCenter;
	public context!: IActionContext;
    private _status!:string;
    private _environment!:string;
    private children:SubAssessmentTreeItem[]=[];
	private _jsonItem!:string;
	private _assessmentName:string;
	private _resourceId!: string;
	public model: any[] = [new Assessments()];
	private _apiUrl: string[] = [];

	public get apiUrl(): string[] {
		return this._apiUrl;
	}
	public get resourceId(): string {
		return this._resourceId;
	}
	public get status() : string {
		return this._status;
	}

	public get environment() : string {
		return this._environment;
	}
	
	public get jsonItem() : string {
		return this._jsonItem;
	}

	public get assessmentName(){
		return this._assessmentName;
	}
	

    constructor(id:string,label:string,name:string, status:string,environment:string,parent: AzExtParentTreeItem,jsonItem:string, client:SecurityCenter,resourceId:string) {
		super(parent);
		this.id=id;	
		this._assessmentName=name;
		this.label = label;
 		this._client = client;
		this._status = status;
        this._environment=environment;
		this._jsonItem=jsonItem;
		this._resourceId = resourceId;
		this._apiUrl.push(Constants.getAssessmentPath(this.subscription.subscriptionId, resourceId, name));
	
	}

	public readonly contextValue: string = 'securityCenter.recommendations.assessments';

	public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
		const subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
		const data = await (await this._client.subAssessments.list(subscriptionId,this._assessmentName).byPage().next()).value;
 		data.map((assessment:SecuritySubAssessment)=>{
			this.children.push(new SubAssessmentTreeItem(assessment.displayName!,assessment.name!, this, this._client));
		});
		return this.children;
	}

	public hasMoreChildrenImpl(): boolean {

		return false;
	}
}