import { SecurityCenter, SubAssessments, } from "@azure/arm-security";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";

export class SubAssessmentTreeItem extends AzExtTreeItem {

    public label: string;
    public readonly contextValue: string = 'securityCenter.recommendations.assessments.sub-assessment';

    constructor( label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
    }
}