/**
 * Pure-function helpers for auth operations:
 * - OAuth2 token refresh
 * - Auth header construction
 * - Webhook signature verification
 */

import { createHmac, timingSafeEqual } from 'crypto';
import type {
	ApiKeyAuthConfig,
	BasicAuthConfig,
	BearerAuthConfig,
	HeaderAuthConfig,
	IntegrationAuthConfig,
	OAuth2AuthConfig,
	OAuth2TokenState,
	WebhookSigningAuthConfig,
} from './auth';

/**
 * Refresh an OAuth2 access token using the refresh_token grant.
 *
 * @returns Updated token state with the new access (and optionally refresh) token.
 * @throws When the token endpoint returns an error response.
 */
export async function refreshOAuth2Token(
	config: OAuth2AuthConfig,
	currentState: OAuth2TokenState,
	clientCredentials: { clientId: string; clientSecret: string },
	fetchFn: typeof globalThis.fetch = globalThis.fetch
): Promise<OAuth2TokenState> {
	if (!currentState.refreshToken) {
		throw new Error('Cannot refresh: no refresh_token available.');
	}

	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: currentState.refreshToken,
		client_id: clientCredentials.clientId,
		client_secret: clientCredentials.clientSecret,
	});

	if (currentState.scope) {
		body.set('scope', currentState.scope);
	}

	const response = await fetchFn(config.tokenUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: body.toString(),
	});

	if (!response.ok) {
		const errorBody = await response.text().catch(() => '');
		throw new Error(
			`OAuth2 token refresh failed (${response.status}): ${errorBody}`
		);
	}

	const data = (await response.json()) as Record<string, unknown>;

	return {
		accessToken: String(data.access_token ?? ''),
		refreshToken:
			typeof data.refresh_token === 'string'
				? data.refresh_token
				: currentState.refreshToken,
		tokenType: String(data.token_type ?? 'Bearer'),
		expiresAt:
			typeof data.expires_in === 'number'
				? new Date(Date.now() + data.expires_in * 1000).toISOString()
				: undefined,
		scope: typeof data.scope === 'string' ? data.scope : currentState.scope,
		extra: data,
	};
}

/**
 * Build an OAuth2 authorization URL for the authorization_code flow.
 */
export function buildOAuth2AuthorizationUrl(
	config: OAuth2AuthConfig,
	params: {
		clientId: string;
		redirectUri: string;
		state: string;
		codeChallenge?: string;
		codeChallengeMethod?: string;
	}
): string {
	if (!config.authorizationUrl) {
		throw new Error('OAuth2 config missing authorizationUrl.');
	}

	const url = new URL(config.authorizationUrl);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', params.clientId);
	url.searchParams.set('redirect_uri', params.redirectUri);
	url.searchParams.set('state', params.state);

	if (config.scopes.length > 0) {
		url.searchParams.set('scope', config.scopes.join(' '));
	}

	if (params.codeChallenge) {
		url.searchParams.set('code_challenge', params.codeChallenge);
		url.searchParams.set(
			'code_challenge_method',
			params.codeChallengeMethod ?? 'S256'
		);
	}

	return url.toString();
}

/**
 * Exchange an authorization code for tokens.
 */
export async function exchangeOAuth2Code(
	config: OAuth2AuthConfig,
	params: {
		code: string;
		redirectUri: string;
		clientId: string;
		clientSecret: string;
		codeVerifier?: string;
	},
	fetchFn: typeof globalThis.fetch = globalThis.fetch
): Promise<OAuth2TokenState> {
	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code: params.code,
		redirect_uri: params.redirectUri,
		client_id: params.clientId,
		client_secret: params.clientSecret,
	});

	if (params.codeVerifier) {
		body.set('code_verifier', params.codeVerifier);
	}

	const response = await fetchFn(config.tokenUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: body.toString(),
	});

	if (!response.ok) {
		const errorBody = await response.text().catch(() => '');
		throw new Error(
			`OAuth2 code exchange failed (${response.status}): ${errorBody}`
		);
	}

	const data = (await response.json()) as Record<string, unknown>;

	return {
		accessToken: String(data.access_token ?? ''),
		refreshToken:
			typeof data.refresh_token === 'string' ? data.refresh_token : undefined,
		tokenType: String(data.token_type ?? 'Bearer'),
		expiresAt:
			typeof data.expires_in === 'number'
				? new Date(Date.now() + data.expires_in * 1000).toISOString()
				: undefined,
		scope: typeof data.scope === 'string' ? data.scope : undefined,
		extra: data,
	};
}

