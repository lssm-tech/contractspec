/**
 * Surface runtime metrics for resolution, patch acceptance, and policy events.
 * Integrates with @contractspec/lib.observability.
 * No PII in metric attributes.
 */

import {
	createCounter,
	createHistogram,
} from '@contractspec/lib.observability/metrics';

const METER_NAME = '@contractspec/lib.surface-runtime';

/** Resolution duration in milliseconds. */
export const resolutionDurationMs = createHistogram(
	'bundle_surface_resolution_duration_ms',
	'Time to resolve bundle spec to surface plan in milliseconds',
	METER_NAME
);

/** Patch acceptance counter (approved). Incremented when user accepts AI patch. */
export const patchAcceptanceCounter = createCounter(
	'bundle_surface_patch_acceptance_total',
	'Total AI patch proposals accepted by user',
	METER_NAME
);

/** Patch rejection counter. Incremented when user rejects AI patch. */
export const patchRejectionCounter = createCounter(
	'bundle_surface_patch_rejection_total',
	'Total AI patch proposals rejected by user',
	METER_NAME
);

/** Policy denial counter. Incremented when policy denies an action. */
export const policyDenialCounter = createCounter(
	'bundle_surface_policy_denial_total',
	'Total policy denials (actions denied by policy)',
	METER_NAME
);

/** Surface fallback counter. Incremented when resolver uses fallback surface/layout. */
export const surfaceFallbackCounter = createCounter(
	'bundle_surface_fallback_total',
	'Total surface or layout fallbacks during resolution',
	METER_NAME
);

/** Missing renderer counter. Incremented when slot has no renderer for a node. */
export const missingRendererCounter = createCounter(
	'bundle_surface_renderer_missing_total',
	'Total slots with no renderer for requested node kind',
	METER_NAME
);
