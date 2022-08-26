import * as vscode from 'vscode';
import { getConfigurationSettings } from '../../Utility/ConfigUtils';
import { Constants } from '../../Constants';
import { ISubscriptionContext } from 'vscode-azureextensionui';
import { KnownAlertNotifications, SecurityCenter, SecurityContact, SecurityContacts } from '@azure/arm-security';
import { resolvePtr } from 'dns';
import { MultiStepInput } from '../../Models/MultiStepInputContract';
import { SmsReceiver } from '@azure/arm-monitor';

export async function smsSettingsInput(subscription: ISubscriptionContext): Promise<SmsReceiver> {

    const configSettings = (await getConfigurationSettings(Constants.extensionPrefix, Constants.smsNotificationSettings, subscription.subscriptionId));

    const settings:SmsReceiver= {
        name: configSettings?.notificationSettings?.name ? configSettings.notificationSettings.name : '',
        countryCode: configSettings?.notificationSettings?.code ? configSettings.notificationSettings.code : '',
        phoneNumber: configSettings?.notificationSettings?.phone ? configSettings.notificationSettings.phone : ''
    };

    const options: vscode.QuickPickItem[] = ['on', 'off']
        .map(label => ({ label }));


    interface State {
        title: string;
        step: number;
        totalSteps: number;
        resourceGroup: vscode.QuickPickItem | string;
        name: string;
        runtime: vscode.QuickPickItem;
    }

    async function collectInputs() {
        const state = {} as Partial<State>;
        await MultiStepInput.run(input => inputName(input));
        return state as State;
    }

    const title = 'Email Notification Settings';

    async function inputName(input: MultiStepInput) {
        settings.name = await input.showInputBox({
            title,
            step: 1,
            totalSteps: 3,
            value: settings.name !== undefined ? settings.name : '',
            prompt: 'Enter SMS name receiver',
            validate: validTemp,
            shouldResume: shouldResume
        });

        return (input: MultiStepInput) => inputCode(input);
    }

    async function inputCode(input: MultiStepInput) {
        settings.countryCode = await input.showInputBox({
            title,
            step: 2,
            totalSteps: 3,
            value: settings.countryCode !== undefined ? settings.countryCode : '',
            prompt: 'Enter a country code',
            validate: validTemp,
            shouldResume: shouldResume
        });
        return (input: MultiStepInput) => inputPhone(input);
    }

    async function inputPhone(input: MultiStepInput) {
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
        return new Promise<boolean>((resolve, reject) => {
            // noop
        });
    }

    async function validatePhone(phone: string) {
        // ...validate...
        return phone.length < 9 || phone.length > 10 ? 'Phone is invalid' : undefined;
    }

    //TODO: fix the validation for each email address: includes . after @
    async function validTemp(name: string) {
        // ...validate...
        return undefined;
    }

    const settings_ = await collectInputs();
    //vscode.window.showInformationMessage(`Creating Application Service '${state.name}'`);
    return settings;
}