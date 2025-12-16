/**
 * Clean service.
 *
 * Safe-by-default cleanup of generated artifacts.
 */

import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';

export interface CleanOptions {
  /**
   * When true, only remove known build artifact directories and known generated
   * suffixes (safe-by-default).
   */
  generatedOnly?: boolean;
  /**
   * Skip deletions; just report.
   */
  dryRun?: boolean;
  /**
   * Only delete files older than this many days.
   */
  olderThanDays?: number;
  /**
   * Output directory used for generated artifacts (handlers/components/forms).
   */
  outputDir?: string;
}

export interface CleanResult {
  removed: { path: string; size: number }[];
  skipped: { path: string; reason: string }[];
}

export async function cleanArtifacts(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CleanOptions = {}
): Promise<CleanResult> {
  const { fs, logger } = adapters;
  const outputDir = (options.outputDir ?? './src').replace(/\\/g, '/');

  const basePatterns = ['generated/**', 'dist/**', '.turbo/**'];

  const outputDirPatterns = [
    `${outputDir}/handlers/**/*.handler.ts`,
    `${outputDir}/handlers/**/*.handler.test.ts`,
    `${outputDir}/components/**/*.tsx`,
    `${outputDir}/components/**/*.test.tsx`,
    `${outputDir}/forms/**/*.form.tsx`,
    `${outputDir}/forms/**/*.form.test.tsx`,
    `${outputDir}/**/*.runner.ts`,
    `${outputDir}/**/*.renderer.tsx`,
  ];

  const patterns = options.generatedOnly
    ? [...basePatterns, ...outputDirPatterns]
    : [
        ...basePatterns,
        '**/*.generated.ts',
        '**/*.generated.js',
        '**/*.generated.d.ts',
        ...outputDirPatterns,
      ];

  const candidates = await fs.glob({
    patterns,
    ignore: ['node_modules/**'],
  });

  const removed: { path: string; size: number }[] = [];
  const skipped: { path: string; reason: string }[] = [];

  for (const p of candidates) {
    try {
      const st = await fs.stat(p);
      const ageDays = (Date.now() - st.mtime.getTime()) / (1000 * 60 * 60 * 24);
      if (
        typeof options.olderThanDays === 'number' &&
        ageDays < options.olderThanDays
      ) {
        skipped.push({
          path: p,
          reason: `younger_than_${options.olderThanDays}_days`,
        });
        continue;
      }

      if (options.dryRun) {
        logger.info('[dry-run] clean would remove', { path: p, size: st.size });
      } else {
        await fs.remove(p);
        logger.info('clean.removed', { path: p, size: st.size });
      }
      removed.push({ path: p, size: st.size });
    } catch (error) {
      skipped.push({
        path: p,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { removed, skipped };
}

