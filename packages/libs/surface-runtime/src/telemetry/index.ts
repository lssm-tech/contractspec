/**
 * Surface runtime telemetry: tracing, metrics, structured logging.
 * No PII in logs or metric attributes.
 */

export {
	missingRendererCounter,
	patchAcceptanceCounter,
	patchRejectionCounter,
	policyDenialCounter,
	resolutionDurationMs,
	surfaceFallbackCounter,
} from './surface-metrics';
