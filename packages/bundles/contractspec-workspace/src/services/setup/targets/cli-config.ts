/**
 * CLI config setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { SetupOptions, SetupFileResult, SetupPromptCallbacks } from '../types';
import { generateContractsrcConfig } from '../config-generators';
import { deepMergePreserve, safeParseJson, formatJson } from '../file-merger';

/**
 * Setup .contractsrc.json
 */
export async function setupCliConfig(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  const filePath = fs.join(options.workspaceRoot, '.contractsrc.json');

  try {
    const exists = await fs.exists(filePath);
    const defaults = generateContractsrcConfig(options);

    if (exists) {
      const content = await fs.readFile(filePath);
      const existing = safeParseJson<Record<string, unknown>>(content);

      if (!existing) {
        return {
          target: 'cli-config',
          filePath,
          action: 'error',
          message: 'Existing file is not valid JSON',
        };
      }

      if (options.interactive) {
        const proceed = await prompts.confirm(
          `${filePath} exists. Merge ContractSpec defaults?`
        );
        if (!proceed) {
          return {
            target: 'cli-config',
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
        target: 'cli-config',
        filePath,
        action: 'merged',
        message: 'Merged with existing configuration',
      };
    }

    await fs.writeFile(filePath, formatJson(defaults));
    return {
      target: 'cli-config',
      filePath,
      action: 'created',
      message: 'Created CLI configuration',
    };
  } catch (error) {
    return {
      target: 'cli-config',
      filePath,
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


