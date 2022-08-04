import { Subscription } from '@azure/arm-subscriptions';
import { TokenCredential } from '@azure/core-auth';
import { Environment } from '@azure/ms-rest-azure-env';
import type { TokenCredentialsBase } from '@azure/ms-rest-nodeauth';
import { ISubscriptionContext } from 'vscode-azureextensionui';

export interface AzureSession {
	readonly environment: Environment;
	readonly userId: string;
	readonly tenantId: string;

	/**
	 * The credentials object for azure-sdk-for-js modules https://github.com/azure/azure-sdk-for-js
	 */
	readonly credentials2: TokenCredentialsBase | TokenCredential;
}

export interface AzureSubscription {
 	readonly subscription:ISubscriptionContext;
}