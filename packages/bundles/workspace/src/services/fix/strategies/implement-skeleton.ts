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
  generateSkeletonCapability,
} from '../../../templates/fix';
import { resolveOutputPath } from '../path-resolver';
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
    const filePath = resolveOutputPath(issue, options);

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
    case 'capability':
      return generateSkeletonCapability(ctx);
    default:
      return undefined;
  }
}
