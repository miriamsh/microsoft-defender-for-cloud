import * as vscode from "vscode";

export class Constants {

    public static extensionContext: vscode.ExtensionContext;

    public static extensionPrefix: string = 'mdc';
    public static displayName: string = 'microsoft defender for cloud';

    public static filtering: string = 'filterSettings';
    public static emailNotificationSettings: string = 'emailNotification';
    public static smsNotificationSettings: string = 'smsNotification';
    public static communicationResourceAccessKey: string = 'CommunicationResourceAccessKey';
    public static actionGroupId: string = 'actionGroupId';

    public static subscriptionIcon: string = 'azureSubscription';
    public static assessmentIcon: string = 'recommendation';
    public static subAssessmentIcon: string = '';
    public static alertIcon: string = 'alert';
    public static connectorIcon: string = 'connector';
    public static filterIcon: string = 'filter';

    public static cloudConnector: string = 'cloudConnector';
    public static awsConnector: string = 'awsCloudProvider';
    public static gcpConnector: string = 'gcpCloudProvider';

    public static recommendationOnPortal = (assessmentId: string): string => {
        return `https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/${assessmentId}/showSecurityCenterCommandBar~/false`;
    };

    public static getConnectorsList = (subscriptionId: string): string => {
        return `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Security/securityConnectors?api-version=2021-12-01-preview`;
    };

    public static createOrUpdateAlertRule = (resourceGroupName: string, alertRuleName: string): string => {
        return `https://management.azure.com/subscriptions/9355a384-3349-404c-9589-1796edfdf799/resourceGroups/${resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/${alertRuleName}?api-version=2021-08-01`;
    };

    public static getAlertRule = (resourceGroupName: string, alertRuleName: string): string => {
        return `https://management.azure.com/subscriptions/9355a384-3349-404c-9589-1796edfdf799/resourceGroups/${resourceGroupName}/providers/Microsoft.Insights/scheduledQueryRules/${alertRuleName}?api-version=2021-08-01`;
    };



    public static resourcesFolderPath: string;

    public static initialize(context: vscode.ExtensionContext) {
        Constants.resourcesFolderPath = context.asAbsolutePath("resources");
    }
}