import { SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from '../constants';
import { FilterSettings } from "../Models/filterSettings";
import { AlertsTreeDataProvider } from "./Security Alerts/AlertTreeDataProvider";
import { RecommendationsTreeDataProvider } from "./Recommendations/RecommendationsTreeDataProvider";
import { ConnectorsTreeDataProvider } from "./Connectors/ConnectorsTreeDataProvider";
import * as vscode from 'vscode';
import { getConfigurationSettings, setConfigurationSettings } from "../Utility/configUtils";
import { TreeUtils } from '../Utility/treeUtils';
import { Client } from "../Utility/clientUtils";
import { CommunicationServices } from "../azure/communicationServices";
import { Monitor } from "../azure/azureMonitor";

export class SubscriptionTreeItem extends SubscriptionTreeItemBase {

    private _client: Client;
    private _communicationServices : CommunicationServices;
    private _monitorServices!: Monitor;

    constructor(
        parent: AzExtParentTreeItem,
        root: ISubscriptionContext) {
        super(parent, root);
        this.root = root;
        this.iconPath = TreeUtils.getIconPath(Constants.subscriptionIcon);
        this._client = new Client(root);
        this._communicationServices = new CommunicationServices(root, this._client);
    }

    public readonly contextValue: string = 'azureutils.subscription';

    public get client() : Client {
        return this._client;
    }
 
    public get communicationServices() : CommunicationServices {
        return this._communicationServices;
    }

    public async getMonitor(context: IActionContext) {
        if (this._monitorServices === undefined) {
            this._monitorServices = await Monitor.createMonitorClient(context, this.root, this.client);
        }
        return this._monitorServices;
    }

    public hasMoreChildrenImpl(): boolean {

        return false;
    }

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        const filterSettingsTemp = await getConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId);
        if (filterSettingsTemp === undefined) {
            await setConfigurationSettings(Constants.extensionPrefix, Constants.filtering, this.subscription.subscriptionId, new FilterSettings().settings, vscode.ConfigurationTarget.Global);
        }

        const alerts: AlertsTreeDataProvider = new AlertsTreeDataProvider("Security Alerts", this);
        const recommendations: RecommendationsTreeDataProvider = new RecommendationsTreeDataProvider("Recommendations", this);
        const connectors: ConnectorsTreeDataProvider = new ConnectorsTreeDataProvider("Connectors", this);
        return [connectors, recommendations, alerts];
    }

}