/**
 * Diff utilities for generate --diff preview.
 * Computes unified-style diff between existing and new file content.
 */
import { existsSync, readFileSync } from 'fs';

/**
 * Single file diff entry.
 */
export interface FileDiffEntry {
  filepath: string;
  status: 'added' | 'modified' | 'unchanged';
  /** Unified diff lines (empty if unchanged). */
  diffLines: string[];
}

/**
 * Compare new content to what exists on disk and return diff status.
 */
export function diffFile(filepath: string, newContent: string): FileDiffEntry {
  if (!existsSync(filepath)) {
    return {
      filepath,
      status: 'added',
      diffLines: formatAddedDiff(filepath, newContent),
    };
  }

  const existing = readFileSync(filepath, 'utf-8');
  if (existing === newContent) {
    return { filepath, status: 'unchanged', diffLines: [] };
  }

  return {
    filepath,
    status: 'modified',
    diffLines: computeUnifiedDiff(filepath, existing, newContent),
  };
}

/**
 * Format a diff for a new file (all lines are additions).
 */
function formatAddedDiff(filepath: string, content: string): string[] {
  const lines: string[] = [
    `--- /dev/null`,
    `+++ ${filepath}`,
    `@@ -0,0 +1,${content.split('\n').length} @@`,
  ];
  for (const line of content.split('\n')) {
    lines.push(`+${line}`);
  }
  return lines;
}

/**
 * Compute a simple unified diff between old and new content.
 * Uses a line-by-line comparison with context.
 */
function computeUnifiedDiff(
  filepath: string,
  oldContent: string,
  newContent: string
): string[] {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const result: string[] = [`--- ${filepath}`, `+++ ${filepath}`];

  // Simple hunk-based diff: scan for changed regions
  const hunks = findHunks(oldLines, newLines);

  for (const hunk of hunks) {
    result.push(
      `@@ -${hunk.oldStart + 1},${hunk.oldCount} +${hunk.newStart + 1},${hunk.newCount} @@`
    );
    for (const line of hunk.lines) {
      result.push(line);
    }
  }

  return result;
}

interface Hunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: string[];
}

/**
 * Find diff hunks using simple LCS-based approach.
 */
function findHunks(oldLines: string[], newLines: string[]): Hunk[] {
  const CONTEXT = 3;
  const changes: Array<{
    type: '-' | '+' | ' ';
    line: string;
    oldIdx: number;
    newIdx: number;
  }> = [];

  // Simple O(n) diff for lines that match
  let oi = 0;
  let ni = 0;
  while (oi < oldLines.length || ni < newLines.length) {
    if (
      oi < oldLines.length &&
      ni < newLines.length &&
      oldLines[oi] === newLines[ni]
    ) {
      changes.push({ type: ' ', line: oldLines[oi]!, oldIdx: oi, newIdx: ni });
      oi++;
      ni++;
    } else if (
      ni < newLines.length &&
      (oi >= oldLines.length || !newLines.slice(ni).includes(oldLines[oi]!))
    ) {
      changes.push({ type: '+', line: newLines[ni]!, oldIdx: oi, newIdx: ni });
      ni++;
    } else {
      changes.push({ type: '-', line: oldLines[oi]!, oldIdx: oi, newIdx: oi });
      oi++;
    }
  }

  // Group into hunks with context
  const hunks: Hunk[] = [];
  let currentHunk: Hunk | null = null;
  let unchangedCount = 0;

  for (const change of changes) {
    if (change.type === ' ') {
      unchangedCount++;
      if (currentHunk && unchangedCount <= CONTEXT) {
        currentHunk.lines.push(` ${change.line}`);
        currentHunk.oldCount++;
        currentHunk.newCount++;
      } else if (currentHunk && unchangedCount > CONTEXT * 2) {
        hunks.push(currentHunk);
        currentHunk = null;
      }
    } else {
      if (!currentHunk) {
        // Start new hunk with leading context
        const contextStart = Math.max(0, changes.indexOf(change) - CONTEXT);
        currentHunk = {
          oldStart:
            change.oldIdx -
            Math.min(CONTEXT, changes.indexOf(change) - contextStart),
          oldCount: 0,
          newStart:
            change.newIdx -
            Math.min(CONTEXT, changes.indexOf(change) - contextStart),
          newCount: 0,
          lines: [],
        };
        // Add leading context
        for (let i = contextStart; i < changes.indexOf(change); i++) {
          if (changes[i]!.type === ' ') {
            currentHunk.lines.push(` ${changes[i]!.line}`);
            currentHunk.oldCount++;
            currentHunk.newCount++;
          }
        }
      }
      unchangedCount = 0;
      currentHunk.lines.push(`${change.type}${change.line}`);
      if (change.type === '-') currentHunk.oldCount++;
      if (change.type === '+') currentHunk.newCount++;
    }
  }

  if (currentHunk) hunks.push(currentHunk);
  return hunks;
}
