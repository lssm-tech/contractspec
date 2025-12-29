/**
 * Semantic version parsing, comparison, and manipulation utilities.
 */

import type { SemanticVersion, VersionBumpType } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Version Parsing
// ─────────────────────────────────────────────────────────────────────────────

/** Regex for parsing semantic versions */
const SEMVER_REGEX =
  /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*))?(?:\+([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*))?$/;

/**
 * Parse a semantic version string into components.
 *
 * @param version - Version string (e.g., "1.2.3", "1.0.0-alpha.1")
 * @returns Parsed SemanticVersion or null if invalid
 *
 * @example
 * parseVersion("1.2.3") // { major: 1, minor: 2, patch: 3 }
 * parseVersion("2.0.0-beta.1") // { major: 2, minor: 0, patch: 0, prerelease: "beta.1" }
 */
export function parseVersion(version: string): SemanticVersion | null {
  const match = version.trim().match(SEMVER_REGEX);
  if (!match) {
    return null;
  }

  const majorStr = match[1];
  const minorStr = match[2];
  const patchStr = match[3];
  const prerelease = match[4];
  const build = match[5];

  // Type guard: these are guaranteed by the regex, but TypeScript doesn't know
  if (!majorStr || !minorStr || !patchStr) {
    return null;
  }

  return {
    major: parseInt(majorStr, 10),
    minor: parseInt(minorStr, 10),
    patch: parseInt(patchStr, 10),
    ...(prerelease && { prerelease }),
    ...(build && { build }),
  };
}

/**
 * Strictly parse a version, throwing on invalid input.
 *
 * @throws Error if version is not valid semver
 */
export function parseVersionStrict(version: string): SemanticVersion {
  const parsed = parseVersion(version);
  if (!parsed) {
    throw new Error(`Invalid semantic version: "${version}"`);
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Version Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a SemanticVersion back to string.
 *
 * @example
 * formatVersion({ major: 1, minor: 2, patch: 3 }) // "1.2.3"
 * formatVersion({ major: 2, minor: 0, patch: 0, prerelease: "beta.1" }) // "2.0.0-beta.1"
 */
export function formatVersion(version: SemanticVersion): string {
  let result = `${version.major}.${version.minor}.${version.patch}`;

  if (version.prerelease) {
    result += `-${version.prerelease}`;
  }

  if (version.build) {
    result += `+${version.build}`;
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Version Comparison
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare two version strings.
 *
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 *
 * @example
 * compareVersions("1.0.0", "2.0.0") // -1
 * compareVersions("1.2.3", "1.2.3") // 0
 * compareVersions("2.0.0", "1.9.9") // 1
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const versionA = parseVersionStrict(a);
  const versionB = parseVersionStrict(b);

  // Compare major
  if (versionA.major !== versionB.major) {
    return versionA.major > versionB.major ? 1 : -1;
  }

  // Compare minor
  if (versionA.minor !== versionB.minor) {
    return versionA.minor > versionB.minor ? 1 : -1;
  }

  // Compare patch
  if (versionA.patch !== versionB.patch) {
    return versionA.patch > versionB.patch ? 1 : -1;
  }

  // Compare prerelease (no prerelease > prerelease)
  if (versionA.prerelease && !versionB.prerelease) {
    return -1;
  }
  if (!versionA.prerelease && versionB.prerelease) {
    return 1;
  }
  if (versionA.prerelease && versionB.prerelease) {
    return versionA.prerelease < versionB.prerelease
      ? -1
      : versionA.prerelease > versionB.prerelease
        ? 1
        : 0;
  }

  return 0;
}

/**
 * Check if version a is greater than version b.
 */
export function isVersionGreater(a: string, b: string): boolean {
  return compareVersions(a, b) === 1;
}

/**
 * Check if version a is less than version b.
 */
export function isVersionLess(a: string, b: string): boolean {
  return compareVersions(a, b) === -1;
}

/**
 * Check if two versions are equal.
 */
export function isVersionEqual(a: string, b: string): boolean {
  return compareVersions(a, b) === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Version Bumping
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bump a version by the specified type.
 *
 * @param current - Current version string
 * @param bumpType - Type of bump: 'patch', 'minor', or 'major'
 * @returns New version string
 *
 * @example
 * bumpVersion("1.2.3", "patch") // "1.2.4"
 * bumpVersion("1.2.3", "minor") // "1.3.0"
 * bumpVersion("1.2.3", "major") // "2.0.0"
 */
export function bumpVersion(
  current: string,
  bumpType: VersionBumpType
): string {
  const version = parseVersionStrict(current);

  switch (bumpType) {
    case 'major':
      return formatVersion({
        major: version.major + 1,
        minor: 0,
        patch: 0,
      });

    case 'minor':
      return formatVersion({
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
      });

    case 'patch':
      return formatVersion({
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
      });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bump Type Determination
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine the appropriate version bump type based on change impact.
 *
 * - Breaking changes → major
 * - Non-breaking additions/changes → minor
 * - Fixes only → patch
 *
 * @param hasBreaking - Whether breaking changes were detected
 * @param hasNonBreaking - Whether non-breaking changes (additions, changes) were detected
 * @returns Appropriate bump type
 */
export function determineBumpType(
  hasBreaking: boolean,
  hasNonBreaking: boolean
): VersionBumpType {
  if (hasBreaking) {
    return 'major';
  }
  if (hasNonBreaking) {
    return 'minor';
  }
  return 'patch';
}

/**
 * Get sort priority for bump types (higher = more significant).
 */
export function getBumpTypePriority(bumpType: VersionBumpType): number {
  switch (bumpType) {
    case 'major':
      return 3;
    case 'minor':
      return 2;
    case 'patch':
      return 1;
  }
}

/**
 * Get the most significant bump type from a list.
 */
export function getMaxBumpType(
  bumpTypes: VersionBumpType[]
): VersionBumpType | null {
  if (bumpTypes.length === 0) {
    return null;
  }

  return bumpTypes.reduce((max, current) =>
    getBumpTypePriority(current) > getBumpTypePriority(max) ? current : max
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a string is a valid semantic version.
 */
export function isValidVersion(version: string): boolean {
  return parseVersion(version) !== null;
}

/**
 * Validate a version string, returning validation errors.
 */
export function validateVersion(version: string): string[] {
  const errors: string[] = [];

  if (!version || typeof version !== 'string') {
    errors.push('Version must be a non-empty string');
    return errors;
  }

  const trimmed = version.trim();

  if (trimmed !== version) {
    errors.push('Version should not have leading or trailing whitespace');
  }

  if (!parseVersion(trimmed)) {
    errors.push(
      `Invalid semantic version format: "${version}". Expected format: MAJOR.MINOR.PATCH[-prerelease][+build]`
    );
  }

  return errors;
}
