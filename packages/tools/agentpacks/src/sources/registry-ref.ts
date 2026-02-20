/**
 * Registry pack source — reference parsing and detection utilities.
 * Pure functions, no I/O.
 */

/**
 * Parsed registry source reference.
 * Format: registry:pack-name[@version]
 */
export interface RegistrySourceRef {
  /** Pack name in the registry (e.g. "typescript-best-practices") */
  packName: string;
  /** Requested version (default: "latest") */
  version: string;
}

/**
 * Parse a registry source reference string.
 * Formats:
 *   registry:pack-name
 *   registry:pack-name@1.2.0
 *   registry:pack-name@latest
 */
export function parseRegistrySourceRef(source: string): RegistrySourceRef {
  let s = source;

  // Strip registry: prefix
  if (s.startsWith('registry:')) {
    s = s.slice(9);
  }

  if (!s) {
    throw new Error(
      `Invalid registry source reference: "${source}". Expected pack name.`
    );
  }

  // Extract version after @
  let version = 'latest';
  const atIdx = s.indexOf('@');
  if (atIdx > 0) {
    version = s.slice(atIdx + 1);
    s = s.slice(0, atIdx);
  }

  if (!s) {
    throw new Error(
      `Invalid registry source reference: "${source}". Pack name is empty.`
    );
  }

  // Validate pack name format (lowercase alphanumeric + hyphens)
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(s)) {
    throw new Error(
      `Invalid registry pack name: "${s}". Must be lowercase alphanumeric with hyphens.`
    );
  }

  return { packName: s, version };
}

/**
 * Check if a pack reference is a registry source.
 */
export function isRegistryPackRef(packRef: string): boolean {
  return packRef.startsWith('registry:');
}

/**
 * Build a canonical source key for lockfile entries.
 */
export function registrySourceKey(parsed: RegistrySourceRef): string {
  return `registry:${parsed.packName}`;
}
