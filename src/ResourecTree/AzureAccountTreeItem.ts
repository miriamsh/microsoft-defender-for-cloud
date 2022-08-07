import { AzureAccountTreeItemBase, SubscriptionTreeItemBase } from '@microsoft/vscode-azext-azureutils';
import {  ISubscriptionContext } from '@microsoft/vscode-azext-utils';
import { SubscriptionTreeItem } from './SubscriptionTreeItem';
import { ext} from '../extensionVariables';
import { AzureSubscription } from '../azure-account.api';
import { createAzureSubscriptionClient } from 'vscode-azureextensionui';
import { SubscriptionOperations } from '@azure/arm-subscriptions';

export class AzureAccountTreeItem extends AzureAccountTreeItemBase {

	public createSubscriptionTreeItem(root: ISubscriptionContext): SubscriptionTreeItemBase {
   		return new SubscriptionTreeItem(this, root);
	}

}