/**
 * Claude Desktop MCP setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { SetupOptions, SetupFileResult, SetupPromptCallbacks } from '../types';
import { generateClaudeMcpConfig, getClaudeDesktopConfigPath } from '../config-generators';
import { deepMergePreserve, safeParseJson, formatJson } from '../file-merger';

/**
 * Setup Claude Desktop MCP config.
 * This modifies the user's global Claude config, so we're extra careful.
 */
export async function setupMcpClaude(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  const filePath = getClaudeDesktopConfigPath();

  try {
    const exists = await fs.exists(filePath);
    const defaults = generateClaudeMcpConfig();

    if (options.interactive) {
      const proceed = await prompts.confirm(
        `Configure Claude Desktop at ${filePath}?`
      );
      if (!proceed) {
        return {
          target: 'mcp-claude',
          filePath,
          action: 'skipped',
          message: 'User skipped Claude Desktop configuration',
        };
      }
    }

    if (exists) {
      const content = await fs.readFile(filePath);
      const existing = safeParseJson<Record<string, unknown>>(content);

      if (!existing) {
        return {
          target: 'mcp-claude',
          filePath,
          action: 'error',
          message: 'Existing file is not valid JSON',
        };
      }

      const merged = deepMergePreserve(
        existing,
        defaults as Record<string, unknown>
      );
      await fs.writeFile(filePath, formatJson(merged));

      return {
        target: 'mcp-claude',
        filePath,
        action: 'merged',
        message: 'Added ContractSpec to Claude Desktop',
      };
    }

    // Ensure parent directory exists
    const parentDir = filePath.substring(0, filePath.lastIndexOf('/'));
    const parentExists = await fs.exists(parentDir);
    if (!parentExists) {
      await fs.mkdir(parentDir);
    }

    await fs.writeFile(filePath, formatJson(defaults));
    return {
      target: 'mcp-claude',
      filePath,
      action: 'created',
      message: 'Created Claude Desktop configuration',
    };
  } catch (error) {
    return {
      target: 'mcp-claude',
      filePath,
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


