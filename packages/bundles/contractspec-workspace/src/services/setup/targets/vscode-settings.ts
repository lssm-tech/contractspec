/**
 * VS Code settings setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import type {
  SetupOptions,
  SetupFileResult,
  SetupPromptCallbacks,
} from '../types';
import { generateVscodeSettings } from '../config-generators';
import { deepMergePreserve, safeParseJson, formatJson } from '../file-merger';

/**
 * Setup .vscode/settings.json
 *
 * VS Code settings are typically at workspace root, but in monorepo
 * with package scope, can be at package root.
 */
export async function setupVscodeSettings(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  // VS Code settings typically stay at workspace root
  // but can be at package root if specifically requested
  const targetRoot =
    options.isMonorepo && options.scope === 'package'
      ? (options.packageRoot ?? options.workspaceRoot)
      : options.workspaceRoot;

  const dirPath = fs.join(targetRoot, '.vscode');
  const filePath = fs.join(dirPath, 'settings.json');

  try {
    // Ensure .vscode directory exists
    const dirExists = await fs.exists(dirPath);
    if (!dirExists) {
      await fs.mkdir(dirPath);
    }

    const exists = await fs.exists(filePath);
    const defaults = generateVscodeSettings();

    if (exists) {
      const content = await fs.readFile(filePath);
      const existing = safeParseJson<Record<string, unknown>>(content);

      if (!existing) {
        return {
          target: 'vscode-settings',
          filePath,
          action: 'error',
          message: 'Existing file is not valid JSON',
        };
      }

      if (options.interactive) {
        const proceed = await prompts.confirm(
          `${filePath} exists. Add ContractSpec settings?`
        );
        if (!proceed) {
          return {
            target: 'vscode-settings',
            filePath,
            action: 'skipped',
            message: 'User skipped merge',
          };
        }
      }

      const merged = deepMergePreserve(
        existing,
        defaults as Record<string, unknown>
      );
      await fs.writeFile(filePath, formatJson(merged));

      return {
        target: 'vscode-settings',
        filePath,
        action: 'merged',
        message: 'Added ContractSpec settings',
      };
    }

    await fs.writeFile(filePath, formatJson(defaults));
    return {
      target: 'vscode-settings',
      filePath,
      action: 'created',
      message: 'Created VS Code settings',
    };
  } catch (error) {
    return {
      target: 'vscode-settings',
      filePath,
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
