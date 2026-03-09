/**
 * Surface runtime telemetry: tracing, metrics, structured logging.
 * No PII in logs or metric attributes.
 */

export {
  resolutionDurationMs,
  patchAcceptanceCounter,
  patchRejectionCounter,
  policyDenialCounter,
  surfaceFallbackCounter,
  missingRendererCounter,
} from './surface-metrics';
