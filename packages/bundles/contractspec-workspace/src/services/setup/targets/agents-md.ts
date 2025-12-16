/**
 * AGENTS.md setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { SetupOptions, SetupFileResult, SetupPromptCallbacks } from '../types';
import { generateAgentsMd } from '../config-generators';

/**
 * Setup AGENTS.md
 *
 * In monorepo with package scope, creates AGENTS.md at package root.
 */
export async function setupAgentsMd(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  // Determine target root based on scope
  const targetRoot = options.isMonorepo && options.scope === 'package'
    ? options.packageRoot ?? options.workspaceRoot
    : options.workspaceRoot;

  const filePath = fs.join(targetRoot, 'AGENTS.md');

  try {
    const exists = await fs.exists(filePath);
    const content = generateAgentsMd(options);

    if (exists) {
      if (options.interactive) {
        const proceed = await prompts.confirm(
          `${filePath} exists. Overwrite?`
        );
        if (!proceed) {
          return {
            target: 'agents-md',
            filePath,
            action: 'skipped',
            message: 'User kept existing AGENTS.md',
          };
        }
      } else {
        // Non-interactive: skip existing file
        return {
          target: 'agents-md',
          filePath,
          action: 'skipped',
          message: 'File already exists',
        };
      }
    }

    await fs.writeFile(filePath, content);
    return {
      target: 'agents-md',
      filePath,
      action: exists ? 'merged' : 'created',
      message: exists ? 'Updated AGENTS.md' : 'Created AGENTS.md',
    };
  } catch (error) {
    return {
      target: 'agents-md',
      filePath,
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


