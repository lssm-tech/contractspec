/**
 * MCP server health checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { CheckResult, CheckContext, FixResult } from '../types';
import {
  generateCursorMcpConfig,
  getClaudeDesktopConfigPath,
} from '../../setup/config-generators';
import { deepMergePreserve, formatJson } from '../../setup/file-merger';

/**
 * Run MCP-related health checks.
 */
export async function runMcpChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check Cursor MCP config
  results.push(await checkCursorMcpConfig(fs, ctx));

  // Check Cursor MCP server registration
  results.push(await checkCursorMcpServer(fs, ctx));

  // Check Claude Desktop config (optional)
  results.push(await checkClaudeMcpConfig(fs, ctx));

  return results;
}

/**
 * Check if .cursor/mcp.json exists.
 */
async function checkCursorMcpConfig(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.cursor', 'mcp.json');

  const exists = await fs.exists(configPath);
  if (exists) {
    return {
      category: 'mcp',
      name: 'Cursor MCP Config',
      status: 'pass',
      message: '.cursor/mcp.json found',
    };
  }

  return {
    category: 'mcp',
    name: 'Cursor MCP Config',
    status: 'warn',
    message: '.cursor/mcp.json not found',
    details: 'MCP integration with Cursor will not work',
    fix: {
      description: 'Create .cursor/mcp.json',
      apply: async (): Promise<FixResult> => {
        try {
          const cursorDir = fs.join(ctx.workspaceRoot, '.cursor');
          if (!(await fs.exists(cursorDir))) {
            await fs.mkdir(cursorDir);
          }

          const defaults = generateCursorMcpConfig();
          await fs.writeFile(configPath, formatJson(defaults));
          return { success: true, message: 'Created .cursor/mcp.json' };
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          return { success: false, message: `Failed: ${msg}` };
        }
      },
    },
  };
}

/**
 * Check if ContractSpec MCP server is registered in Cursor config.
 */
async function checkCursorMcpServer(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.cursor', 'mcp.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return {
      category: 'mcp',
      name: 'MCP Server Registered',
      status: 'skip',
      message: 'Cursor MCP config does not exist',
    };
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as {
      mcpServers?: Record<string, unknown>;
    };

    const hasServer = config.mcpServers?.['contractspec-local'] !== undefined;

    if (hasServer) {
      return {
        category: 'mcp',
        name: 'MCP Server Registered',
        status: 'pass',
        message: 'ContractSpec MCP server is registered',
      };
    }

    return {
      category: 'mcp',
      name: 'MCP Server Registered',
      status: 'fail',
      message: 'ContractSpec MCP server not registered',
      fix: {
        description: 'Register ContractSpec MCP server',
        apply: async (): Promise<FixResult> => {
          try {
            const defaults = generateCursorMcpConfig() as Record<
              string,
              unknown
            >;
            const merged = deepMergePreserve(
              config as Record<string, unknown>,
              defaults
            );
            await fs.writeFile(configPath, formatJson(merged));
            return { success: true, message: 'Registered MCP server' };
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            return { success: false, message: `Failed: ${msg}` };
          }
        },
      },
    };
  } catch {
    return {
      category: 'mcp',
      name: 'MCP Server Registered',
      status: 'skip',
      message: 'Could not parse Cursor MCP config',
    };
  }
}

/**
 * Check Claude Desktop MCP config (optional).
 */
async function checkClaudeMcpConfig(
  fs: FsAdapter,
  _ctx: CheckContext
): Promise<CheckResult> {
  const configPath = getClaudeDesktopConfigPath();

  try {
    const exists = await fs.exists(configPath);
    if (!exists) {
      return {
        category: 'mcp',
        name: 'Claude Desktop MCP',
        status: 'skip',
        message: 'Claude Desktop config not found (optional)',
      };
    }

    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as {
      mcpServers?: Record<string, unknown>;
    };

    const hasServer = config.mcpServers?.['contractspec-local'] !== undefined;

    if (hasServer) {
      return {
        category: 'mcp',
        name: 'Claude Desktop MCP',
        status: 'pass',
        message: 'ContractSpec registered in Claude Desktop',
      };
    }

    return {
      category: 'mcp',
      name: 'Claude Desktop MCP',
      status: 'warn',
      message: 'ContractSpec not registered in Claude Desktop',
      details: 'Optional: Run setup to configure Claude Desktop',
    };
  } catch {
    return {
      category: 'mcp',
      name: 'Claude Desktop MCP',
      status: 'skip',
      message: 'Could not check Claude Desktop config',
    };
  }
}
