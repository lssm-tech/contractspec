/**
 * Changelog formatters.
 *
 * Format changelog entries as Markdown (Keep a Changelog, Conventional)
 * or JSON for programmatic use.
 */

import type {
  ChangelogEntry,
  ChangeEntry,
} from '@contractspec/lib.contracts-spec';
import type { VersionAnalyzeResult, ChangelogJsonExport } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Keep a Changelog Format
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format entries as Keep a Changelog markdown.
 *
 * @see https://keepachangelog.com/
 */
export function formatKeepAChangelog(entries: ChangelogEntry[]): string {
  const lines: string[] = [
    '# Changelog',
    '',
    'All notable changes to this project will be documented in this file.',
    '',
    'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),',
    'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).',
    '',
  ];

  // Sort entries by version (newest first)
  const sorted = [...entries].sort((a, b) =>
    compareVersionsDescending(a.version, b.version)
  );

  for (const entry of sorted) {
    lines.push(`## [${entry.version}] - ${entry.date}`);
    lines.push('');

    // Group changes by type
    const added = entry.changes.filter((c: ChangeEntry) => c.type === 'added');
    const changed = entry.changes.filter(
      (c: ChangeEntry) => c.type === 'changed'
    );
    const deprecated = entry.changes.filter(
      (c: ChangeEntry) => c.type === 'deprecated'
    );
    const removed = entry.changes.filter(
      (c: ChangeEntry) => c.type === 'removed'
    );
    const fixed = entry.changes.filter((c: ChangeEntry) => c.type === 'fixed');
    const security = entry.changes.filter(
      (c: ChangeEntry) => c.type === 'security'
    );
    const breaking =
      entry.breakingChanges ??
      entry.changes.filter((c: ChangeEntry) => c.type === 'breaking');

    if (breaking.length > 0) {
      lines.push('### ⚠️ Breaking Changes');
      breaking.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }

    if (added.length > 0) {
      lines.push('### Added');
      added.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }

    if (changed.length > 0) {
      lines.push('### Changed');
      changed.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }

    if (deprecated.length > 0) {
      lines.push('### Deprecated');
      deprecated.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }

    if (removed.length > 0) {
      lines.push('### Removed');
      removed.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }

    if (fixed.length > 0) {
      lines.push('### Fixed');
      fixed.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }

    if (security.length > 0) {
      lines.push('### Security');
      security.forEach((c: ChangeEntry) => {
        lines.push(`- ${c.description}${c.path ? ` (${c.path})` : ''}`);
      });
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Conventional Changelog Format
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format entries as Conventional Changelog markdown.
 *
 * @see https://www.conventionalcommits.org/
 */
export function formatConventionalChangelog(entries: ChangelogEntry[]): string {
  const lines: string[] = ['# Changelog', ''];

  // Sort entries by version (newest first)
  const sorted = [...entries].sort((a, b) =>
    compareVersionsDescending(a.version, b.version)
  );

  for (const entry of sorted) {
    const bumpLabel =
      entry.bumpType === 'major'
        ? '💥 BREAKING RELEASE'
        : entry.bumpType === 'minor'
          ? '🚀 Minor Release'
          : '🔧 Patch Release';

    lines.push(`## ${entry.version} (${entry.date}) - ${bumpLabel}`);
    lines.push('');

    // Map change types to conventional commit types
    const typeMapping: Record<string, string> = {
      added: 'feat',
      changed: 'refactor',
      fixed: 'fix',
      removed: 'refactor',
      deprecated: 'deprecate',
      breaking: 'feat!',
      security: 'security',
    };

    for (const change of entry.changes) {
      const type = typeMapping[change.type] ?? 'chore';
      const scope = change.path ? `(${change.path})` : '';
      const breakingMarker = change.type === 'breaking' ? '!' : '';
      lines.push(
        `- **${type}${scope}${breakingMarker}**: ${change.description}`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON Format
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format analysis result as JSON export.
 */
export function formatChangelogJson(
  analysis: VersionAnalyzeResult,
  baseline?: string
): ChangelogJsonExport {
  const specsNeedingBump = analysis.analyses.filter((a) => a.needsBump);

  const isoDateTime = new Date().toISOString();
  const isoDate = isoDateTime.split('T')[0] ?? '';

  return {
    generatedAt: isoDateTime,
    baseline,
    specs: specsNeedingBump.map((spec) => ({
      key: spec.specKey,
      version: spec.suggestedVersion,
      path: spec.specPath,
      entries: [
        {
          version: spec.suggestedVersion,
          date: isoDate,
          bumpType: spec.bumpType,
          changes: spec.changes,
          breakingChanges: spec.changes.filter((c) => c.type === 'breaking'),
        },
      ],
    })),
    libraries: [], // TODO: Group by library
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare versions in descending order (newest first).
 */
function compareVersionsDescending(a: string, b: string): number {
  const parseVer = (v: string): number[] => {
    const parts = v.split('.').map((p) => parseInt(p, 10) || 0);
    return parts;
  };

  const aParts = parseVer(a);
  const bParts = parseVer(b);

  for (let i = 0; i < 3; i++) {
    const aVal = aParts[i] ?? 0;
    const bVal = bParts[i] ?? 0;
    if (aVal !== bVal) {
      return bVal - aVal; // Descending
    }
  }

  return 0;
}
