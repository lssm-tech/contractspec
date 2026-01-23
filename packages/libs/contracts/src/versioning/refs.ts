/**
 * Base reference types for ContractSpec versioning.
 *
 * Provides canonical reference types for linking between specs.
 * Domain-specific refs (OpRef, EventRef, etc.) should alias these
 * base types for consistency and maintainability.
 *
 * @module versioning/refs
 */

// ─────────────────────────────────────────────────────────────────────────────
// Base Reference Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base reference type for versioned specs.
 * Used to reference any spec by its key and version.
 *
 * @example
 * ```typescript
 * const opRef: VersionedSpecRef = { key: 'auth.login', version: '1.0.0' };
 * ```
 */
export interface VersionedSpecRef {
  /** Unique key identifying the spec (e.g., "auth.login", "user.created"). */
  key: string;
  /** Semantic version of the spec (e.g., "1.0.0", "2.1.0"). */
  version: string;
}

/**
 * Base reference type for specs with optional version.
 * When version is omitted, typically refers to the latest version.
 *
 * @example
 * ```typescript
 * // Reference to latest version
 * const latestRef: OptionalVersionedSpecRef = { key: 'auth.login' };
 *
 * // Reference to specific version
 * const specificRef: OptionalVersionedSpecRef = { key: 'auth.login', version: '1.0.0' };
 * ```
 */
export interface OptionalVersionedSpecRef {
  /** Unique key identifying the spec. */
  key: string;
  /** Optional semantic version. When omitted, refers to the latest version. */
  version?: string;
}

/**
 * Base reference type for unversioned spec keys.
 * Used when only the key is needed without version information.
 *
 * @example
 * ```typescript
 * const featureRef: SpecKeyRef = { key: 'premium-features' };
 * ```
 */
