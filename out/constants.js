"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
    static getAlertListPath(subscriptionId) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/alerts?api-version=2021-01-01`;
    }
    static getAlertPath(subscriptionId, ascLocation, alertName) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/locations/${ascLocation}/alerts/${alertName}?api-version=2022-01-01`;
    }
    static getAssessmentListPath(subscriptionId) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/assessments?api-version=2020-01-01`;
    }
    static getAssessmentPath(subscriptionId, resourceId, assessmentName) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceId}/providers/Microsoft.Security/assessments/${assessmentName}?api-version=2020-01-01`;
    }
    static getConnectorListPath(subscriptionId) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/securityConnectors?api-version=2021-12-01-preview`;
    }
    static getConnectorPath(subscriptionId, resourceGroupName, securityConnectorName) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Security/securityConnectors/${securityConnectorName}?api-version=2021-12-01-preview`;
    }
    static getSubAssessmentListPath(subscriptionId, assessmentName) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/assessments/${assessmentName}/subAssessments?api-version=2019-01-01-preview`;
    }
    static getSubAssessmentPath(subscriptionId, assessmentName, subAssessmentName) {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/assessments/${assessmentName}/subAssessments/{subAssessmentName}?api-version=2019-01-01-preview`;
    }
    static initialize(context) {
        Constants.resourcesFolderPath = context.asAbsolutePath("resources");
    }
}
exports.Constants = Constants;
Constants.extensionPrefix = 'mdc';
Constants.displayName = 'microsoft defender for cloud';
Constants.filtering = 'filterSettings';
Constants.emailNotificationSettings = 'emailNotification';
Constants.smsNotificationSettings = 'smsNotification';
Constants.communicationResourceAccessKey = 'CommunicationResourceAccessKey';
Constants.actionGroupId = 'actionGroupId';
Constants.subscriptionIcon = 'azureSubscription';
Constants.assessmentIcon = 'recommendation';
Constants.subAssessmentIcon = '';
Constants.alertIcon = 'security-alerts';
Constants.connectorIcon = 'connector';
Constants.filterIcon = 'filter';
Constants.cloudConnector = 'cloudConnector';
Constants.awsConnector = 'awsCloudProvider';
Constants.gcpConnector = 'gcpCloudProvider';
Constants.recommendationOnPortal = (assessmentId) => {
    return `https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/${assessmentId}/showSecurityCenterCommandBar~/false`;
};
Constants.getConnectorsList = (subscriptionId) => {
    return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/securityConnectors?api-version=2021-12-01-preview`;
};
Constants.createOrUpdateAlertRule = (resourceGroupName, alertRuleName) => {
    return `https://management.azure.com/subscriptions/9355a384-3349-404c-9589-1796edfdf799/resourceGroups/${resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/${alertRuleName}?api-version=2021-08-01`;
};
Constants.getAlertRule = (resourceGroupName, alertRuleName) => {
    return `https://management.azure.com/subscriptions/9355a384-3349-404c-9589-1796edfdf799/resourceGroups/${resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/${alertRuleName}?api-version=2021-08-01`;
};
Constants.sendSmsByAzureFunction = (name) => {
    return `https://today2dayfunc.azurewebsites.net/api/HttpTrigger1?code=nDhyw-27FKoetpSDlQHEHLsvrKknUQ5Lc3ZcabGU8QSxAzFuobKWig==&name=${name}`;
};
//# sourceMappingURL=constants.js.map