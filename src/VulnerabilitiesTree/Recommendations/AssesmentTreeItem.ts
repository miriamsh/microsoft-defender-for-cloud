import { SecurityCenter } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { SubAssessmentTreeItem } from "./SubAssesmentTreeItem";

export class AssessmentTreeItem extends AzExtParentTreeItem {
	public label: string;
	public context!: IActionContext;
	public severity!: string;
	public status!: string;
	public cloud!: string;
	private _client!: SecurityCenter;
	private _assessmentId!: string;
	private _children: SubAssessmentTreeItem[] = [];
	private _jsonItem: JSON;

	constructor(label: string, assessmentId: string, severity: string, status: string, cloud: string, parent: AzExtParentTreeItem, jsonItem: JSON) {
		super(parent);
		this.label = label;
		this._client = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
		this.severity = severity;
		this.status = status;
		this.cloud = cloud;
		this._assessmentId = assessmentId;
		this._jsonItem = jsonItem;
	}

	public readonly contextValue: string = 'securityCenter.recommendations.assessments';

	public async loadMoreChildrenImpl(): Promise<AzExtTreeItem[]> {
		let subscriptionId = `subscriptions/${this.subscription.subscriptionId}`;
		let value = await (await this._client.subAssessments.list(subscriptionId, this._assessmentId).byPage().next()).value;
		for (let item of value) {
			this._children.push(new SubAssessmentTreeItem(item.displayName!, this));
		}
		return this._children;
	}

	public hasMoreChildrenImpl(): boolean {
		return false;
	}
}