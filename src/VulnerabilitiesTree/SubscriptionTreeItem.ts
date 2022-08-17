import { SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { Constants } from '../constants';
import { FilterSettings } from "../Models/filterSettings";
import { AlertsTreeDataProvider } from "./Security Alerts/AlertsTreeDataProvider";
import { RecommendationsTreeDataProvider } from "./Recommendations/RecommendationsTreeDataProvider";
import { ConnectorsTreeDataProvider } from "./Connectors/ConnectorsTreeDataProvider";
import * as vscode from 'vscode';
import { getConfigurationSettings, setConfigurationSettings } from "../Utility/configUtils";
import { TreeUtils } from '../Utility/treeUtils';
import { Client } from "../Utility/clientUtils";
import { rootCertificates } from "tls";
import { CommunicationServices } from "../Commands/communicationServices";

export class SubscriptionTreeItem extends SubscriptionTreeItemBase {

    private _nextLink: string | undefined;
    parent!: AzExtParentTreeItem;
    filteringSettings!: FilterSettings;
    private client:Client;
    private communicationServices:CommunicationServices;


    constructor(
        parent: AzExtParentTreeItem,
        root: ISubscriptionContext) {
        super(parent, root);
        this.iconPath = TreeUtils.getIconPath(Constants.subscriptionIcon);
        this.client= new Client(root);
        this.communicationServices=new CommunicationServices(root,this.client);
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

    public getClient()
    {
        return this.client;
    }

    public getCommunicationServices()
    {
        return this.communicationServices;
    }

}