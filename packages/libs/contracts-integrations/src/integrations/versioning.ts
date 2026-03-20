/**
 * API version management for integration providers.
 *
 * Allows each IntegrationSpec to declare its supported API versions,
 * deprecation lifecycle, and the mechanism used to negotiate versions
 * (header, query parameter, or URL path segment).
 */

export type ApiVersionStatus = 'stable' | 'beta' | 'deprecated' | 'sunset';

export interface ApiVersionInfo {
	/** Semantic or date-based version string (e.g. "2024-11-01", "v2"). */
	version: string;
	/** Lifecycle status of this version. */
	status: ApiVersionStatus;
	/** ISO-8601 date after which this version will no longer be served. */
	sunsetDate?: string;
	/** URL or inline markdown describing the migration path. */
	migrationGuide?: string;
	/** Release date of this version. */
	releasedAt?: string;
}

export interface IntegrationVersionPolicy {
	/** The default version used when no explicit version is requested. */
	currentVersion: string;
	/** All versions this provider supports, including deprecated ones. */
	supportedVersions: ApiVersionInfo[];
	/** HTTP header name used to request a version (e.g. "Stripe-Version"). */
	versionHeader?: string;
	/** Query parameter name used to request a version (e.g. "api_version"). */
	versionQueryParam?: string;
	/** Whether the version is embedded in the URL path (e.g. /v2/...). */
	versionInPath?: boolean;
}

/**
 * Resolve which API version to use for a request.
 *
 * Priority: explicit connection override > policy default.
 * Returns undefined when no version policy exists.
 */
export function resolveApiVersion(
	policy: IntegrationVersionPolicy | undefined,
	connectionOverride?: string
): string | undefined {
	if (!policy) return undefined;
	return connectionOverride ?? policy.currentVersion;
}

/**
 * Get info for a specific version within the policy.
 */
export function getVersionInfo(
	policy: IntegrationVersionPolicy,
	version: string
): ApiVersionInfo | undefined {
	return policy.supportedVersions.find((v) => v.version === version);
}

/**
 * Check whether a version is deprecated or sunset.
 */
export function isVersionDeprecated(
	policy: IntegrationVersionPolicy,
	version: string
): boolean {
	const info = getVersionInfo(policy, version);
	return info?.status === 'deprecated' || info?.status === 'sunset';
}

/**
 * List only stable or beta versions from a policy.
 */
export function getActiveVersions(
	policy: IntegrationVersionPolicy
): ApiVersionInfo[] {
	return policy.supportedVersions.filter(
		(v) => v.status === 'stable' || v.status === 'beta'
	);
}
