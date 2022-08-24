import { SecurityCenter, SecurityContact, SecurityContactsCreateOptionalParams, AlertNotifications } from "@azure/arm-security";
import * as vscode from 'vscode';
import { Constants } from "../constants";
import { getConfigurationSettings } from './ConfigUtils';
import { ResourceManagementClient, DeploymentProperties, Deployment, ResourceGroup, DeploymentOperation, DeploymentOperations } from '@azure/arm-resources';
import { CommunicationServiceCreateOrUpdateOptionalParams, CommunicationService, CommunicationServiceGetOptionalParams, CommunicationServiceManagementClient, CommunicationServiceResource } from "@azure/arm-communication";
import { RestError, ServiceClient, URLBuilder } from "@azure/ms-rest-js";
import { PhoneNumbersClient, PurchasePhoneNumbersResult, SearchAvailablePhoneNumbersRequest } from "@azure/communication-phone-numbers";
import { IActionContext, ISubscriptionContext } from "vscode-azureextensionui";
import { AzExtGenericClientInfo, createGenericClient, AzExtGenericCredentials } from "@microsoft/vscode-azext-azureutils";
import { MonitorClient } from "@azure/arm-monitor";
import { DefaultAzureCredential } from "@azure/identity";


export class Client {

    public extSubscriptionId = '9355a384-3349-404c-9589-1796edfdf799';

    public extCredentials = new DefaultAzureCredential();

    private resourceManagementClient: ResourceManagementClient;
    private communicationManagementClient: CommunicationServiceManagementClient;
    private securityCenterClient: SecurityCenter;
    private monitorClient: MonitorClient;
    private genericClient!: ServiceClient;

    private subscription: ISubscriptionContext;


    constructor(subscription: ISubscriptionContext) {
        this.subscription = subscription;
        this.resourceManagementClient = new ResourceManagementClient(this.extCredentials, this.extSubscriptionId);
        this.communicationManagementClient = new CommunicationServiceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.securityCenterClient = new SecurityCenter(subscription.credentials, subscription.subscriptionId);
        this.monitorClient = new MonitorClient( this.extCredentials, this.extSubscriptionId);
    }

    public getResourceManagementClient() {
        return this.resourceManagementClient;
    }

    public getCommunicationManagementClient() {
        return this.communicationManagementClient;
    }

    public getSecurityCenterClient() {
        return this.securityCenterClient;
    }

    public getMonitorClient() {
        return this.monitorClient;
    }

    public async getGenericClient(context: IActionContext) {
        if (this.genericClient === undefined) {
            this.genericClient = await createGenericClient(context, this.getClientInfo());
        }
        return this.genericClient;
    }

    private getClientInfo(): AzExtGenericClientInfo {
        return {
            credentials: new DefaultAzureCredential(),
            environment: this.subscription.environment
        };
    }

}