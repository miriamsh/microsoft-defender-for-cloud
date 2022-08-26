import * as vscode from 'vscode';
import { getConfigurationSettings } from '../../Utility/ConfigUtils';
import { Constants } from '../../Constants';
import { ISubscriptionContext } from 'vscode-azureextensionui';
import { KnownAlertNotifications, SecurityCenter, SecurityContact, SecurityContacts } from '@azure/arm-security';
import { resolvePtr } from 'dns';
import { MultiStepInput } from '../../Models/MultiStepInputContract';

export async function emailSettingsInput(context: vscode.ExtensionContext, subscription: ISubscriptionContext): Promise<SecurityContact> {

    const configSettings = await getConfigurationSettings(Constants.extensionPrefix, Constants.emailNotificationSettings, subscription.subscriptionId);

    const settings: SecurityContact = {
        email: configSettings?.email ? configSettings.email : '',
        phone: configSettings?.phone ? configSettings.phone : '',
        alertNotifications: configSettings?.alertNotifications ? configSettings.alertNotifications : '',
        alertsToAdmins: configSettings?.alertsToAdmins ? configSettings.alertsToAdmins : ''
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
        await MultiStepInput.run(input => inputAdditionalEmails(input));
        return state as State;
    }

    const title = 'Email Notification Settings';

    async function inputAdditionalEmails(input: MultiStepInput) {
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

        return (input: MultiStepInput) => inputPhone(input);
    }

    async function inputPhone(input: MultiStepInput) {
        settings.phone = await input.showInputBox({
            title,
            step: 2,
            totalSteps: 4,
            value: settings.phone !== undefined ? settings.phone : '',
            prompt: 'Enter a phone number (optional)',
            validate: validatePhone,
            shouldResume: shouldResume
        });
        return (input: MultiStepInput) => pickSendingAlertsNotificationOption(input);
    }

    async function pickSendingAlertsNotificationOption(input: MultiStepInput) {
        settings.alertNotifications = await input.showQuickPick({
            title,
            step: 3,
            totalSteps: 4,
            placeholder: 'Whether to send security alerts notifications to the security contact',
            items: options,
            activeItem: settings.alertNotifications === 'on' ? options[0] : settings.alertNotifications === 'off' ? options[1] : { label: '' },
            shouldResume: shouldResume
        }).then(response => { return response.label; });;

        return (input: MultiStepInput) => pickAlertToAdminOption(input);

    }

    async function pickAlertToAdminOption(input: MultiStepInput) {
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
        return new Promise<boolean>((resolve, reject) => {
            // noop
        });
    }

    async function validatePhone(phone: string) {
        // ...validate...
        return phone.length < 9 || phone.length > 10 ? 'Phone is invalid' : undefined;
    }

    async function validEmailAddresses(list: string) {
        // ...validate...
        const emailList = list.split(', ');
        const invalidEmail = emailList.find(email => {
            const index1 = email.indexOf('@');
            const index2 = email.lastIndexOf('.');
            if (!(index1 !== -1 && index2 !== -1 && index1 < index2)){return email;};
        });
        return invalidEmail!==undefined? `Email ${invalidEmail} is invalid`:undefined;
    }

    const settings_ = await collectInputs();
    //vscode.window.showInformationMessage(`Creating Application Service '${state.name}'`);
    return settings;
}