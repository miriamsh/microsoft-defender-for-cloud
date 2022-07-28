import { AssessmentsMetadata, Assessments, SecurityCenter, SecurityAssessmentResponse } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { SubAssessmentTreeItem } from "./SubAssesmentTreeItem";
import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { Command } from "vscode";

export class AssessmentTreeItem extends AzExtParentTreeItem {
	public label: string;
	public contextValue: string;
	private client!: SecurityCenter;
	public context!: IActionContext;
    public severity!:string;
    public status!:string;
    public cloud!:string;
    private assessmentId!:string;
    private children:SubAssessmentTreeItem[]=[];

    constructor(contextValue: string,label:string,assessmentId:string,severity:string, status:string,cloud:string,parent: AzExtParentTreeItem) {
		super(parent);
		this.label = label;
		this.contextValue = contextValue;
		this.client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.severity = severity;
		this.status = status;
        this.cloud=cloud;
        this.assessmentId=assessmentId;
	}
	public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
		let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
		let value = await (await this.client.subAssessments.list(subscriptionId,this.assessmentId).byPage().next()).value;
		for (let item of value) {
			const jsonItem=JSON.stringify(item);
			this.children.push(new SubAssessmentTreeItem("SubAssessment",item.displayName!, this));
		}
		return this.children;
	}

	public hasMoreChildrenImpl(): boolean {

		return false;
	}
}