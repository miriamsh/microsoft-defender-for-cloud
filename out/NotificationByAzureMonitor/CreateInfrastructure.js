"use strict";
//TODO:
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAlertRule = void 0;
const axios_1 = require("axios");
//Create alert rule - if not exists
//create action group with input phone
//create the send func that should call azure function
//manage the alert creating:
//give the permission to the client to create alert rules - in our backend
//temporarily:
//use my account, 
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
async function createNewAlertRule(subscription) {
    const response = await axios_1.default.get("https://today2dayfunc.azurewebsites.net/api/HttpTrigger1?code=nDhyw-27FKoetpSDlQHEHLsvrKknUQ5Lc3ZcabGU8QSxAzFuobKWig==");
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
//# sourceMappingURL=CreateInfrastructure.js.map