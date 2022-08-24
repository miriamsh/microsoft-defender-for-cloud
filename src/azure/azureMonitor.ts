import { ActionGroupResource, MonitorClient, SmsReceiver } from "@azure/arm-monitor";
import { ServiceClient, OperationSpec, RestError } from "@azure/ms-rest-js";
import { singleStepInputBox } from "../Commands/Inputs/SingleStepInputBox";
import { Client } from "../Utility/ClientUtils";
import { ResourceManagementClient } from '@azure/arm-resources';
import { IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { DeviceTokenCredentials } from "@azure/ms-rest-nodeauth";
import { getConfigurationSettings, setConfigurationSettings } from "../Utility/ConfigUtils";
import { Constants } from "../constants";
import { ConfigurationTarget } from "vscode";
import * as vscode from 'vscode';
import axios from "axios";
import { smsSettingsInput } from "../Commands/Inputs/SmsSettingsInputs";
import { stringify } from "querystring";
import { type } from "os";

export class Monitor {
    private _genericClient: ServiceClient;
    private _monitorClient: MonitorClient;
    private _resourceManagement: ResourceManagementClient;
    private _subscription: ISubscriptionContext;
    private _context: IActionContext;

    private readonly resourceGroupName: string;
    private readonly actionGroupName: string = 'SecurityAlertsNotification';
    private readonly groupShortName: string = "security";
    private readonly alertRuleName: string;

    private constructor(context: IActionContext, subscription: ISubscriptionContext, genericClient: ServiceClient, client: Client) {
        this._subscription = subscription;
        this._genericClient = genericClient;
        this._monitorClient = client.getMonitorClient();
        this._resourceManagement = client.getResourceManagementClient();
        this._context = context;
        this.resourceGroupName = `ResourceGroup${this.getUniqIdentity()}`;
        this.alertRuleName = `securityAlertRule${this.getUniqIdentity()}`;
    }

    //Async factory pattern
    public static async createMonitorClient(context: IActionContext, subscription: ISubscriptionContext, client: Client) {
        const tempClient = await client.getGenericClient(context);
        return new Monitor(context, subscription, tempClient, client);
    }

    //Checks (and creates if need) the required infrastructure for using Azure Monitor functionality
    async verifyRequiredInfrastructure() {
        const actionGroup = await this.verifyActionGroup();
        if (actionGroup === false) {
            return false;
        }
        const alertRule = await this.verifyAlertRule();
        if (alertRule === false) {
            return false;
        }
        return true;
    }

    //Temp for verifying action group
    async verifyActionGroup() {
        const exists = await this.checkActionGroupExistence();
        if (exists === undefined) { return false; }
        if (exists === false) {
            const actionGroup: ActionGroupResource = await this.getActionGroupParams();
            return await this.createActionGroup(actionGroup);
        }
        return true;
    }

    //Temp for verifying alert rule
    async verifyAlertRule() {
        const exist = await this.checkAlertRuleExistence();
        if (exist === undefined) { return false; }
        if (exist === false) {
            return await this.createAlertRule();
        }
        return true;
    }

    //Checks existence of an action group
    async checkActionGroupExistence() {
        try {
            const actionGroup = await this._monitorClient.actionGroups.get(this.resourceGroupName, this.actionGroupName);
            await setConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, this._subscription.subscriptionId, actionGroup.id, vscode.ConfigurationTarget.Global);
            return true;
        }
        catch (error: RestError | any) {
            if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') { return false; }
            return undefined;
        }
    }

    //Creates ActionGroup
    async createActionGroup(actionGroup: ActionGroupResource) {
        try {
            await this._resourceManagement.resourceGroups.createOrUpdate(this.resourceGroupName, { location: 'eastus' });
            const newActionGroup = await this._monitorClient.actionGroups.createOrUpdate(this.resourceGroupName, this.actionGroupName, actionGroup);
            const actionGroupSetting: SmsReceiver = {
                name: actionGroup!.smsReceivers![0].name,
                countryCode: actionGroup!.smsReceivers![0].countryCode,
                phoneNumber: actionGroup!.smsReceivers![0].phoneNumber
            };
            await setConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, this._subscription.subscriptionId, { "id": newActionGroup.id, "notificationSettings": actionGroupSetting }, ConfigurationTarget.Global);
            return true;
        }
        catch (error) {
            return false;
        }

    }

    //Checks existence of an alert rule
    async checkAlertRuleExistence() {
        try {
            const token = await this._subscription.credentials.getToken();
            const response = await axios.get(Constants.getAlertRule(this.resourceGroupName, this.alertRuleName),
                {
                    headers: {
                        'authorization': `Bearer ${token.accessToken}`
                    }
                });
            return true;
        }
        catch (error: RestError | any) {
            return false;
        }
    }

    //Creates alert rule 
    async createAlertRule() {
        try {
            const alertRuleBody = await this.getAlertRuleProperties();
            const token = await this._subscription.credentials.getToken();
            const response = await axios.put(Constants.createOrUpdateAlertRule(this.resourceGroupName, this.alertRuleName),
                alertRuleBody,
                {
                    headers: {
                        'authorization': `Bearer ${token.accessToken}`,
                        'content-type': "application/json",
                    }
                });
            return true;
        }
        catch (error) {
            return false;
        }
    }

    //Returns uniq identity for the resource group of the alert rule
    private getUniqIdentity(): string {
        const _id = this._subscription.subscriptionId + (this._subscription.credentials as DeviceTokenCredentials).clientId;
        return _id;
    }

    //Returns action group notification settings by an input
    async getActionGroupParams(name: string = '', code: string = '', phone: string = ''): Promise<ActionGroupResource> {
        let smsSettings!: SmsReceiver;
        await smsSettingsInput(this._subscription).then(response => {
            smsSettings = response;
        }).catch(console.error);

        const actionGroup: ActionGroupResource = {
            groupShortName: this.groupShortName,
            enabled: true,
            smsReceivers: [{
                name: smsSettings.name,
                countryCode: smsSettings.countryCode,
                phoneNumber: smsSettings.phoneNumber
            }],
            location: "global"
        };
        return actionGroup;
    }

    //Returns alert rule properties
    private async getAlertRuleProperties() {
        const actionGroupId = (await getConfigurationSettings(Constants.extensionPrefix, Constants.actionGroupId, this._subscription.subscriptionId)).id;
        //Verify:Is it required to get the action group id by an arm call?
        return {
            "location": "eastus",
            "properties": {
                "description": "new Security alerts notification",
                "severity": 3,
                "enabled": true,
                "evaluationFrequency": "PT1M",
                "scopes": [
                    `/subscriptions/9355a384-3349-404c-9589-1796edfdf799/resourceGroups/Today2DAY/providers/microsoft.insights/components/Today2DayFunc`
                ],
                "targetResourceTypes": [
                    "microsoft.insights/components"
                ],
                "windowSize": "PT1M",
                "criteria": {
                    "allOf": [
                        {
                            "query": `traces \n| where message startswith \"Notify ${this.resourceGroupName}\"\n`,
                            "timeAggregation": "Count",
                            "dimensions": [],
                            "operator": "GreaterThanOrEqual",
                            "threshold": 1,
                            "failingPeriods": {
                                "numberOfEvaluationPeriods": 1,
                                "minFailingPeriodsToAlert": 1
                            }
                        }
                    ]
                },
                "autoMitigate": false,
                "actions": {
                    "actionGroups": [
                        actionGroupId
                    ],
                    "customProperties": {}
                }
            }
        };
    }

    public getResourceGroup() {
        return this.resourceGroupName;
    }

}
