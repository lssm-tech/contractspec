import { experimental_createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport as StdioClientTransport } from '@ai-sdk/mcp/mcp-stdio';
import type { Tool } from 'ai';

/**
 * Configuration for connecting to an MCP server.
 */
export interface McpClientConfig {
  /** Display name for the MCP server */
  name: string;
  /** Command to spawn the MCP server process */
  command: string;
  /** Arguments to pass to the command */
  args?: string[];
  /** Environment variables for the process */
  env?: Record<string, string>;
}

/**
 * Result of creating an MCP client with tools.
 */
export interface McpClientResult {
  /** AI SDK tools from the MCP server */
  tools: Record<string, Tool<unknown, unknown>>;
  /** Cleanup function to close the connection */
  cleanup: () => Promise<void>;
}

/**
 * Create AI SDK tools from an MCP server.
 *
 * This adapter allows ContractSpec agents to consume tools
 * from external MCP servers (e.g., filesystem, database, etc.).
 *
 * @param config - MCP server configuration
 * @returns Tools and cleanup function
 *
 * @example
 * ```typescript
 * const { tools, cleanup } = await mcpServerToTools({
 *   name: 'filesystem',
 *   command: 'npx',
 *   args: ['-y', '@modelcontextprotocol/server-filesystem', '/path'],
 * });
 *
 * // Use tools in agent...
 *
 * await cleanup();
 * ```
 */
export async function mcpServerToTools(
  config: McpClientConfig
): Promise<McpClientResult> {
  const transport = new StdioClientTransport({
    command: config.command,
    args: config.args,
    env: config.env,
  });

  const client = await experimental_createMCPClient({ transport });
  const tools = await client.tools();

  return {
    tools: tools as Record<string, Tool<unknown, unknown>>,
    cleanup: () => client.close(),
  };
}

/**
 * Create multiple MCP tool sets from configurations.
 *
 * @param configs - Array of MCP server configurations
 * @returns Combined tools and cleanup function
 */
export async function createMcpToolsets(
  configs: McpClientConfig[]
): Promise<McpClientResult> {
  const results = await Promise.all(configs.map(mcpServerToTools));

  const combinedTools: Record<string, Tool<unknown, unknown>> = {};
  for (const result of results) {
    Object.assign(combinedTools, result.tools);
  }

  return {
    tools: combinedTools,
    cleanup: async () => {
      await Promise.all(results.map((r) => r.cleanup()));
    },
  };
}
