import { join } from 'path';
import { readJsonOrNull } from '../utils/filesystem.js';

/**
 * MCP server configuration entry.
 */
export interface McpServerEntry {
  description?: string;
  type?: 'stdio' | 'remote';
  command?: string;
  url?: string;
  args?: string[];
  env?: Record<string, string>;
  headers?: Record<string, string>;
  enabledTools?: string[];
  disabledTools?: string[];
  [key: string]: unknown;
}

/**
 * Parsed MCP configuration.
 */
export interface ParsedMcp {
  packName: string;
  sourcePath: string;
  servers: Record<string, McpServerEntry>;
}

/**
 * Raw mcp.json structure.
 */
interface RawMcpJson {
  mcpServers?: Record<string, McpServerEntry>;
}

/**
 * Parse MCP configuration from a pack's mcp.json file.
 */
export function parseMcp(packDir: string, packName: string): ParsedMcp | null {
  const mcpPath = join(packDir, 'mcp.json');
  const raw = readJsonOrNull<RawMcpJson>(mcpPath);
  if (!raw?.mcpServers) return null;

  return {
    packName,
    sourcePath: mcpPath,
    servers: raw.mcpServers,
  };
}

/**
 * Merge multiple MCP configs. First pack wins for duplicate server names.
 */
export function mergeMcpConfigs(configs: ParsedMcp[]): {
  servers: Record<string, McpServerEntry>;
  warnings: string[];
} {
  const servers: Record<string, McpServerEntry> = {};
  const warnings: string[] = [];

  for (const config of configs) {
    for (const [name, entry] of Object.entries(config.servers)) {
      if (name in servers) {
        warnings.push(
          `MCP server "${name}" from pack "${config.packName}" skipped (already defined).`
        );
        continue;
      }
      servers[name] = entry;
    }
  }

  return { servers, warnings };
}
