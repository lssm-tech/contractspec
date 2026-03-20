import type { FeatureModuleSpec } from './types';

/** Minimal registry interface for validation. FeatureRegistry satisfies this. */
interface FeatureRegistryLike {
	get(key: string): FeatureModuleSpec | undefined;
}

/** Bundle requires entry (from ModuleBundleSpec.requires). */
export interface BundleRequiresEntry {
	key: string;
	version: string;
}

/** Result of validating bundle requires against a feature registry. */
export interface ValidateBundleRequiresResult {
	valid: boolean;
	errors: string[];
	missing: { key: string; version: string }[];
}

/**
 * Validates that each required feature exists in the registry and matches version (if specified).
 * Use when resolving bundles to ensure declared dependencies are satisfied.
 *
 * @param requires - Array of { key, version } from ModuleBundleSpec.requires
 * @param registry - FeatureRegistry with registered features (e.g. AiChatFeature)
 * @returns Validation result with any missing or version-mismatched features
 */
export function validateBundleRequires(
	requires: BundleRequiresEntry[],
	registry: FeatureRegistryLike
): ValidateBundleRequiresResult {
	const errors: string[] = [];
	const missing: { key: string; version: string }[] = [];

	for (const req of requires) {
		const feature = registry.get(req.key);
		if (!feature) {
			missing.push({ key: req.key, version: req.version });
			errors.push(`Required feature "${req.key}" not found in registry`);
			continue;
		}
		const regVersion = feature.meta.version;
		if (regVersion && req.version && regVersion !== req.version) {
			errors.push(
				`Feature "${req.key}" version mismatch: required ${req.version}, registered ${regVersion}`
			);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		missing,
	};
}
