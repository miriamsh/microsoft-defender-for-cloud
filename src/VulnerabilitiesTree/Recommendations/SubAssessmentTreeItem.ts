import { Assessments, AssessmentType, SecurityCenter, SubAssessments, } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";


export class SubAssessmentTreeItem extends AzExtTreeItem {

    private _client!: SecurityCenter;
    public label: string;
     

    constructor(label: string, parent: AzExtParentTreeItem, client:SecurityCenter) {
        super(parent);
        this.label = label;
         this._client = client;
    }

    public readonly contextValue: string= 'securityCenter.recommendations.assessments.subAssessments';

}