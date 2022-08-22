"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
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
Constants.alertIcon = 'alert';
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
//# sourceMappingURL=constants.js.map