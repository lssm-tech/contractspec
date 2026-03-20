/**
 * Resolves authentication credentials for an integration connection.
 */

import type {
	IntegrationAuthConfig,
	IntegrationAuthType,
	OAuth2TokenState,
} from '@contractspec/lib.contracts-integrations/integrations/auth';
import { findAuthConfig } from '@contractspec/lib.contracts-integrations/integrations/auth';
import {
	buildAuthHeaders,
	isOAuth2TokenExpired,
	refreshOAuth2Token,
} from '@contractspec/lib.contracts-integrations/integrations/auth-helpers';

export interface AuthResolutionResult {
	headers: Record<string, string>;
	tokenRefreshed: boolean;
	updatedOAuth2State?: OAuth2TokenState;
}

export interface AuthResolverOptions {
	supportedAuthMethods: IntegrationAuthConfig[];
	activeAuthMethod: IntegrationAuthType;
	secrets: Record<string, string>;
	oauth2State?: OAuth2TokenState;
	fetchFn?: typeof globalThis.fetch;
}

/**
 * Resolve auth headers, refreshing OAuth2 tokens if needed.
 */
export async function resolveAuth(
	options: AuthResolverOptions
): Promise<AuthResolutionResult> {
	const authConfig = findAuthConfig(
		options.supportedAuthMethods,
		options.activeAuthMethod
	);

	if (!authConfig) {
		return { headers: {}, tokenRefreshed: false };
	}

	if (authConfig.type === 'oauth2' && options.oauth2State) {
		if (isOAuth2TokenExpired(options.oauth2State)) {
			const clientId = options.secrets.clientId ?? '';
			const clientSecret = options.secrets.clientSecret ?? '';

			try {
				const newState = await refreshOAuth2Token(
					authConfig,
					options.oauth2State,
					{ clientId, clientSecret },
					options.fetchFn
				);

				const mergedSecrets = {
					...options.secrets,
					accessToken: newState.accessToken,
				};

				return {
					headers: buildAuthHeaders(authConfig, mergedSecrets),
					tokenRefreshed: true,
					updatedOAuth2State: newState,
				};
			} catch {
				return {
					headers: buildAuthHeaders(authConfig, options.secrets),
					tokenRefreshed: false,
				};
			}
		}

		const mergedSecrets = {
			...options.secrets,
			accessToken: options.oauth2State.accessToken,
		};

		return {
			headers: buildAuthHeaders(authConfig, mergedSecrets),
			tokenRefreshed: false,
		};
	}

	return {
		headers: buildAuthHeaders(authConfig, options.secrets),
		tokenRefreshed: false,
	};
}
