/**
 * Cursor MCP setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { SetupOptions, SetupFileResult, SetupPromptCallbacks } from '../types';
import { generateCursorMcpConfig } from '../config-generators';
import { deepMergePreserve, safeParseJson, formatJson } from '../file-merger';

/**
 * Setup .cursor/mcp.json
 */
export async function setupMcpCursor(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  const dirPath = fs.join(options.workspaceRoot, '.cursor');
  const filePath = fs.join(dirPath, 'mcp.json');

  try {
    // Ensure .cursor directory exists
    const dirExists = await fs.exists(dirPath);
    if (!dirExists) {
      await fs.mkdir(dirPath);
    }

    const exists = await fs.exists(filePath);
    const defaults = generateCursorMcpConfig();

    if (exists) {
      const content = await fs.readFile(filePath);
      const existing = safeParseJson<Record<string, unknown>>(content);

      if (!existing) {
        return {
          target: 'mcp-cursor',
          filePath,
          action: 'error',
          message: 'Existing file is not valid JSON',
        };
      }

      if (options.interactive) {
        const proceed = await prompts.confirm(
          `${filePath} exists. Add ContractSpec MCP server?`
        );
        if (!proceed) {
          return {
            target: 'mcp-cursor',
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
        target: 'mcp-cursor',
        filePath,
        action: 'merged',
        message: 'Added ContractSpec MCP server',
      };
    }

    await fs.writeFile(filePath, formatJson(defaults));
    return {
      target: 'mcp-cursor',
      filePath,
      action: 'created',
      message: 'Created Cursor MCP configuration',
    };
  } catch (error) {
    return {
      target: 'mcp-cursor',
      filePath,
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