/**
 * Check whether an OAuth2 token state has expired (or will within bufferMs).
 */
export function isOAuth2TokenExpired(
	state: OAuth2TokenState,
	bufferMs = 60_000
): boolean {
	if (!state.expiresAt) return false;
	return new Date(state.expiresAt).getTime() - bufferMs <= Date.now();
}

/**
 * Build HTTP headers for a given auth config + resolved secrets.
 *
 * @param method  The auth config from the spec/connection
 * @param secrets Key-value secrets resolved from the secret store
 */
export function buildAuthHeaders(
	method: IntegrationAuthConfig,
	secrets: Record<string, string>
): Record<string, string> {
	switch (method.type) {
		case 'api-key':
			return buildApiKeyHeaders(method, secrets);
		case 'bearer':
			return buildBearerHeaders(method, secrets);
		case 'header':
			return buildCustomHeaders(method, secrets);
		case 'basic':
			return buildBasicHeaders(method, secrets);
		case 'oauth2':
			return buildOAuth2Headers(secrets);
		case 'service-account':
		case 'webhook-signing':
			return {};
		default: {
			const _exhaustive: never = method;
			return _exhaustive;
		}
	}
}

function buildApiKeyHeaders(
	config: ApiKeyAuthConfig,
	secrets: Record<string, string>
): Record<string, string> {
	const key = secrets.apiKey ?? secrets.api_key ?? '';
	if (!key) return {};

	const headerName = config.headerName ?? 'Authorization';
	const prefix = config.prefix ?? 'Bearer ';
	return { [headerName]: `${prefix}${key}` };
}

function buildBearerHeaders(
	config: BearerAuthConfig,
	secrets: Record<string, string>
): Record<string, string> {
	const field = config.tokenField ?? 'accessToken';
	const token = secrets[field] ?? secrets.access_token ?? '';
	if (!token) return {};
	return { Authorization: `Bearer ${token}` };
}

function buildCustomHeaders(
	config: HeaderAuthConfig,
	secrets: Record<string, string>
): Record<string, string> {
	const value = secrets[config.headerName] ?? secrets.apiKey ?? '';
	if (!value) return {};
	const prefix = config.valuePrefix ?? '';
	return { [config.headerName]: `${prefix}${value}` };
}

function buildBasicHeaders(
	config: BasicAuthConfig,
	secrets: Record<string, string>
): Record<string, string> {
	const username = secrets[config.usernameField ?? 'username'] ?? '';
	const password = secrets[config.passwordField ?? 'password'] ?? '';
	if (!username) return {};
	const encoded = Buffer.from(`${username}:${password}`).toString('base64');
	return { Authorization: `Basic ${encoded}` };
}

function buildOAuth2Headers(
	secrets: Record<string, string>
): Record<string, string> {
	const token = secrets.accessToken ?? secrets.access_token ?? '';
	if (!token) return {};
	return { Authorization: `Bearer ${token}` };
}

/**
 * Verify an inbound webhook signature (HMAC-based).
 *
 * @returns true when the computed signature matches.
 */
export function verifyWebhookSignature(
	config: WebhookSigningAuthConfig,
	secret: string,
	payload: string | Uint8Array,
	receivedSignature: string
): boolean {
	if (config.algorithm === 'ed25519') {
		throw new Error(
			'Ed25519 verification requires the `crypto.verify` API — use verifyEd25519WebhookSignature instead.'
		);
	}

	const algo = config.algorithm === 'hmac-sha256' ? 'sha256' : 'sha1';
	const computed = createHmac(algo, secret)
		.update(typeof payload === 'string' ? payload : Buffer.from(payload))
		.digest('hex');

	const sigToCompare = receivedSignature.includes('=')
		? (receivedSignature.split('=').pop() ?? receivedSignature)
		: receivedSignature;

	if (computed.length !== sigToCompare.length) return false;

	return timingSafeEqual(
		Buffer.from(computed, 'hex'),
		Buffer.from(sigToCompare, 'hex')
	);
}

/**
 * Validate an inbound webhook timestamp for replay protection.
 */
export function isWebhookTimestampValid(
	timestampHeader: string | undefined,
	toleranceMs = 300_000
): boolean {
	if (!timestampHeader) return true;

	const ts = Number(timestampHeader);
	if (Number.isNaN(ts)) return false;

	const tsMs = ts < 1e12 ? ts * 1000 : ts;
	return Math.abs(Date.now() - tsMs) <= toleranceMs;
}
