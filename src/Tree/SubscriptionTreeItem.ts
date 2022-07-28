import { SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { subscriptionIcon } from '../constants';
import { FilterSettings } from "../Models/FilterSettings";
import { AlertsTreeDataProvider } from "./AlertsTreeDataProvider";
import { AlertTreeItem } from "./AlertTreeItem";
import { AssessmentsTreeDataProvider } from "./AssesmentsTreeDataProvider";
import { AssessmentTreeItem } from "./AssesmentTreeItem";
import { ConnectorsTreeDataProvider } from "./ConnectorsTreeDataProvider";
import { ConnectorTreeItem } from "./ConnectorTreeItem";

export class SubscriptionTreeItem extends SubscriptionTreeItemBase {

    private _nextLink: string | undefined;
    parent!: AzExtParentTreeItem;
    root!: ISubscriptionContext;
    filteringSettings!: FilterSettings;

    constructor(
        parent: AzExtParentTreeItem,
        root: ISubscriptionContext) {
        super(parent, root);
        this.root = root;
        this.iconPath = subscriptionIcon;
        this.filteringSettings = new FilterSettings();
    }

    public readonly contextValue: string = 'azureutils.subscription';

    public hasMoreChildrenImpl(): boolean {
        return this._nextLink !== undefined;
    }

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {

        let alerts: AlertsTreeDataProvider = new AlertsTreeDataProvider("Security Alerts", this);
		let assessments: AssessmentsTreeDataProvider = new AssessmentsTreeDataProvider("Recommendations", this);
		let connectors: ConnectorsTreeDataProvider = new ConnectorsTreeDataProvider("Connectors", this);

		return [alerts, assessments, connectors];
    }

}