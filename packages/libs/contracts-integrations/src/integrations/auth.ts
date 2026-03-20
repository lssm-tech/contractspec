/**
 * Generic authentication abstraction for integration providers.
 *
 * Each IntegrationSpec declares which auth methods it supports
 * and each IntegrationConnection stores the active auth method
 * along with any runtime state (e.g. OAuth2 tokens).
 */

export type IntegrationAuthType =
	| 'api-key'
	| 'oauth2'
	| 'bearer'
	| 'header'
	| 'basic'
	| 'webhook-signing'
	| 'service-account';

export interface ApiKeyAuthConfig {
	type: 'api-key';
	/** HTTP header name to carry the key (default: Authorization). */
	headerName?: string;
	/** Query-parameter name when using URL-based key passing. */
	queryParam?: string;
	/** Value prefix (e.g. "Bearer ", "Api-Key "). */
	prefix?: string;
}

export interface OAuth2AuthConfig {
	type: 'oauth2';
	grantType:
		| 'authorization_code'
		| 'client_credentials'
		| 'refresh_token'
		| 'device_code';
	/** Provider authorization endpoint (authorization_code flow). */
	authorizationUrl?: string;
	/** Provider token endpoint. */
	tokenUrl: string;
	/** Required OAuth scopes. */
	scopes: string[];
	/** Whether PKCE is required for the authorization_code flow. */
	pkce?: boolean;
	/** Token revocation endpoint. */
	revocationUrl?: string;
}

export interface BearerAuthConfig {
	type: 'bearer';
	/** Secret-schema field name containing the token (default: accessToken). */
	tokenField?: string;
}

export interface HeaderAuthConfig {
	type: 'header';
	/** Custom header name (e.g. X-Custom-Token). */
	headerName: string;
	/** Optional value prefix added before the secret value. */
	valuePrefix?: string;
}

export interface BasicAuthConfig {
	type: 'basic';
	/** Secret-schema field name for the username (default: username). */
	usernameField?: string;
	/** Secret-schema field name for the password (default: password). */
	passwordField?: string;
}

export interface WebhookSigningAuthConfig {
	type: 'webhook-signing';
	algorithm: 'hmac-sha256' | 'hmac-sha1' | 'ed25519';
	/** Header carrying the inbound signature. */
	signatureHeader: string;
	/** Optional timestamp header for replay-attack protection. */
	timestampHeader?: string;
	/** Max age (ms) for timestamp tolerance (default: 300000). */
	toleranceMs?: number;
}

export interface ServiceAccountAuthConfig {
	type: 'service-account';
	credentialFormat: 'json-key' | 'pem' | 'p12';
	/** Secret-schema field name containing the credential payload. */
	credentialField?: string;
}

export type IntegrationAuthConfig =
	| ApiKeyAuthConfig
	| OAuth2AuthConfig
	| BearerAuthConfig
	| HeaderAuthConfig
	| BasicAuthConfig
	| WebhookSigningAuthConfig
	| ServiceAccountAuthConfig;

/**
 * Runtime OAuth2 token state persisted alongside a connection.
 */
export interface OAuth2TokenState {
	accessToken: string;
	refreshToken?: string;
	tokenType: string;
	expiresAt?: string;
	scope?: string;
	/** Provider-specific extra fields returned alongside tokens. */
	extra?: Record<string, unknown>;
}

/**
 * Find a specific auth config from a list by type.
 */
export function findAuthConfig<T extends IntegrationAuthType>(
	methods: IntegrationAuthConfig[],
	type: T
): Extract<IntegrationAuthConfig, { type: T }> | undefined {
	return methods.find(
		(m): m is Extract<IntegrationAuthConfig, { type: T }> => m.type === type
	);
}

/**
 * Check whether a given auth type is supported.
 */
export function supportsAuthMethod(
	methods: IntegrationAuthConfig[],
	type: IntegrationAuthType
): boolean {
	return methods.some((m) => m.type === type);
}
