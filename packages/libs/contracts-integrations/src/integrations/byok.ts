/**
 * Bring-Your-Own-Key (BYOK) management types and helpers.
 *
 * Extends the basic managed/byok ownership mode with validation,
 * key rotation, and quota tracking capabilities.
 */

export interface ByokKeyValidationResult {
  /** Whether the provided key is valid and usable. */
  valid: boolean;
  /** Scopes or permissions the key has access to. */
  scopes?: string[];
  /** Remaining quota by resource name (e.g. { "requests": 950 }). */
  quotaRemaining?: Record<string, number>;
  /** ISO-8601 expiration date for the key itself. */
  expiresAt?: string;
  /** Validation error details when valid is false. */
  error?: string;
  /** Provider-returned metadata (plan, tier, etc.). */
  providerMeta?: Record<string, unknown>;
}

export interface ByokKeyRotationRequest {
  /** Connection whose key should be rotated. */
  connectionId: string;
  /** Reason for the rotation. */
  reason: 'scheduled' | 'compromised' | 'manual';
  /** New secret reference (post-rotation). */
  newSecretRef?: string;
}

export interface ByokKeyRotationResult {
  success: boolean;
  /** New secret reference after rotation. */
  newSecretRef?: string;
  /** ISO-8601 timestamp of the rotation. */
  rotatedAt?: string;
  error?: string;
}

export interface ByokKeyMetadata {
  /** When the key was first stored. */
  createdAt: string;
  /** When the key was last rotated. */
  lastRotatedAt?: string;
  /** When the key was last validated against the provider. */
  lastValidatedAt?: string;
  /** Outcome of the last validation. */
  validationStatus: 'valid' | 'invalid' | 'unknown';
  /** Provider-reported quota snapshot from the last validation. */
  quotaSnapshot?: Record<string, number>;
}

/**
 * Interface that provider implementations can adopt to support
 * BYOK key lifecycle operations.
 */
export interface ByokKeyLifecycle {
  /**
   * Validate a BYOK key against the provider and return capabilities.
   *
   * @param secrets Resolved secret key-value pairs from the store.
   */
  validateKey(
    secrets: Record<string, string>
  ): Promise<ByokKeyValidationResult>;

  /**
   * Rotate the BYOK key (optional — not every provider supports this).
   *
   * When the provider issues a new key programmatically, this method
   * should return the updated secret data; otherwise, the consumer
   * must supply a new key manually.
   */
  rotateKey?(
    secrets: Record<string, string>,
    request: ByokKeyRotationRequest
  ): Promise<ByokKeyRotationResult>;
}

/**
 * Check whether a ByokKeyMetadata indicates a stale validation.
 *
 * @param meta      The key metadata
 * @param maxAgeMs  Maximum allowed age since last validation (default: 24 h)
 */
export function isByokValidationStale(
  meta: ByokKeyMetadata,
  maxAgeMs = 86_400_000
): boolean {
  if (!meta.lastValidatedAt) return true;
  return Date.now() - new Date(meta.lastValidatedAt).getTime() > maxAgeMs;
}
