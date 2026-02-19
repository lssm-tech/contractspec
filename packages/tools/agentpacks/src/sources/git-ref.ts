/**
 * Git source reference types and pure parsing utilities.
 * No I/O or network calls — pure functions only.
 */

/**
 * Parsed git source reference.
 * Format: owner/repo, owner/repo@ref, owner/repo@ref:path
 * Or: github:owner/repo[@ref][:path]
 */
export interface GitSourceRef {
  owner: string;
  repo: string;
  ref: string;
  path: string;
}

/**
 * Parse a git source reference string.
 */
export function parseGitSourceRef(source: string): GitSourceRef {
  let s = source;

  // Strip github: prefix
  if (s.startsWith('github:')) {
    s = s.slice(7);
  }

  // Split path after colon (but not in owner/repo)
  let path = '';
  const atIdx = s.indexOf('@');
  const colonIdx = s.indexOf(':', atIdx > -1 ? atIdx : 0);
  if (colonIdx > -1) {
    path = s.slice(colonIdx + 1);
    s = s.slice(0, colonIdx);
  }

  // Split ref after @
  let ref = 'main';
  if (atIdx > -1) {
    ref = s.slice(atIdx + 1);
    s = s.slice(0, atIdx);
  }

  // Split owner/repo
  const parts = s.split('/');
  if (parts.length < 2) {
    throw new Error(
      `Invalid git source reference: "${source}". Expected owner/repo format.`
    );
  }

  return {
    owner: parts[0]!,
    repo: parts[1]!,
    ref,
    path: path || '',
  };
}

/**
 * Check if a pack reference is a git source.
 */
export function isGitPackRef(packRef: string): boolean {
  if (packRef.startsWith('github:')) return true;
  if (
    packRef.startsWith('./') ||
    packRef.startsWith('../') ||
    packRef.startsWith('/')
  ) {
    return false;
  }
  if (packRef.startsWith('@') || packRef.startsWith('npm:')) return false;
  // owner/repo pattern
  const parts = packRef.split('/');
  return parts.length === 2 && !packRef.includes('node_modules');
}

/**
 * Build a canonical source key for lockfile entries.
 */
export function gitSourceKey(parsed: GitSourceRef): string {
  return `${parsed.owner}/${parsed.repo}`;
}
