/**
 * npm pack source — reference parsing and detection utilities.
 * Pure functions, no I/O.
 */

/**
 * Parsed npm source reference.
 * Formats:
 *   npm:package-name[@version][:path]
 *   @scope/package-name[@version][:path]
 */
export interface NpmSourceRef {
  /** Full package name (e.g. "@acme/agent-rules" or "my-rules") */
  packageName: string;
  /** Requested version/tag (default: "latest") */
  version: string;
  /** Optional subpath within the package (e.g. "packs/security") */
  path: string;
}

/**
 * Parse an npm source reference string.
 */
export function parseNpmSourceRef(source: string): NpmSourceRef {
  let s = source;

  // Strip npm: prefix
  if (s.startsWith('npm:')) {
    s = s.slice(4);
  }

  // Extract subpath after colon (but not in @scope part)
  let path = '';
  const pathColonIdx = findPathColon(s);
  if (pathColonIdx > -1) {
    path = s.slice(pathColonIdx + 1);
    s = s.slice(0, pathColonIdx);
  }

  // Extract version after @, but not the scope @
  let version = 'latest';
  const versionAtIdx = findVersionAt(s);
  if (versionAtIdx > -1) {
    version = s.slice(versionAtIdx + 1);
    s = s.slice(0, versionAtIdx);
  }

  if (!s) {
    throw new Error(
      `Invalid npm source reference: "${source}". Expected package name.`
    );
  }

  return { packageName: s, version, path };
}

/**
 * Find the colon that separates the path (not the scope colon).
 * e.g. "@scope/pkg@1.0:packs/foo" → index of ":" before "packs"
 */
function findPathColon(s: string): number {
  // If scoped, skip past scope
  const startAfter = s.startsWith('@') ? s.indexOf('/') + 1 : 0;
  // Find version @ first, then look for : after it
  const vAt = findVersionAt(s);
  const searchFrom = vAt > -1 ? vAt : startAfter;
  return s.indexOf(':', searchFrom);
}

/**
 * Find the @ that separates the version (not the scope @).
 * e.g. "@scope/pkg@1.0" → index of second @
 */
function findVersionAt(s: string): number {
  if (s.startsWith('@')) {
    // Scoped package — find @ after the scope
    const slashIdx = s.indexOf('/');
    if (slashIdx === -1) return -1;
    return s.indexOf('@', slashIdx + 1);
  }
  return s.indexOf('@');
}

/**
 * Check if a pack reference is an npm source.
 */
export function isNpmPackRef(packRef: string): boolean {
  if (packRef.startsWith('npm:')) return true;
  if (packRef.startsWith('@') && packRef.includes('/')) return true;
  return false;
}

/**
 * Build a canonical source key for lockfile entries.
 */
export function npmSourceKey(parsed: NpmSourceRef): string {
  return `npm:${parsed.packageName}`;
}
