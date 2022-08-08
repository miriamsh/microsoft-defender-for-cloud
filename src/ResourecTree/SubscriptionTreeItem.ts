import { SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from '../constants';
import { FilterSettings } from "../Models/FilterSettings";
import { AlertsTreeDataProvider } from "./AlertsTreeDataProvider";
import { RecommendationsTreeDataProvider } from "./RecommendationsTreeDataProvider";
import { ConnectorsTreeDataProvider } from "./ConnectorsTreeDataProvider";
import * as vscode from 'vscode';
import { getConfigurationSettings, setConfigurationSettings } from "../configOperations";
import { Notification } from "../Commands/NotificationSettingsCommand";
import { TreeUtils } from '../Utility/treeUtils';

export class SubscriptionTreeItem extends SubscriptionTreeItemBase {

    private _nextLink: string | undefined;
    parent!: AzExtParentTreeItem;
    filteringSettings!: FilterSettings;
    private notify:Notification;


    constructor(
        parent: AzExtParentTreeItem,
        root: ISubscriptionContext) {
        super(parent, root);
        this.iconPath = TreeUtils.getIconPath(Constants.subscriptionIcon);
        this.notify= new Notification(root);
    }

    public readonly contextValue: string = 'azureutils.subscription';

    public hasMoreChildrenImpl(): boolean {
        return this._nextLink !== undefined;
    }

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        //set configuration filtering
        if (!getConfigurationSettings(Constants.extensionPrefix,Constants.filtering)[this.subscription.subscriptionId]) {
            await setConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId, new FilterSettings().getAllSettings(), vscode.ConfigurationTarget.Global);
        }
        
        const alerts: AlertsTreeDataProvider = new AlertsTreeDataProvider("Security Alerts", this);
        const recommendations: RecommendationsTreeDataProvider = new RecommendationsTreeDataProvider("Recommendations", this);
        const connectors: ConnectorsTreeDataProvider = new ConnectorsTreeDataProvider("Connectors", this);

        return [connectors, recommendations, alerts];
    }

    public getNotify()
    {
        return this.notify;
    }

}