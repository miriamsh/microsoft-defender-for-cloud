"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsSettingsInput = void 0;
const ConfigUtils_1 = require("../../Utility/ConfigUtils");
const constants_1 = require("../../constants");
const multiStepInputContract_1 = require("../../Models/multiStepInputContract");
async function smsSettingsInput(subscription) {
    const configSettings = (await (0, ConfigUtils_1.getConfigurationSettings)(constants_1.Constants.extensionPrefix, constants_1.Constants.smsNotificationSettings, subscription.subscriptionId));
    const settings = {
        name: configSettings?.notificationSettings?.name ? configSettings.notificationSettings.name : '',
        countryCode: configSettings?.notificationSettings?.code ? configSettings.notificationSettings.code : '',
        phoneNumber: configSettings?.notificationSettings?.phone ? configSettings.notificationSettings.phone : ''
    };
    const options = ['on', 'off']
        .map(label => ({ label }));
    async function collectInputs() {
        const state = {};
        await multiStepInputContract_1.MultiStepInput.run(input => inputName(input));
        return state;
    }
    const title = 'Email Notification Settings';
    async function inputName(input) {
        settings.name = await input.showInputBox({
            title,
            step: 1,
            totalSteps: 3,
            value: settings.name !== undefined ? settings.name : '',
            prompt: 'Enter SMS name receiver',
            validate: validTemp,
            shouldResume: shouldResume
        });
        return (input) => inputCode(input);
    }
    async function inputCode(input) {
        settings.countryCode = await input.showInputBox({
            title,
            step: 2,
            totalSteps: 3,
            value: settings.countryCode !== undefined ? settings.countryCode : '',
            prompt: 'Enter a country code',
            validate: validTemp,
            shouldResume: shouldResume
        });
        return (input) => inputPhone(input);
    }
    async function inputPhone(input) {
        settings.phoneNumber = await input.showInputBox({
            title,
            step: 3,
            totalSteps: 3,
            value: settings.phoneNumber !== undefined ? settings.phoneNumber : '',
            prompt: 'Enter a phone number',
            validate: validatePhone,
            shouldResume: shouldResume
        });
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
    //TODO: fix the validation for each email address: includes . after @
    async function validTemp(name) {
        // ...validate...
        return undefined;
    }
    const settings_ = await collectInputs();
    //vscode.window.showInformationMessage(`Creating Application Service '${state.name}'`);
    return settings;
}
exports.smsSettingsInput = smsSettingsInput;
//# sourceMappingURL=SmsSettingsInput.js.map