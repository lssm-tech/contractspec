/**
 * Conventional commits parser and utilities.
 *
 * Parses conventional commit messages to determine version bump types
 * and extract change information for changelog generation.
 *
 * Supports:
 * - Standard conventional commits (feat, fix, chore, etc.)
 * - Breaking change detection (BREAKING CHANGE: or !)
 * - Scope extraction for spec-level changes
 *
 * @module versioning/conventional-commits
 */

import type { VersionBumpType, ChangeEntry } from '@contractspec/lib.contracts';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsed conventional commit message.
 */
export interface ConventionalCommit {
  /** Commit type (feat, fix, chore, etc.) */
  type: string;
  /** Optional scope (e.g., auth, api) */
  scope?: string;
  /** Whether this is a breaking change */
  breaking: boolean;
  /** Commit description */
  description: string;
  /** Commit body (optional) */
  body?: string;
  /** Breaking change description (if any) */
  breakingDescription?: string;
  /** Full original message */
  raw: string;
}

/**
 * Commit type to bump type mapping.
 */
export type CommitTypeBumpMap = Record<string, VersionBumpType | null>;

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default mapping of commit types to version bump types.
 *
 * - `feat` → minor (new feature)
 * - `fix` → patch (bug fix)
 * - `perf` → patch (performance improvement)
 * - `refactor` → patch (code refactoring)
 * - `docs` → null (no version bump)
 * - `style` → null (no version bump)
 * - `test` → null (no version bump)
 * - `chore` → null (no version bump)
 * - `ci` → null (no version bump)
 * - `build` → null (no version bump)
 */
export const DEFAULT_COMMIT_TYPE_MAP: CommitTypeBumpMap = {
  feat: 'minor',
  fix: 'patch',
  perf: 'patch',
  refactor: 'patch',
  docs: null,
  style: null,
  test: null,
  chore: null,
  ci: null,
  build: null,
  revert: 'patch',
};

/**
 * Regex pattern for parsing conventional commit messages.
 *
 * Matches: type(scope)!: description
 * Groups:
 * 1. type
 * 2. scope (optional)
 * 3. breaking indicator (optional !)
 * 4. description
 */
const CONVENTIONAL_COMMIT_PATTERN = /^(\w+)(?:\(([^)]+)\))?(!)?\s*:\s*(.+)$/;

/**
 * Pattern for detecting BREAKING CHANGE in commit body/footer.
 */
const BREAKING_CHANGE_PATTERN = /^BREAKING[ -]CHANGE:\s*(.+)$/im;

// ─────────────────────────────────────────────────────────────────────────────
// Parser
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a conventional commit message.
 *
 * @param message - Full commit message (may include body)
 * @returns Parsed commit or null if not a valid conventional commit
 */
export function parseConventionalCommit(
  message: string
): ConventionalCommit | null {
  const lines = message.split('\n');
  const firstLine = lines[0]?.trim();

  if (!firstLine) {
    return null;
  }

  const match = firstLine.match(CONVENTIONAL_COMMIT_PATTERN);
  if (!match) {
    return null;
  }

  const [, type, scope, breakingIndicator, description] = match;

  if (!type || !description) {
    return null;
  }

  // Extract body (everything after first line)
  const body = lines.slice(1).join('\n').trim() || undefined;

  // Check for breaking change in body
  const breakingMatch = body?.match(BREAKING_CHANGE_PATTERN);
  const breakingDescription = breakingMatch?.[1];

  return {
    type: type.toLowerCase(),
    scope: scope?.toLowerCase(),
    breaking: !!breakingIndicator || !!breakingMatch,
    description: description.trim(),
    body,
    breakingDescription,
    raw: message,
  };
}

/**
 * Check if a commit message follows conventional commit format.
 */
export function isConventionalCommit(message: string): boolean {
  return parseConventionalCommit(message) !== null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bump Type Determination
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine the version bump type from a conventional commit.
 *
 * @param commit - Parsed conventional commit
 * @param typeMap - Optional custom type-to-bump mapping
 * @returns Version bump type or null if no bump needed
 */
export function getBumpTypeFromCommit(
  commit: ConventionalCommit,
  typeMap: CommitTypeBumpMap = DEFAULT_COMMIT_TYPE_MAP
): VersionBumpType | null {
  // Breaking changes always trigger major bump
  if (commit.breaking) {
    return 'major';
  }

  // Use type mapping
  return typeMap[commit.type] ?? null;
}

/**
 * Determine the highest bump type from multiple commits.
 *
 * @param commits - Array of parsed conventional commits
 * @param typeMap - Optional custom type-to-bump mapping
 * @returns Highest version bump type or null if no bump needed
 */
export function getHighestBumpType(
  commits: ConventionalCommit[],
  typeMap: CommitTypeBumpMap = DEFAULT_COMMIT_TYPE_MAP
): VersionBumpType | null {
  const bumpOrder: VersionBumpType[] = ['major', 'minor', 'patch'];

  let highest: VersionBumpType | null = null;

  for (const commit of commits) {
    const bumpType = getBumpTypeFromCommit(commit, typeMap);

    if (!bumpType) continue;

    if (!highest) {
      highest = bumpType;
      continue;
    }

    // Check if this bump is higher precedence
    const currentIndex = bumpOrder.indexOf(highest);
    const newIndex = bumpOrder.indexOf(bumpType);

    if (newIndex < currentIndex) {
      highest = bumpType;
    }
  }

  return highest;
}

// ─────────────────────────────────────────────────────────────────────────────
// Change Entry Conversion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a conventional commit to a changelog ChangeEntry.
 *
 * @param commit - Parsed conventional commit
 * @returns ChangeEntry for changelog
 */
export function commitToChangeEntry(commit: ConventionalCommit): ChangeEntry {
  if (commit.breaking) {
    return {
      type: 'breaking',
      description: commit.breakingDescription ?? commit.description,
      path: commit.scope,
    };
  }

  switch (commit.type) {
    case 'feat':
      return {
        type: 'added',
        description: commit.description,
        path: commit.scope,
      };
    case 'fix':
      return {
        type: 'fixed',
        description: commit.description,
        path: commit.scope,
      };
    case 'deprecate':
      return {
        type: 'deprecated',
        description: commit.description,
        path: commit.scope,
      };
    case 'remove':
      return {
        type: 'removed',
        description: commit.description,
        path: commit.scope,
      };
    case 'security':
      return {
        type: 'security',
        description: commit.description,
        path: commit.scope,
      };
    default:
      return {
        type: 'changed',
        description: commit.description,
        path: commit.scope,
      };
  }
}

/**
 * Convert multiple commits to an array of ChangeEntries.
 */
export function commitsToChangeEntries(
  commits: ConventionalCommit[]
): ChangeEntry[] {
  return commits.map(commitToChangeEntry);
}

// ─────────────────────────────────────────────────────────────────────────────
// Filtering
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter commits by scope (for spec-level changes).
 *
 * @param commits - Array of parsed conventional commits
 * @param scope - Scope to filter by (e.g., "auth", "api")
 * @returns Commits matching the scope
 */
export function filterCommitsByScope(
  commits: ConventionalCommit[],
  scope: string
): ConventionalCommit[] {
  return commits.filter((c) => c.scope?.toLowerCase() === scope.toLowerCase());
}

/**
 * Filter commits that trigger version bumps.
 */
export function filterBumpableCommits(
  commits: ConventionalCommit[],
  typeMap: CommitTypeBumpMap = DEFAULT_COMMIT_TYPE_MAP
): ConventionalCommit[] {
  return commits.filter((c) => getBumpTypeFromCommit(c, typeMap) !== null);
}
