"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSettingsInput = void 0;
const ConfigUtils_1 = require("../../Utility/ConfigUtils");
const Constants_1 = require("../../Constants");
const MultiStepInputContract_1 = require("../../Models/MultiStepInputContract");
async function emailSettingsInput(context, subscription) {
    const configSettings = await (0, ConfigUtils_1.getConfigurationSettings)(Constants_1.Constants.extensionPrefix, Constants_1.Constants.emailNotificationSettings, subscription.subscriptionId);
    const settings = {
        email: configSettings?.email ? configSettings.email : '',
        phone: configSettings?.phone ? configSettings.phone : '',
        alertNotifications: configSettings?.alertNotifications ? configSettings.alertNotifications : '',
        alertsToAdmins: configSettings?.alertsToAdmins ? configSettings.alertsToAdmins : ''
    };
    const options = ['on', 'off']
        .map(label => ({ label }));
    async function collectInputs() {
        const state = {};
        await MultiStepInputContract_1.MultiStepInput.run(input => inputAdditionalEmails(input));
        return state;
    }
    const title = 'Email Notification Settings';
    async function inputAdditionalEmails(input) {
        settings.email = await input.showInputBox({
            title,
            step: 1,
            totalSteps: 4,
            placeholder: 'john@contoso.com, jane@contoso.com, e@microsoft.com',
            value: settings.email !== undefined ? settings.email : '',
            prompt: 'Enter Additional email addresse (separated by commas)',
            validate: validEmailAddresses,
            shouldResume: shouldResume
        });
        return (input) => inputPhone(input);
    }
    async function inputPhone(input) {
        settings.phone = await input.showInputBox({
            title,
            step: 2,
            totalSteps: 4,
            value: settings.phone !== undefined ? settings.phone : '',
            prompt: 'Enter a phone number (optional)',
            validate: validatePhone,
            shouldResume: shouldResume
        });
        return (input) => pickSendingAlertsNotificationOption(input);
    }
    async function pickSendingAlertsNotificationOption(input) {
        settings.alertNotifications = await input.showQuickPick({
            title,
            step: 3,
            totalSteps: 4,
            placeholder: 'Whether to send security alerts notifications to the security contact',
            items: options,
            activeItem: settings.alertNotifications === 'on' ? options[0] : settings.alertNotifications === 'off' ? options[1] : { label: '' },
            shouldResume: shouldResume
        }).then(response => { return response.label; });
        ;
        return (input) => pickAlertToAdminOption(input);
    }
    async function pickAlertToAdminOption(input) {
        settings.alertsToAdmins = await input.showQuickPick({
            title,
            step: 4,
            totalSteps: 4,
            placeholder: 'Whether to send security alerts notifications to subscription admins',
            items: options,
            activeItem: settings.alertsToAdmins !== undefined ? { label: settings.alertsToAdmins } : undefined,
            shouldResume: shouldResume
        }).then(pick => { return pick.label; });
    }
    function shouldResume() {
        // Could show a notification with the option to resume.
        return new Promise((resolve, reject) => {
            // noop
        });
    }
    async function validatePhone(phone) {
        // ...validate...
        return phone.length < 9 || phone.length > 10 ? 'Phone is invalid' : undefined;
    }
    async function validEmailAddresses(list) {
        // ...validate...
        const emailList = list.split(', ');
        const invalidEmail = emailList.find(email => {
            const index1 = email.indexOf('@');
            const index2 = email.lastIndexOf('.');
            if (!(index1 !== -1 && index2 !== -1 && index1 < index2)) {
                return email;
            }
            ;
        });
        return invalidEmail !== undefined ? `Email ${invalidEmail} is invalid` : undefined;
    }
    const settings_ = await collectInputs();
    //vscode.window.showInformationMessage(`Creating Application Service '${state.name}'`);
    return settings;
}
exports.emailSettingsInput = emailSettingsInput;
//# sourceMappingURL=EmailSettingsInputs.js.map