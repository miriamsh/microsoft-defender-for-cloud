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
Constants.subscriptionIcon = 'azureSubscription';
Constants.assessmentIcon = 'recommendation';
Constants.subAssessmentIcon = '';
Constants.alertIcon = 'alert';
Constants.connectorIcon = 'connector';
Constants.filterIcon = 'filter';
//# sourceMappingURL=constants.js.map