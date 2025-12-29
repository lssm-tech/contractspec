/**
 * Versioning service types.
 *
 * Types for version analysis, version bumping, and changelog generation.
 */

import type {
  ChangelogDocBlock,
  ChangelogEntry,
  ChangeEntry,
  VersionBumpType,
} from '@contractspec/lib.contracts';
import type { ChangelogTier } from '@contractspec/lib.contracts';

// Re-export imported types for convenience
export type {
  ChangelogDocBlock,
  ChangelogEntry,
  ChangeEntry,
  VersionBumpType,
  ChangelogTier,
};

// ─────────────────────────────────────────────────────────────────────────────
// Service Options
// ─────────────────────────────────────────────────────────────────────────────

/** Options for version analysis */
export interface VersionAnalyzeOptions {
  /** Git ref to compare against (branch, tag, commit) */
  baseline?: string;
  /** Glob pattern for spec discovery */
  pattern?: string;
  /** Workspace root directory */
  workspaceRoot?: string;
  /** Include paths (glob patterns) */
  include?: string[];
  /** Exclude paths (glob patterns) */
  exclude?: string[];
}

/** Options for version bump */
export interface VersionBumpOptions {
  /** Spec file path to bump */
  specPath: string;
  /** Bump type (auto-detected if not specified) */
  bumpType?: VersionBumpType;
  /** Change description for changelog entry */
  changeDescription?: string;
  /** Additional change entries */
  changes?: ChangeEntry[];
  /** Dry run (don't write changes) */
  dryRun?: boolean;
}

/** Options for changelog generation */
export interface ChangelogGenerateOptions {
  /** Git ref to compare against */
  baseline?: string;
  /** Workspace root directory */
  workspaceRoot?: string;
  /** Changelog tiers to generate */
  tiers?: ChangelogTier[];
  /** Output format */
  format?: 'keep-a-changelog' | 'conventional' | 'custom';
  /** Custom template (for 'custom' format) */
  template?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Service Results
// ─────────────────────────────────────────────────────────────────────────────

/** Result of version analysis for a single spec */
export interface SpecVersionAnalysis {
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
  /** Whether the spec needs a version bump */
  needsBump: boolean;
}

/** Aggregated version analysis result */
export interface VersionAnalyzeResult {
  /** Individual spec analyses */
  analyses: SpecVersionAnalysis[];
  /** Total specs analyzed */
  totalSpecs: number;
  /** Specs needing version bump */
  specsNeedingBump: number;
  /** Total breaking changes across all specs */
  totalBreaking: number;
  /** Total non-breaking changes */
  totalNonBreaking: number;
  /** Git baseline used for comparison */
  baseline?: string;
}

/** Result of version bump operation */
export interface VersionBumpResult {
  /** Whether the bump was successful */
  success: boolean;
  /** Path to the updated spec file */
  specPath: string;
  /** Spec key */
  specKey: string;
  /** Previous version */
  previousVersion: string;
  /** New version */
  newVersion: string;
  /** Bump type applied */
  bumpType: VersionBumpType;
  /** Changelog entry created */
  changelogEntry: ChangelogEntry;
  /** Error message if failed */
  error?: string;
}

/** Result of changelog generation */
export interface ChangelogGenerateResult {
  /** Per-spec DocBlock entries */
  specChangelogs: ChangelogDocBlock[];
  /** Library-level markdown by package path */
  libraryMarkdown: Map<string, string>;
  /** Monorepo-level markdown */
  monorepoMarkdown: string;
  /** JSON format for programmatic use */
  json: ChangelogJsonExport;
  /** Total entries generated */
  totalEntries: number;
}

/** JSON export format for changelogs */
export interface ChangelogJsonExport {
  generatedAt: string;
  baseline?: string;
  specs: SpecChangelogJson[];
  libraries: LibraryChangelogJson[];
}

/** Spec-level changelog in JSON format */
export interface SpecChangelogJson {
  key: string;
  version: string;
  path: string;
  entries: ChangelogEntry[];
}

/** Library-level changelog in JSON format */
export interface LibraryChangelogJson {
  name: string;
  path: string;
  version: string;
  entries: ChangelogEntry[];
}
