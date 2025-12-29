/**
 * Versioning service.
 *
 * Provides version analysis, version bumping, and changelog generation
 * for ContractSpec specs.
 */

import {
  bumpVersion,
  determineBumpType,
  type ChangeEntry,
  type ChangelogEntry,
  type ChangelogDocBlock,
} from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../ports/fs';
import type { GitAdapter } from '../../ports/git';
import type { LoggerAdapter } from '../../ports/logger';
import type {
  VersionAnalyzeOptions,
  VersionAnalyzeResult,
  VersionBumpOptions,
  VersionBumpResult,
  ChangelogGenerateOptions,
  ChangelogGenerateResult,
  SpecVersionAnalysis,
} from './types';
import {
  formatKeepAChangelog,
  formatChangelogJson,
} from './changelog-formatter';

// ─────────────────────────────────────────────────────────────────────────────
// Adapters Type
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceAdapters {
  fs: FsAdapter;
  git: GitAdapter;
  logger: LoggerAdapter;
}

// ─────────────────────────────────────────────────────────────────────────────
// Version Analysis
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze specs and suggest version bumps based on changes.
 *
 * Compares the current state against a baseline (git ref) and determines
 * which specs need version bumps based on detected changes.
 */
export async function analyzeVersions(
  adapters: ServiceAdapters,
  options: VersionAnalyzeOptions = {}
): Promise<VersionAnalyzeResult> {
  const { fs, git, logger } = adapters;
  const workspaceRoot = options.workspaceRoot ?? process.cwd();

  logger.info('Starting version analysis...', { baseline: options.baseline });

  // Discover spec files
  const pattern = options.pattern ?? '**/*.{operation,event,presentation}.ts';
  const files = await fs.glob({ pattern, cwd: workspaceRoot });

  const specFiles = files.filter(
    (f) =>
      !f.includes('.test.') &&
      !f.includes('.spec.') &&
      !f.includes('node_modules')
  );

  logger.debug(`Found ${specFiles.length} spec files`);

  const analyses: SpecVersionAnalysis[] = [];
  let totalBreaking = 0;
  let totalNonBreaking = 0;

  for (const specPath of specFiles) {
    try {
      // Read current spec
      const currentContent = await fs.readFile(specPath);
      const currentMeta = extractSpecMeta(currentContent);

      if (!currentMeta) {
        continue; // Skip files that don't have valid spec meta
      }

      // Get baseline content if baseline specified
      let baselineContent: string | null = null;
      if (options.baseline) {
        try {
          baselineContent = await git.showFile(options.baseline, specPath);
        } catch {
          // File doesn't exist in baseline (new file)
          baselineContent = null;
        }
      }

      // Analyze changes
      const changes = analyzeSpecChanges(currentContent, baselineContent);
      const hasBreaking = changes.some((c) => c.type === 'breaking');
      const hasNonBreaking = changes.length > 0 && !hasBreaking;
      const needsBump = changes.length > 0;

      if (hasBreaking) totalBreaking++;
      if (hasNonBreaking) totalNonBreaking++;

      const bumpType = determineBumpType(hasBreaking, hasNonBreaking);
      const suggestedVersion = needsBump
        ? bumpVersion(currentMeta.version, bumpType)
        : currentMeta.version;

      analyses.push({
        specPath,
        specKey: currentMeta.key,
        currentVersion: currentMeta.version,
        suggestedVersion,
        bumpType,
        changes,
        hasBreaking,
        needsBump,
      });
    } catch (error) {
      logger.warn(`Failed to analyze ${specPath}:`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const specsNeedingBump = analyses.filter((a) => a.needsBump).length;

  logger.info('Version analysis complete', {
    totalSpecs: analyses.length,
    specsNeedingBump,
    totalBreaking,
    totalNonBreaking,
  });

  return {
    analyses,
    totalSpecs: analyses.length,
    specsNeedingBump,
    totalBreaking,
    totalNonBreaking,
    baseline: options.baseline,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Version Bump
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apply a version bump to a spec file.
 *
 * Updates the version in the spec file and creates a changelog entry.
 */
export async function applyVersionBump(
  adapters: ServiceAdapters,
  options: VersionBumpOptions
): Promise<VersionBumpResult> {
  const { fs, logger } = adapters;
  const { specPath, dryRun = false } = options;

  logger.info('Applying version bump...', {
    specPath,
    bumpType: options.bumpType,
  });

  try {
    // Read current spec
    const content = await fs.readFile(specPath);
    const meta = extractSpecMeta(content);

    if (!meta) {
      return {
        success: false,
        specPath,
        specKey: 'unknown',
        previousVersion: 'unknown',
        newVersion: 'unknown',
        bumpType: 'patch',
        changelogEntry: createEmptyChangelogEntry(),
        error: 'Could not extract spec metadata',
      };
    }

    // Determine bump type
    const bumpType = options.bumpType ?? 'patch';
    const newVersion = bumpVersion(meta.version, bumpType);

    // Create changelog entry
    const changes: ChangeEntry[] = options.changes ?? [];
    if (options.changeDescription) {
      changes.push({
        type: bumpType === 'major' ? 'breaking' : 'changed',
        description: options.changeDescription,
      });
    }

    const changelogEntry: ChangelogEntry = {
      version: newVersion,
      date: new Date().toISOString().split('T')[0] ?? '',
      bumpType,
      changes,
      breakingChanges: changes.filter((c) => c.type === 'breaking'),
    };

    // Update the spec file
    if (!dryRun) {
      const updatedContent = updateSpecVersion(
        content,
        meta.version,
        newVersion
      );
      await fs.writeFile(specPath, updatedContent);
    }

    logger.info('Version bump applied', {
      specPath,
      previousVersion: meta.version,
      newVersion,
    });

    return {
      success: true,
      specPath,
      specKey: meta.key,
      previousVersion: meta.version,
      newVersion,
      bumpType,
      changelogEntry,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Version bump failed', { specPath, error: errorMessage });

    return {
      success: false,
      specPath,
      specKey: 'unknown',
      previousVersion: 'unknown',
      newVersion: 'unknown',
      bumpType: options.bumpType ?? 'patch',
      changelogEntry: createEmptyChangelogEntry(),
      error: errorMessage,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Changelog Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate changelogs at all configured tiers.
 */
export async function generateChangelogs(
  adapters: ServiceAdapters,
  options: ChangelogGenerateOptions = {}
): Promise<ChangelogGenerateResult> {
  const { logger } = adapters;
  const tiers = options.tiers ?? ['spec', 'library', 'monorepo'];
  const format = options.format ?? 'keep-a-changelog';

  logger.info('Generating changelogs...', { tiers, format });

  // First, analyze versions to get changes
  const analysis = await analyzeVersions(adapters, {
    baseline: options.baseline,
    workspaceRoot: options.workspaceRoot,
  });

  const specChangelogs: ChangelogDocBlock[] = [];
  const libraryMarkdown = new Map<string, string>();
  let monorepoMarkdown = '';
  let totalEntries = 0;

  // Generate per-spec changelogs
  if (tiers.includes('spec')) {
    for (const spec of analysis.analyses.filter((a) => a.needsBump)) {
      const docBlock: ChangelogDocBlock = {
        id: `changelog.${spec.specKey}`,
        title: `Changelog for ${spec.specKey}`,
        body: formatSpecChangelog(spec),
        kind: 'changelog',
        specKey: spec.specKey,
        specVersion: spec.suggestedVersion,
        entries: [
          {
            version: spec.suggestedVersion,
            date: new Date().toISOString().split('T')[0] ?? '',
            bumpType: spec.bumpType,
            changes: spec.changes,
            breakingChanges: spec.changes.filter((c) => c.type === 'breaking'),
          },
        ],
      };
      specChangelogs.push(docBlock);
      totalEntries++;
    }
  }

  // Generate library-level changelogs
  if (tiers.includes('library')) {
    const libraryGroups = groupByLibrary(analysis.analyses);
    for (const [libPath, specs] of libraryGroups) {
      const entries = specs.filter((s) => s.needsBump);
      if (entries.length > 0) {
        libraryMarkdown.set(
          libPath,
          formatKeepAChangelog(entries.map(specToChangelogEntry))
        );
        totalEntries += entries.length;
      }
    }
  }

  // Generate monorepo-level changelog
  if (tiers.includes('monorepo')) {
    const allEntries = analysis.analyses
      .filter((a) => a.needsBump)
      .map(specToChangelogEntry);
    monorepoMarkdown = formatKeepAChangelog(allEntries);
  }

  // Generate JSON export
  const json = formatChangelogJson(analysis, options.baseline);

  logger.info('Changelog generation complete', { totalEntries });

  return {
    specChangelogs,
    libraryMarkdown,
    monorepoMarkdown,
    json,
    totalEntries,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

interface SpecMeta {
  key: string;
  version: string;
}

/**
 * Extract spec metadata from file content.
 */
function extractSpecMeta(content: string): SpecMeta | null {
  // Match meta.key and meta.version patterns
  const keyMatch = content.match(/key:\s*['"`]([^'"`]+)['"`]/);
  const versionMatch = content.match(/version:\s*['"`]([^'"`]+)['"`]/);

  if (!keyMatch || !versionMatch) {
    return null;
  }

  const key = keyMatch[1];
  const version = versionMatch[1];

  // Type guard for regex capture groups
  if (!key || !version) {
    return null;
  }

  return {
    key,
    version,
  };
}

/**
 * Analyze changes between current and baseline spec content.
 */
function analyzeSpecChanges(
  current: string,
  baseline: string | null
): ChangeEntry[] {
  const changes: ChangeEntry[] = [];

  if (!baseline) {
    // New spec
    changes.push({
      type: 'added',
      description: 'New spec added',
    });
    return changes;
  }

  // Simple diff analysis - check for structural changes
  const currentMeta = extractSpecMeta(current);
  const baselineMeta = extractSpecMeta(baseline);

  if (!currentMeta || !baselineMeta) {
    return changes;
  }

  // Version change
  if (currentMeta.version !== baselineMeta.version) {
    changes.push({
      type: 'changed',
      description: `Version updated from ${baselineMeta.version} to ${currentMeta.version}`,
      path: 'meta.version',
    });
  }

  // Check for io changes (simplified)
  const hasIoChanges = detectIoChanges(current, baseline);
  if (hasIoChanges.breaking) {
    changes.push({
      type: 'breaking',
      description: 'Breaking changes to input/output schema',
      path: 'io',
    });
  } else if (hasIoChanges.nonBreaking) {
    changes.push({
      type: 'changed',
      description: 'Non-breaking changes to input/output schema',
      path: 'io',
    });
  }

  return changes;
}

/**
 * Detect I/O changes between specs (simplified).
 */
function detectIoChanges(
  current: string,
  baseline: string
): { breaking: boolean; nonBreaking: boolean } {
  // Simple heuristic: check if io section differs
  const ioPattern = /io:\s*\{[\s\S]*?\}/;
  const currentIo = current.match(ioPattern)?.[0] ?? '';
  const baselineIo = baseline.match(ioPattern)?.[0] ?? '';

  if (currentIo === baselineIo) {
    return { breaking: false, nonBreaking: false };
  }

  // Check for removed fields (breaking) vs added fields (non-breaking)
  const currentFields = extractFields(currentIo);
  const baselineFields = extractFields(baselineIo);

  const removedFields = baselineFields.filter(
    (f) => !currentFields.includes(f)
  );
  const addedFields = currentFields.filter((f) => !baselineFields.includes(f));

  return {
    breaking: removedFields.length > 0,
    nonBreaking: addedFields.length > 0 && removedFields.length === 0,
  };
}

/**
 * Extract field names from a code block (simplified).
 */
function extractFields(code: string): string[] {
  const fieldPattern = /(\w+):/g;
  const matches = [...code.matchAll(fieldPattern)];
  return matches.map((m) => m[1]).filter((field): field is string => !!field);
}

/**
 * Update version in spec content.
 */
function updateSpecVersion(
  content: string,
  oldVersion: string,
  newVersion: string
): string {
  return content.replace(
    new RegExp(`version:\\s*['"\`]${oldVersion}['"\`]`),
    `version: '${newVersion}'`
  );
}

/**
 * Create an empty changelog entry.
 */
function createEmptyChangelogEntry(): ChangelogEntry {
  return {
    version: '0.0.0',
    date: new Date().toISOString().split('T')[0] ?? '',
    bumpType: 'patch',
    changes: [],
  };
}

/**
 * Format a single spec's changelog.
 */
function formatSpecChangelog(spec: SpecVersionAnalysis): string {
  const lines: string[] = [
    `## [${spec.suggestedVersion}] - ${new Date().toISOString().split('T')[0]}`,
    '',
  ];

  const breaking = spec.changes.filter((c) => c.type === 'breaking');
  const changed = spec.changes.filter((c) => c.type === 'changed');
  const added = spec.changes.filter((c) => c.type === 'added');

  if (breaking.length > 0) {
    lines.push('### Breaking Changes');
    breaking.forEach((c) => lines.push(`- ${c.description}`));
    lines.push('');
  }

  if (added.length > 0) {
    lines.push('### Added');
    added.forEach((c) => lines.push(`- ${c.description}`));
    lines.push('');
  }

  if (changed.length > 0) {
    lines.push('### Changed');
    changed.forEach((c) => lines.push(`- ${c.description}`));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Group specs by library (package path).
 */
function groupByLibrary(
  analyses: SpecVersionAnalysis[]
): Map<string, SpecVersionAnalysis[]> {
  const groups = new Map<string, SpecVersionAnalysis[]>();

  for (const analysis of analyses) {
    // Extract library path (up to src/)
    const libMatch = analysis.specPath.match(/(.+?\/src\/)/);
    const matchedPath = libMatch?.[1];
    const libPath = matchedPath ?? analysis.specPath;

    const existing = groups.get(libPath) ?? [];
    existing.push(analysis);
    groups.set(libPath, existing);
  }

  return groups;
}

/**
 * Convert SpecVersionAnalysis to ChangelogEntry.
 */
function specToChangelogEntry(spec: SpecVersionAnalysis): ChangelogEntry {
  return {
    version: spec.suggestedVersion,
    date: new Date().toISOString().split('T')[0] ?? '',
    bumpType: spec.bumpType,
    changes: spec.changes,
    breakingChanges: spec.changes.filter((c) => c.type === 'breaking'),
  };
}
