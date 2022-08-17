import { SecurityCenter, SecurityContact, SecurityContactsCreateOptionalParams, AlertNotifications } from "@azure/arm-security";
import * as vscode from 'vscode';
import { Constants } from "../constants";
import { getConfigurationSettings, setConfigurationSettings } from '../Utility/configUtils';
import { ResourceManagementClient, DeploymentProperties, Deployment, ResourceGroup, DeploymentOperation, DeploymentOperations } from '@azure/arm-resources';
import { CommunicationServiceCreateOrUpdateOptionalParams, CommunicationService, CommunicationServiceGetOptionalParams, CommunicationServiceManagementClient, CommunicationServiceResource } from "@azure/arm-communication";
import { RestError, URLBuilder } from "@azure/ms-rest-js";
import { PhoneNumbersClient, PurchasePhoneNumbersResult, SearchAvailablePhoneNumbersRequest } from "@azure/communication-phone-numbers";
import { ISubscriptionContext } from "vscode-azureextensionui";

export class Client{
    private resourceManagementClient: ResourceManagementClient;
    private communicationManagementClient: CommunicationServiceManagementClient;
    private securityCenterClient: SecurityCenter;
 
    constructor(subscription: ISubscriptionContext) {
        this.resourceManagementClient = new ResourceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.communicationManagementClient = new CommunicationServiceManagementClient(subscription.credentials, subscription.subscriptionId);
        this.securityCenterClient = new SecurityCenter(subscription.credentials, subscription.subscriptionId);
    }

    public getResourceManagementClient()
    {
        return this.resourceManagementClient;
    }

    public getCommunicationManagementClient()
    {
        return this.communicationManagementClient;
    }

    public getSecurityCenterClient()
    {
        return this.securityCenterClient;
    }

}