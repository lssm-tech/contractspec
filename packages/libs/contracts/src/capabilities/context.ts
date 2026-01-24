/**
 * Runtime capability context for opt-in capability enforcement.
 *
 * Provides a context object that can be used to check if a user/tenant
 * has access to specific capabilities at runtime.
 *
 * @module capabilities/context
 *
 * @example
 * ```typescript
 * import { createCapabilityContext } from '@contractspec/lib.contracts';
 *
 * // Create context from user's enabled capabilities
 * const ctx = createCapabilityContext([
 *   { key: 'payments', version: '1.0.0' },
 *   { key: 'analytics', version: '2.0.0' },
 * ]);
 *
 * // Check capabilities
 * if (ctx.hasCapability('payments')) {
 *   // User can access payments features
 * }
 *
 * // Require capability (throws if missing)
 * ctx.requireCapability('payments');
 * ```
 */

import type { CapabilityRef } from './capabilities';

// ─────────────────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Error thrown when a required capability is missing.
 */
export class CapabilityMissingError extends Error {
  readonly capabilityKey: string;
  readonly requiredVersion?: string;

  constructor(capabilityKey: string, requiredVersion?: string) {
    const versionSuffix = requiredVersion ? `.v${requiredVersion}` : '';
    super(`Missing required capability: ${capabilityKey}${versionSuffix}`);
    this.name = 'CapabilityMissingError';
    this.capabilityKey = capabilityKey;
    this.requiredVersion = requiredVersion;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runtime context for checking capability access.
 *
 * Created from a list of enabled capabilities (e.g., from user subscription,
 * tenant config, or feature flags). Provides methods to check and require
 * capabilities at runtime.
 */
export interface CapabilityContext {
  /** Set of enabled capability keys (without version). */
  readonly capabilities: ReadonlySet<string>;

  /** Map of capability key to version for version-specific checks. */
  readonly capabilityVersions: ReadonlyMap<string, string>;

  /**
   * Check if a capability is enabled.
   * @param key - Capability key to check
   * @param version - Optional specific version to require
   * @returns True if capability is enabled
   */
  hasCapability(key: string, version?: string): boolean;

  /**
   * Require a capability, throwing if not enabled.
   * @param key - Capability key to require
   * @param version - Optional specific version to require
   * @throws {CapabilityMissingError} If capability is not enabled
   */
  requireCapability(key: string, version?: string): void;

  /**
   * Check if all specified capabilities are enabled.
   * @param keys - Array of capability keys to check
   * @returns True if all capabilities are enabled
   */
  hasAllCapabilities(keys: string[]): boolean;

  /**
   * Check if any of the specified capabilities are enabled.
   * @param keys - Array of capability keys to check
   * @returns True if at least one capability is enabled
   */
  hasAnyCapability(keys: string[]): boolean;

  /**
   * Get enabled capabilities matching a pattern.
   * @param pattern - Glob-like pattern (supports * wildcard)
   * @returns Array of matching capability keys
   */
  getMatchingCapabilities(pattern: string): string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Implementation
// ─────────────────────────────────────────────────────────────────────────────

class CapabilityContextImpl implements CapabilityContext {
  readonly capabilities: ReadonlySet<string>;
  readonly capabilityVersions: ReadonlyMap<string, string>;

  constructor(enabledCapabilities: CapabilityRef[]) {
    const capSet = new Set<string>();
    const versionMap = new Map<string, string>();

    for (const cap of enabledCapabilities) {
      capSet.add(cap.key);
      versionMap.set(cap.key, cap.version);
    }

    this.capabilities = capSet;
    this.capabilityVersions = versionMap;
  }

  hasCapability(key: string, version?: string): boolean {
    if (!this.capabilities.has(key)) return false;
    if (version != null) {
      const enabledVersion = this.capabilityVersions.get(key);
      return enabledVersion === version;
    }
    return true;
  }

  requireCapability(key: string, version?: string): void {
    if (!this.hasCapability(key, version)) {
      throw new CapabilityMissingError(key, version);
    }
  }

  hasAllCapabilities(keys: string[]): boolean {
    return keys.every((k) => this.capabilities.has(k));
  }

  hasAnyCapability(keys: string[]): boolean {
    return keys.some((k) => this.capabilities.has(k));
  }

  getMatchingCapabilities(pattern: string): string[] {
    if (!pattern.includes('*')) {
      return this.capabilities.has(pattern) ? [pattern] : [];
    }

    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);

    return [...this.capabilities].filter((key) => regex.test(key));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a capability context from enabled capabilities.
 *
 * @param enabledCapabilities - Array of capability refs that are enabled
 * @returns CapabilityContext for checking/requiring capabilities
 *
 * @example
 * ```typescript
 * // From user subscription capabilities
 * const userCaps = await getUserCapabilities(userId);
 * const ctx = createCapabilityContext(userCaps);
 *
 * // In handler
 * ctx.requireCapability('premium-features');
 * ```
 */
export function createCapabilityContext(
  enabledCapabilities: CapabilityRef[]
): CapabilityContext {
  return new CapabilityContextImpl(enabledCapabilities);
}

/**
 * Creates an empty capability context (no capabilities enabled).
 * Useful for anonymous users or testing.
 */
export function createEmptyCapabilityContext(): CapabilityContext {
  return new CapabilityContextImpl([]);
}

/**
 * Creates a capability context with all capabilities enabled (bypass).
 * Useful for admin users or internal services.
 *
 * @param allCapabilities - Array of all capability refs to enable
 */
export function createBypassCapabilityContext(
  allCapabilities: CapabilityRef[]
): CapabilityContext {
  return new CapabilityContextImpl(allCapabilities);
}
