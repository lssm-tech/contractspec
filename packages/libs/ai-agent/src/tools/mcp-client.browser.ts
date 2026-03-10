/**
 * Browser-safe stub for mcp-client. MCP stdio/process spawning cannot run in browser.
 * Use this when bundling for client; the real implementation runs only on Node.
 */
import type { Tool } from "ai";

export type McpTransportType = "stdio" | "sse" | "http";

interface McpClientBaseConfig {
  name: string;
  toolPrefix?: string;
  clientName?: string;
  clientVersion?: string;
  authMethod?: "api-key" | "oauth2" | "bearer";
  authHeaders?: Record<string, string>;
  apiVersion?: string;
}

export interface McpStdioClientConfig extends McpClientBaseConfig {
  transport?: "stdio";
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
}

export interface McpRemoteClientConfig extends McpClientBaseConfig {
  transport: "sse" | "http";
  url: string;
  headers?: Record<string, string>;
  authProvider?: unknown;
  accessToken?: string;
  accessTokenEnvVar?: string;
}

export type McpClientConfig = McpStdioClientConfig | McpRemoteClientConfig;

export interface McpClientResult {
  tools: Record<string, Tool<unknown, unknown>>;
  cleanup: () => Promise<void>;
  serverToolNames: Record<string, string[]>;
}

export interface CreateMcpToolsetsOptions {
  onNameCollision?: "overwrite" | "error";
}

/**
 * Browser stub: MCP tools require Node (child_process). Returns empty tools.
 */
export async function mcpServerToTools(
  _config: McpClientConfig
): Promise<McpClientResult> {
  return {
    tools: {},
    cleanup: async () => {},
    serverToolNames: {},
  };
}

/**
 * Browser stub: MCP tools require Node. Returns empty combined tools.
 */
export async function createMcpToolsets(
  _configs: McpClientConfig[],
  _options: CreateMcpToolsetsOptions = {}
): Promise<McpClientResult> {
  return {
    tools: {},
    cleanup: async () => {},
    serverToolNames: {},
  };
}
