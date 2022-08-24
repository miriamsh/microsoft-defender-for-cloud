import { AzExtParentTreeItem, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";


//TODO: Explore where it comes from, bring it and create instance from this class
export class UnHealthyResourceTreeItem extends AzExtTreeItem {
    public label: string;
    
    constructor(label: string, parent: AzExtParentTreeItem) {
        super(parent);
        this.label = label;
    }

    public readonly contextValue: string='securityCenter.recommendations.assessments.subAssessments.unhealthyResource';
}