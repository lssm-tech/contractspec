/**
 * Versioning types for ContractSpec changelog and version management.
 *
 * Supports three-tier changelogs:
 * - Per-spec: ChangelogDocBlock entries
 * - Per-library: Package CHANGELOG.md files
 * - Per-monorepo: Root CHANGELOG.md
 */

import type { DocBlock } from '../docs/types';

// ─────────────────────────────────────────────────────────────────────────────
// Version Types
// ─────────────────────────────────────────────────────────────────────────────

/** Version bump type based on semantic versioning */
export type VersionBumpType = 'patch' | 'minor' | 'major';

/** Semantic version components */
export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string; // e.g., "alpha.1", "beta.2", "rc.1"
  build?: string; // e.g., "build.123"
}

// ─────────────────────────────────────────────────────────────────────────────
// Change Entry Types
// ─────────────────────────────────────────────────────────────────────────────

/** Type of change for changelog entries */
export type ChangeType =
  | 'added'
  | 'changed'
  | 'fixed'
  | 'removed'
  | 'deprecated'
  | 'breaking'
  | 'security';

/** Individual change entry */
export interface ChangeEntry {
  /** Type of change */
  type: ChangeType;
  /** Human-readable description of the change */
  description: string;
  /** Schema/code path changed (e.g., "io.input.email", "meta.stability") */
  path?: string;
  /** Related issue/ticket reference (e.g., "GH-123", "JIRA-456") */
  issueRef?: string;
  /** Git commit SHA for traceability */
  commitSha?: string;
  /** Author of the change */
  author?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Changelog Entry Types
// ─────────────────────────────────────────────────────────────────────────────

/** Changelog entry for a specific version */
export interface ChangelogEntry {
  /** Version number (semver format) */
  version: string;
  /** Release date (ISO 8601 format) */
  date: string;
  /** Type of version bump that led to this version */
  bumpType: VersionBumpType;
  /** List of changes in this version */
  changes: ChangeEntry[];
  /** Breaking changes (subset for emphasis) */
  breakingChanges?: ChangeEntry[];
  /** Deprecation notices */
  deprecations?: ChangeEntry[];
  /** Contributors to this version */
  contributors?: string[];
  /** Release notes summary */
  summary?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Changelog DocBlock (Per-Spec)
// ─────────────────────────────────────────────────────────────────────────────

/** DocBlock extension for per-spec changelogs */
export interface ChangelogDocBlock extends DocBlock {
  /** Changelog-specific kind */
  kind: 'changelog';
  /** Related spec key (e.g., "auth.beginSignup") */
  specKey: string;
  /** Current spec version */
  specVersion: string;
  /** Changelog entries for this spec */
  entries: ChangelogEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Version Analysis Types
// ─────────────────────────────────────────────────────────────────────────────

/** Result of version analysis for a single spec */
export interface VersionAnalysis {
  /** Path to the spec file */
  specPath: string;
  /** Spec key (e.g., "auth.login") */
  specKey: string;
  /** Current version in the spec */
  currentVersion: string;
  /** Suggested new version based on changes */
  suggestedVersion: string;
  /** Suggested bump type */
  bumpType: VersionBumpType;
  /** Detected changes requiring version bump */
  changes: ChangeEntry[];
  /** Whether breaking changes were detected */
  hasBreaking: boolean;
}

/** Aggregated version analysis result */
export interface VersionAnalysisResult {
  /** Individual spec analyses */
  analyses: VersionAnalysis[];
  /** Total specs analyzed */
  totalSpecs: number;
  /** Specs needing version bump */
  specsNeedingBump: number;
  /** Total breaking changes across all specs */
  totalBreaking: number;
  /** Git baseline used for comparison */
  baseline?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Changelog Result Types
// ─────────────────────────────────────────────────────────────────────────────

/** Result of changelog generation */
export interface ChangelogResult {
  /** Per-spec DocBlock entries */
  specChangelogs: ChangelogDocBlock[];
  /** Library-level markdown by package path */
  libraryMarkdown: Map<string, string>;
  /** Monorepo-level markdown */
  monorepoMarkdown: string;
  /** JSON format for programmatic use */
  json: ChangelogJsonExport;
}

/** JSON export format for changelogs */
export interface ChangelogJsonExport {
  generatedAt: string;
  baseline?: string;
  specs: {
    key: string;
    version: string;
    path: string;
    entries: ChangelogEntry[];
  }[];
  libraries: {
    name: string;
    path: string;
    version: string;
    entries: ChangelogEntry[];
  }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a DocBlock is a ChangelogDocBlock */
export function isChangelogDocBlock(doc: DocBlock): doc is ChangelogDocBlock {
  return doc.kind === 'changelog' && 'specKey' in doc && 'entries' in doc;
}

/** Check if a string is a valid VersionBumpType */
export function isVersionBumpType(value: unknown): value is VersionBumpType {
  return value === 'patch' || value === 'minor' || value === 'major';
}

/** Check if a string is a valid ChangeType */
export function isChangeType(value: unknown): value is ChangeType {
  const validTypes: ChangeType[] = [
    'added',
    'changed',
    'fixed',
    'removed',
    'deprecated',
    'breaking',
    'security',
  ];
  return typeof value === 'string' && validTypes.includes(value as ChangeType);
}
