import { SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { extensionPrefix, filtering, subscriptionIcon } from '../constants';
import { FilterSettings } from "../Models/FilterSettings";
import { AlertsTreeDataProvider } from "./AlertsTreeDataProvider";
import { RecommendationsTreeDataProvider } from "./RecommendationsTreeDataProvider";
import { ConnectorsTreeDataProvider } from "./ConnectorsTreeDataProvider";
import * as vscode from 'vscode';
import { getConfigurationSettings, setConfigurationSettings } from "../configOperations";
import { SecurityCenter } from "@azure/arm-security";
import { ResourceManagementClient } from '@azure/arm-resources';
import { CommunicationServiceManagementClient } from "@azure/arm-communication";


export class SubscriptionTreeItem extends SubscriptionTreeItemBase {

    private _nextLink: string | undefined;
    private securityCenterClient: SecurityCenter;
    private resourceManagementClient:ResourceManagementClient;
    private communicationManagementClient:CommunicationServiceManagementClient;
    parent!: AzExtParentTreeItem;
    root!: ISubscriptionContext;
    filteringSettings!: FilterSettings;

    constructor(
        parent: AzExtParentTreeItem,
        root: ISubscriptionContext) {
        super(parent, root);
        this.root = root;
        this.iconPath = subscriptionIcon;
        this.securityCenterClient = new SecurityCenter(this.subscription.credentials, this.subscription.subscriptionId);
        this.resourceManagementClient=new ResourceManagementClient(this.subscription.credentials, this.subscription.subscriptionId);
        this.communicationManagementClient = new CommunicationServiceManagementClient(this.subscription.credentials, this.subscription.subscriptionId);
    }

    public readonly contextValue: string = 'azureutils.subscription';

    public hasMoreChildrenImpl(): boolean {
        return this._nextLink !== undefined;
    }

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        //set configuration filtering
        if (!getConfigurationSettings(extensionPrefix, filtering)[this.root.subscriptionId]) {
            await setConfigurationSettings(extensionPrefix, filtering, this.root.subscriptionId, new FilterSettings().getAllSettings(), vscode.ConfigurationTarget.Global);
        }
        const alerts: AlertsTreeDataProvider = new AlertsTreeDataProvider("Security Alerts", this);
        const recommendations: RecommendationsTreeDataProvider = new RecommendationsTreeDataProvider("Recommendations", this);
        const connectors: ConnectorsTreeDataProvider = new ConnectorsTreeDataProvider("Connectors", this);

        return [connectors, recommendations, alerts];
    }

}