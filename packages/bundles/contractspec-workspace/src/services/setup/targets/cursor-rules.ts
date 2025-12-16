/**
 * Cursor rules setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { SetupOptions, SetupFileResult, SetupPromptCallbacks } from '../types';
import { generateCursorRules } from '../config-generators';

/**
 * Setup .cursor/rules/contractspec.mdc
 */
export async function setupCursorRules(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  const rulesDir = fs.join(options.workspaceRoot, '.cursor', 'rules');
  const filePath = fs.join(rulesDir, 'contractspec.mdc');

  try {
    // Ensure .cursor/rules directory exists
    const cursorDir = fs.join(options.workspaceRoot, '.cursor');
    if (!(await fs.exists(cursorDir))) {
      await fs.mkdir(cursorDir);
    }
    if (!(await fs.exists(rulesDir))) {
      await fs.mkdir(rulesDir);
    }

    const exists = await fs.exists(filePath);
    const content = generateCursorRules(options);

    if (exists) {
      if (options.interactive) {
        const proceed = await prompts.confirm(
          `${filePath} exists. Overwrite with latest rules?`
        );
        if (!proceed) {
          return {
            target: 'cursor-rules',
            filePath,
            action: 'skipped',
            message: 'User kept existing rules',
          };
        }
      } else {
        // Non-interactive: skip existing file
        return {
          target: 'cursor-rules',
          filePath,
          action: 'skipped',
          message: 'File already exists',
        };
      }
    }

    await fs.writeFile(filePath, content);
    return {
      target: 'cursor-rules',
      filePath,
      action: exists ? 'merged' : 'created',
      message: exists ? 'Updated Cursor rules' : 'Created Cursor rules',
    };
  } catch (error) {
    return {
      target: 'cursor-rules',
      filePath,
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


