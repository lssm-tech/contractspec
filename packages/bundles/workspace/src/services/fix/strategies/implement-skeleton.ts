/**
 * Implement skeleton strategy.
 *
 * Creates a minimal spec stub with in_creation stability.
 */

import type {
  FixableIssue,
  FixOptions,
  FixResult,
  FixFileChange,
  SpecGenerationContext,
} from '../types';
import type { FsAdapter } from '../../../ports/fs';
import {
  generateSkeletonOperation,
  generateSkeletonEvent,
  generateSkeletonPresentation,
} from '../../../templates/fix';
import { FIX_STRATEGY_STABILITY } from '../types';
import path from 'node:path';

/**
 * Create a skeleton spec for a missing reference.
 */
export async function implementSkeletonStrategy(
  issue: FixableIssue,
  options: FixOptions,
  adapters: { fs: FsAdapter }
): Promise<FixResult> {
  const { fs } = adapters;
  const { ref, specType, featureKey } = issue;

  try {
    // Build generation context
    const ctx: SpecGenerationContext = {
      key: ref.key,
      version: ref.version,
      specType,
      stability: FIX_STRATEGY_STABILITY['implement-skeleton'],
      description: `Skeleton spec for ${ref.key}`,
      featureKey,
    };

    // Generate the spec code
    const code = generateSpecCode(ctx);
    if (!code) {
      return {
        success: false,
        strategy: 'implement-skeleton',
        issue,
        filesChanged: [],
        error: `Unsupported spec type: ${specType}`,
      };
    }

    // Determine output path
    const filePath = resolveOutputPath(ref.key, specType, options);

    const filesChanged: FixFileChange[] = [];

    // Write the file (unless dry run)
    if (!options.dryRun) {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir);

      // Write the spec file
      await fs.writeFile(filePath, code);

      filesChanged.push({
        path: filePath,
        action: 'created',
      });
    } else {
      // For dry run, report what would be created
      filesChanged.push({
        path: filePath,
        action: 'created',
      });
    }

    return {
      success: true,
      strategy: 'implement-skeleton',
      issue,
      filesChanged,
    };
  } catch (error) {
    return {
      success: false,
      strategy: 'implement-skeleton',
      issue,
      filesChanged: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate spec code based on type.
 */
function generateSpecCode(ctx: SpecGenerationContext): string | undefined {
  switch (ctx.specType) {
    case 'operation':
      return generateSkeletonOperation(ctx);
    case 'event':
      return generateSkeletonEvent(ctx);
    case 'presentation':
      return generateSkeletonPresentation(ctx);
    default:
      return undefined;
  }
}

/**
 * Resolve the output file path for a new spec.
 */
function resolveOutputPath(
  key: string,
  specType: string,
  options: FixOptions
): string {
  const baseDir = options.outputDir || options.workspaceRoot;

  // Convert key to file name: "docs.search" -> "docs-search"
  const fileName = key.replace(/\./g, '-').toLowerCase();

  // Get file extension based on spec type
  const extension = getFileExtension(specType);

  // Determine subdirectory based on spec type
  const subDir = getSubDirectory(specType);

  return path.join(baseDir, subDir, `${fileName}${extension}`);
}

/**
 * Get file extension for a spec type.
 */
function getFileExtension(specType: string): string {
  const extensions: Record<string, string> = {
    operation: '.contracts.ts',
    event: '.event.ts',
    presentation: '.presentation.ts',
    workflow: '.workflow.ts',
    'data-view': '.data-view.ts',
    form: '.form.ts',
    migration: '.migration.ts',
    experiment: '.experiment.ts',
    capability: '.capability.ts',
  };

  return extensions[specType] || '.ts';
}

/**
 * Get subdirectory for a spec type.
 */
function getSubDirectory(specType: string): string {
  const dirs: Record<string, string> = {
    operation: 'operations',
    event: 'events',
    presentation: 'presentations',
    workflow: 'workflows',
    'data-view': 'data-views',
    form: 'forms',
    migration: 'migrations',
    experiment: 'experiments',
    capability: 'capabilities',
  };

  return dirs[specType] || 'specs';
}
