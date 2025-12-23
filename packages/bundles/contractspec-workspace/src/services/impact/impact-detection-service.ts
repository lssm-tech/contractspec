/**
 * Impact detection service.
 *
 * Orchestrates contract snapshot generation, diff computation,
 * and impact classification for CI/CD pipelines.
 */

// Note: Using internal imports from the bundle which re-exports from module
import {
  classifyImpact,
  computeIoDiff,
  generateSnapshot,
  type ContractSnapshot,
  type SpecSnapshot,
} from '../../index';
import type { FsAdapter } from '../../ports/fs';
import type { GitAdapter } from '../../ports/git';
import type { LoggerAdapter } from '../../ports/logger';
import type { ImpactDetectionOptions, ImpactDetectionResult } from './types';

/**
 * Detect the impact of contract changes between baseline and current state.
 *
 * @param adapters - Required adapters (fs, git, logger)
 * @param options - Detection options
 * @returns Impact detection result
 */
export async function detectImpact(
  adapters: { fs: FsAdapter; git: GitAdapter; logger: LoggerAdapter },
  options: ImpactDetectionOptions = {}
): Promise<ImpactDetectionResult> {
  const { fs, git, logger } = adapters;
  const workspaceRoot = options.workspaceRoot ?? process.cwd();

  logger.info('Starting impact detection...', { baseline: options.baseline });

  // Discover spec files
  const files = await fs.glob({
    pattern: options.pattern ?? '**/*.{operation,event}.ts',
    cwd: workspaceRoot,
  });

  const specFiles = files.filter(
    (f) =>
      !f.includes('.test.') &&
      !f.includes('.spec.') &&
      !f.includes('node_modules')
  );

  logger.debug(`Found ${specFiles.length} spec files`);

  // Load current (head) specs
  const headSpecs = await loadSpecs(fs, specFiles, workspaceRoot);
  const headSnapshot = generateSnapshot(headSpecs);

  // Load baseline specs if specified
  let baseSnapshot: ContractSnapshot;
  if (options.baseline) {
    const baseSpecs = await loadBaselineSpecs(
      fs,
      git,
      specFiles,
      options.baseline,
      workspaceRoot
    );
    baseSnapshot = generateSnapshot(baseSpecs);
  } else {
    // No baseline means all specs are "new"
    baseSnapshot = { version: 1, generatedAt: '', specs: [], hash: '' };
  }

  // Compute diffs between snapshots
  const diffs = computeSnapshotDiffs(baseSnapshot.specs, headSnapshot.specs);

  // Classify the impact
  const impactResult = classifyImpact(
    baseSnapshot.specs,
    headSnapshot.specs,
    diffs
  );

  logger.info('Impact detection complete', {
    status: impactResult.status,
    breaking: impactResult.summary.breaking,
    nonBreaking: impactResult.summary.nonBreaking,
  });

  return {
    ...impactResult,
    workspaceRoot,
    specsAnalyzed: specFiles.length,
    baseRef: options.baseline,
  };
}

/**
 * Load specs from current filesystem.
 */
async function loadSpecs(
  fs: FsAdapter,
  files: string[],
  _workspaceRoot: string
): Promise<{ path: string; content: string }[]> {
  const specs: { path: string; content: string }[] = [];

  for (const file of files) {
    const content = await fs.readFile(file);
    specs.push({ path: file, content });
  }

  return specs;
}

/**
 * Load specs from git baseline.
 */
async function loadBaselineSpecs(
  _fs: FsAdapter,
  git: GitAdapter,
  files: string[],
  baseline: string,
  _workspaceRoot: string
): Promise<{ path: string; content: string }[]> {
  const specs: { path: string; content: string }[] = [];

  for (const file of files) {
    try {
      const content = await git.showFile(baseline, file);
      specs.push({ path: file, content });
    } catch {
      // File doesn't exist in baseline - skip (it's new)
    }
  }

  return specs;
}

/**
 * Compute diffs between two sets of spec snapshots.
 */
function computeSnapshotDiffs(
  baseSpecs: SpecSnapshot[],
  headSpecs: SpecSnapshot[]
): ReturnType<typeof computeIoDiff> {
  const diffs: ReturnType<typeof computeIoDiff> = [];

  const baseMap = new Map(baseSpecs.map((s) => [`${s.name}@${s.version}`, s]));
  const headMap = new Map(headSpecs.map((s) => [`${s.name}@${s.version}`, s]));

  // Compare specs that exist in both
  for (const [key, headSpec] of headMap) {
    const baseSpec = baseMap.get(key);
    if (
      baseSpec &&
      headSpec.type === 'operation' &&
      baseSpec.type === 'operation'
    ) {
      const ioDiffs = computeIoDiff(baseSpec.io, headSpec.io);
      diffs.push(...ioDiffs);
    }
  }

  return diffs;
}
