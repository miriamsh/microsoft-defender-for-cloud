"use strict";
//TODO:
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAlertRule = void 0;
async function createNewAlertRule(client, context) {
    // var msrestAzure = require('ms-rest-azure');
    //clientId:aebc6443-996d-45c2-90f0-388ff96faa56-check this
    //const response = await axios.get("https://today2dayfunc.azurewebsites.net/api/HttpTrigger1?code=nDhyw-27FKoetpSDlQHEHLsvrKknUQ5Lc3ZcabGU8QSxAzFuobKWig==");
    const a = 0;
    //https://today2dayfunc.azurewebsites.net/api/HttpTrigger1?code=nDhyw-27FKoetpSDlQHEHLsvrKknUQ5Lc3ZcabGU8QSxAzFuobKWig==
    // const client = new MonitorClient(subscription.credentials, subscription.subscriptionId);
    // const resourceManagementClient = new ResourceManagementClient(subscription.credentials, subscription.subscriptionId);
    // await resourceManagementClient.resourceGroups.createOrUpdate(resourceGroup, { location: "eastus" });
    // const newActionGroup = await client.actionGroups.createOrUpdate(resourceGroup, actionGroupName, actionGroup);
    // // const alertRuleResource: AlertRuleResource = {
    // //     namePropertiesName: ruleName,
    // //     description: "Security alert notification",
    // //     isEnabled: true,
    // //     condition: ruleCondition,
    // //     actions: [],
    // //     location: "East US"
    // // };
    // // const response = await client.alertRules.createOrUpdate(resourceGroup, ruleName, alertRuleResource);
    // // const a = 0;
    // const alertRule = await axios.put(`https://management.azure.com/subscriptions/${this.subscription.subscriptionId}/providers/Microsoft.Security/securityConnectors?api-version=2021-12-01-preview`, {
    //     headers: {
    //         'authorization': `Bearer ${token.accessToken}`
    //     }
    // }
    // );
}
exports.createNewAlertRule = createNewAlertRule;
const resourceGroup = "Today2DAY";
const ruleName = "ExecutingFunction";
const actionGroupName = "Security alert notification";
const groupShortName = "alerts";
const smsReceiverName = "Hard-coded";
const countryCode = "972";
const phoneNumber = "0532810461";
const actionGroup = {
    groupShortName: groupShortName,
    enabled: true,
    smsReceivers: [{
            name: smsReceiverName,
            countryCode: countryCode,
            phoneNumber: phoneNumber
        }],
    location: "global"
};
const dataResource = {
    odataType: "Microsoft.Azure.Management.Insights.Models.RuleMetricDataSource",
    resourceUri: "/subscriptions/9355a384-3349-404c-9589-1796edfdf799/resourcegroups/Today2DAY/providers/Microsoft.Web/sites/Today2DayFunc",
    metricNamespace: "miriam"
};
const ruleCondition = {
    odataType: "Microsoft.Azure.Management.Insights.Models.ThresholdRuleCondition",
    dataSource: dataResource,
    operator: "GreaterThanOrEqual",
    threshold: 1,
    windowSize: "PT5M",
    timeAggregation: "Total"
};
//# sourceMappingURL=CreateInfrastructure.js.map