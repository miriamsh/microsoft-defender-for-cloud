import { IAzExtOutputChannel, IExperimentationServiceAdapter } from "@microsoft/vscode-azext-utils";
import { ExtensionContext } from "vscode";
import { ISubscriptionContext } from "vscode-azureextensionui";
import { AzureAccountLoginHelper } from "./login/AzureAccountLoginHelper";
import { AzureAccountTreeItem } from "./ResourecTree/AzureAccountTreeItem";

export namespace ext {
    export let context: ExtensionContext;
    export let loginHelper: AzureAccountLoginHelper;
    export let outputChannel: IAzExtOutputChannel;
    export let experimentationService: IExperimentationServiceAdapter;
    export let azureAccount: AzureAccountTreeItem;
    export let subscriptionsList:ISubscriptionContext[];
    export let prefix:string;
}