"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitor = void 0;
const ConfigUtils_1 = require("../Utility/ConfigUtils");
const constants_1 = require("../constants");
const vscode_1 = require("vscode");
const vscode = require("vscode");
const axios_1 = require("axios");
const SmsSettingsInputs_1 = require("../Commands/Inputs/SmsSettingsInputs");
class Monitor {
    constructor(context, subscription, genericClient, client) {
        this.actionGroupName = 'SecurityAlertsNotification';
        this.groupShortName = "security";
        this._subscription = subscription;
        this._genericClient = genericClient;
        this._monitorClient = client.getMonitorClient();
        this._resourceManagement = client.getResourceManagementClient();
        this._context = context;
        this.resourceGroupName = `ResourceGroup${this.getUniqIdentity()}`;
        this.alertRuleName = `securityAlertRule${this.getUniqIdentity()}`;
    }
    //Async factory pattern
    static async createMonitorClient(context, subscription, client) {
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
        if (exists === undefined) {
            return false;
        }
        if (exists === false) {
            const actionGroup = await this.getActionGroupParams();
            return await this.createActionGroup(actionGroup);
        }
        return true;
    }
    //Temp for verifying alert rule
    async verifyAlertRule() {
        const exist = await this.checkAlertRuleExistence();
        if (exist === undefined) {
            return false;
        }
        if (exist === false) {
            return await this.createAlertRule();
        }
        return true;
    }
    //Checks existence of an action group
    async checkActionGroupExistence() {
        try {
            const actionGroup = await this._monitorClient.actionGroups.get(this.resourceGroupName, this.actionGroupName);
            await (0, ConfigUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, this._subscription.subscriptionId, actionGroup.id, vscode.ConfigurationTarget.Global);
            return true;
        }
        catch (error) {
            if (error.code === 'ResourceNotFound' || error.code === 'ResourceGroupNotFound') {
                return false;
            }
            return undefined;
        }
    }
    //Creates ActionGroup
    async createActionGroup(actionGroup) {
        try {
            await this._resourceManagement.resourceGroups.createOrUpdate(this.resourceGroupName, { location: 'eastus' });
            const newActionGroup = await this._monitorClient.actionGroups.createOrUpdate(this.resourceGroupName, this.actionGroupName, actionGroup);
            const actionGroupSetting = {
                name: actionGroup.smsReceivers[0].name,
                countryCode: actionGroup.smsReceivers[0].countryCode,
                phoneNumber: actionGroup.smsReceivers[0].phoneNumber
            };
            await (0, ConfigUtils_1.setConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, this._subscription.subscriptionId, { "id": newActionGroup.id, "notificationSettings": actionGroupSetting }, vscode_1.ConfigurationTarget.Global);
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
            const response = await axios_1.default.get(constants_1.Constants.getAlertRule(this.resourceGroupName, this.alertRuleName), {
                headers: {
                    'authorization': `Bearer ${token.accessToken}`
                }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    //Creates alert rule 
    async createAlertRule() {
        try {
            const alertRuleBody = await this.getAlertRuleProperties();
            const token = await this._subscription.credentials.getToken();
            const response = await axios_1.default.put(constants_1.Constants.createOrUpdateAlertRule(this.resourceGroupName, this.alertRuleName), alertRuleBody, {
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
    getUniqIdentity() {
        const _id = this._subscription.subscriptionId + this._subscription.credentials.clientId;
        return _id;
    }
    //Returns action group notification settings by an input
    async getActionGroupParams(name = '', code = '', phone = '') {
        let smsSettings;
        await (0, SmsSettingsInputs_1.smsSettingsInput)(this._subscription).then(response => {
            smsSettings = response;
        }).catch(console.error);
        const actionGroup = {
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
    async getAlertRuleProperties() {
        const actionGroupId = (await (0, ConfigUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.actionGroupId, this._subscription.subscriptionId)).id;
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
    getResourceGroup() {
        return this.resourceGroupName;
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=AzureMonitor.js.map