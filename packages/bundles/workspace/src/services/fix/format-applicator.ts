/**
 * Format applicator service.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FixOptions, FixResult } from './types';
import type { LoggerAdapter } from '../../ports/logger';

const execAsync = promisify(exec);

/**
 * Apply formatting to the changed files in a fix result.
 */
export async function applyFormatting(
  result: FixResult,
  options: FixOptions,
  logger: LoggerAdapter
): Promise<void> {
  // Check if formatting is explicitly disabled
  if (options.format === false) {
    return;
  }

  // Get created or modified files
  const filesToFormat = result.filesChanged
    .filter((f) => f.action === 'created' || f.action === 'modified')
    .map((f) => f.path);

  if (filesToFormat.length === 0) {
    return;
  }

  // TODO: Read configuration from .contractsrc (if available in options)
  // For now, default to 'prettier' if we see it in node_modules or just try to run it.

  // We group files and run prettier in batch if possible, but for individual fixes 1-by-1 is fine.
  // Actually, batch fix might generate many files. 'fixIssue' is called per issue.
  // So we are formatting one file at a time usually.

  for (const file of filesToFormat) {
    try {
      // Try to format using bunx prettier
      // We assume cwd is workspaceRoot or just run where we are.
      // Ideally we use the user's workspaceRoot.
      const cwd = options.workspaceRoot || process.cwd();
      
      // Use --write to fix in place
      // Use --ignore-unknown to avoid errors on unsupported extensions
      await execAsync(`bunx prettier --write "${file}" --ignore-unknown`, {
        cwd,
      });
      
      logger.debug(`Formatted ${file}`);
    } catch (error) {
      // Log warning but don't fail the fix
      logger.warn(`Failed to format ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
