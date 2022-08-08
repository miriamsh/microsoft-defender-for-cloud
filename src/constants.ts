import * as vscode from "vscode";

export class Constants {

    public static extensionContext: vscode.ExtensionContext;

    public static extensionPrefix: string = 'mdc';
    public static displayName: string = 'microsoft defender for cloud';
    public static filtering: string = 'filterSettings';
    public static emailNotificationSettings: string = 'emailNotification';
    public static smsNotificationSettings: string = 'smsNotification';
    public static communicationResourceAccessKey: string = 'CommunicationResourceAccessKey';
 
    public static subscriptionIcon: string = 'azureSubscription';
    public static assessmentIcon: string = 'recommendation';
    public static subAssessmentIcon: string = '';
    public static alertIcon: string = 'alert';
    public static connectorIcon: string = 'connector';
    public static filterIcon:string = 'filter';

    public static resourcesFolderPath: string;

    public static initialize(context: vscode.ExtensionContext) {
        Constants.resourcesFolderPath = context.asAbsolutePath("resources");
    }
}