export interface SpecKeyRef {
  /** Unique key identifying the spec. */
  key: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks if a value is a valid VersionedSpecRef.
 *
 * @param ref - The value to check
 * @returns True if the value has both key and version as strings
 *
 * @example
 * ```typescript
 * const ref = { key: 'auth.login', version: '1.0.0' };
 * if (isVersionedSpecRef(ref)) {
 *   console.log(`Spec: ${ref.key}@${ref.version}`);
 * }
 * ```
 */
export function isVersionedSpecRef(ref: unknown): ref is VersionedSpecRef {
  return (
    typeof ref === 'object' &&
    ref !== null &&
    'key' in ref &&
    typeof (ref as VersionedSpecRef).key === 'string' &&
    (ref as VersionedSpecRef).key.length > 0 &&
    'version' in ref &&
    typeof (ref as VersionedSpecRef).version === 'string' &&
    (ref as VersionedSpecRef).version.length > 0
  );
}

/**
 * Checks if a value is a valid OptionalVersionedSpecRef.
 *
 * @param ref - The value to check
 * @returns True if the value has a key string and optional version string
 *
 * @example
 * ```typescript
 * const ref = { key: 'auth.login' };
 * if (isOptionalVersionedSpecRef(ref)) {
 *   console.log(`Spec: ${ref.key}${ref.version ? `@${ref.version}` : ''}`);
 * }
 * ```
 */
export function isOptionalVersionedSpecRef(
  ref: unknown
): ref is OptionalVersionedSpecRef {
  if (typeof ref !== 'object' || ref === null) return false;
  if (!('key' in ref)) return false;
  if (
    typeof (ref as OptionalVersionedSpecRef).key !== 'string' ||
    (ref as OptionalVersionedSpecRef).key.length === 0
  ) {
    return false;
  }
  if ('version' in ref && (ref as OptionalVersionedSpecRef).version != null) {
    return typeof (ref as OptionalVersionedSpecRef).version === 'string';
  }
  return true;
}

/**
 * Checks if a value is a valid SpecKeyRef.
 *
 * @param ref - The value to check
 * @returns True if the value has a key string
 *
 * @example
 * ```typescript
 * const ref = { key: 'premium-features' };
 * if (isSpecKeyRef(ref)) {
 *   console.log(`Feature: ${ref.key}`);
 * }
 * ```
 */
export function isSpecKeyRef(ref: unknown): ref is SpecKeyRef {
  return (
    typeof ref === 'object' &&
    ref !== null &&
    'key' in ref &&
    typeof (ref as SpecKeyRef).key === 'string' &&
    (ref as SpecKeyRef).key.length > 0
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a versioned spec reference.
 *
 * @param key - The spec key (e.g., "auth.login")
 * @param version - The semantic version (e.g., "1.0.0")
 * @returns A VersionedSpecRef object
 * @throws {Error} If key or version is empty
 *
 * @example
 * ```typescript
 * const ref = createVersionedRef('auth.login', '1.0.0');
 * // { key: 'auth.login', version: '1.0.0' }
 * ```
 */
export function createVersionedRef(
  key: string,
  version: string
): VersionedSpecRef {
  if (!key || key.trim().length === 0) {
    throw new Error('Spec key cannot be empty');
  }
  if (!version || version.trim().length === 0) {
    throw new Error('Spec version cannot be empty');
  }
  return { key: key.trim(), version: version.trim() };
}

/**
 * Creates an optional versioned spec reference.
 *
 * @param key - The spec key (e.g., "auth.login")
 * @param version - Optional semantic version
 * @returns An OptionalVersionedSpecRef object
 * @throws {Error} If key is empty
 *
 * @example
 * ```typescript
 * // Reference to latest version
 * const latestRef = createOptionalRef('auth.login');
 * // { key: 'auth.login' }
 *
 * // Reference to specific version
 * const specificRef = createOptionalRef('auth.login', '1.0.0');
 * // { key: 'auth.login', version: '1.0.0' }
 * ```
 */
export function createOptionalRef(
  key: string,
  version?: string
): OptionalVersionedSpecRef {
  if (!key || key.trim().length === 0) {
    throw new Error('Spec key cannot be empty');
  }
  const ref: OptionalVersionedSpecRef = { key: key.trim() };
  if (version != null && version.trim().length > 0) {
    ref.version = version.trim();
  }
  return ref;
}

/**
 * Creates a spec key reference.
 *
 * @param key - The spec key (e.g., "premium-features")
 * @returns A SpecKeyRef object
 * @throws {Error} If key is empty
 *
 * @example
 * ```typescript
 * const ref = createKeyRef('premium-features');
 * // { key: 'premium-features' }
 * ```
 */
export function createKeyRef(key: string): SpecKeyRef {
  if (!key || key.trim().length === 0) {
    throw new Error('Spec key cannot be empty');
  }
  return { key: key.trim() };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a versioned ref as a string key.
 *
 * @param ref - The versioned spec reference
 * @returns A string in the format "key.vversion"
 *
 * @example
 * ```typescript
 * const str = formatVersionedRefKey({ key: 'auth.login', version: '1.0.0' });
 * // "auth.login.v1.0.0"
 * ```
 */
export function formatVersionedRefKey(ref: VersionedSpecRef): string {
  return `${ref.key}.v${ref.version}`;
}

/**
 * Parses a versioned ref string back into a ref object.
 *
 * @param refKey - A string in the format "key.vversion"
 * @returns A VersionedSpecRef or undefined if parsing fails
 *
 * @example
 * ```typescript
 * const ref = parseVersionedRefKey('auth.login.v1.0.0');
 * // { key: 'auth.login', version: '1.0.0' }
 * ```
 */
export function parseVersionedRefKey(
  refKey: string
): VersionedSpecRef | undefined {
  const match = refKey.match(/^(.+)\.v(\d+\.\d+\.\d+(?:-.+)?)$/);
  if (!match) return undefined;
  const key = match[1];
  const version = match[2];
  if (!key || !version) return undefined;
  return { key, version };
}
