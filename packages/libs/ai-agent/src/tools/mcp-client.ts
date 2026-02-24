import {
  experimental_createMCPClient,
  type OAuthClientProvider,
} from '@ai-sdk/mcp';
import type { Tool } from 'ai';
import {
  buildMcpTransport,
  getErrorMessage,
  prefixToolNames,
} from './mcp-client-helpers';

/**
 * Supported transport types for MCP clients.
 */
export type McpTransportType = 'stdio' | 'sse' | 'http';

/**
 * Shared configuration for all MCP server transports.
 */
interface McpClientBaseConfig {
  /** Display name for the MCP server */
  name: string;
  /** Optional prefix applied to every imported tool name */
  toolPrefix?: string;
  /** Optional MCP client name override */
  clientName?: string;
  /** Optional MCP client version override */
  clientVersion?: string;
}

/**
 * Configuration for stdio MCP servers.
 */
export interface McpStdioClientConfig extends McpClientBaseConfig {
  /** Transport type (defaults to "stdio" when omitted) */
  transport?: 'stdio';
  /** Command to spawn the MCP server process */
  command: string;
  /** Arguments to pass to the command */
  args?: string[];
  /** Environment variables for the process */
  env?: Record<string, string>;
  /** Working directory for spawned process */
  cwd?: string;
}

/**
 * Configuration for remote MCP servers (SSE / Streamable HTTP).
 */
export interface McpRemoteClientConfig extends McpClientBaseConfig {
  /** Transport type */
  transport: 'sse' | 'http';
  /** MCP endpoint URL */
  url: string;
  /** Optional static headers */
  headers?: Record<string, string>;
  /** Optional OAuth provider for MCP auth flow */
  authProvider?: OAuthClientProvider;
  /** Optional bearer token injected into Authorization header */
  accessToken?: string;
  /** Optional env var name containing bearer token */
  accessTokenEnvVar?: string;
}

/**
 * Configuration for connecting to an MCP server.
 */
export type McpClientConfig = McpStdioClientConfig | McpRemoteClientConfig;

/**
 * Result of creating an MCP client with tools.
 */
export interface McpClientResult {
  /** AI SDK tools from the MCP server */
  tools: Record<string, Tool<unknown, unknown>>;
  /** Cleanup function to close the connection */
  cleanup: () => Promise<void>;
  /** Tool names grouped by source server name */
  serverToolNames: Record<string, string[]>;
}

/**
 * Options for combining multiple MCP toolsets.
 */
export interface CreateMcpToolsetsOptions {
  /** Strategy used when two MCP servers expose the same tool name */
  onNameCollision?: 'overwrite' | 'error';
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
  let client: Awaited<ReturnType<typeof experimental_createMCPClient>> | null =
    null;

  try {
    const transport = buildMcpTransport(config);
    client = await experimental_createMCPClient({
      transport,
      name: config.clientName,
      version: config.clientVersion,
    });

    const tools = await client.tools();
    const prefixedTools = prefixToolNames(config, tools);
    const connectedClient = client;

    return {
      tools: prefixedTools as Record<string, Tool<unknown, unknown>>,
      cleanup: () => connectedClient.close(),
      serverToolNames: {
        [config.name]: Object.keys(prefixedTools),
      },
    };
  } catch (error) {
    if (client) {
      await client.close().catch(() => undefined);
    }
    throw new Error(
      `[MCP:${config.name}] Failed to connect tools: ${getErrorMessage(error)}`
    );
  }
}

/**
 * Create multiple MCP tool sets from configurations.
 *
 * @param configs - Array of MCP server configurations
 * @param options - Merge options for conflicts
 * @returns Combined tools and cleanup function
 */
export async function createMcpToolsets(
  configs: McpClientConfig[],
  options: CreateMcpToolsetsOptions = {}
): Promise<McpClientResult> {
  const connected: McpClientResult[] = [];

  try {
    for (const config of configs) {
      const result = await mcpServerToTools(config);
      connected.push(result);
    }
  } catch (error) {
    await Promise.allSettled(connected.map((result) => result.cleanup()));
    throw error;
  }

  const combinedTools: Record<string, Tool<unknown, unknown>> = {};
  const serverToolNames: Record<string, string[]> = {};
  const collisionStrategy = options.onNameCollision ?? 'overwrite';

  try {
    for (const result of connected) {
      for (const [serverName, toolNames] of Object.entries(
        result.serverToolNames
      )) {
        serverToolNames[serverName] = toolNames;
      }

      for (const [toolName, tool] of Object.entries(result.tools)) {
        const hasCollision = combinedTools[toolName] !== undefined;

        if (hasCollision && collisionStrategy === 'error') {
          throw new Error(
            `Duplicate MCP tool name "${toolName}" detected. Use "toolPrefix" or set onNameCollision to "overwrite".`
          );
        }

        combinedTools[toolName] = tool;
      }
    }
  } catch (error) {
    await Promise.allSettled(connected.map((result) => result.cleanup()));
    throw error;
  }

  return {
    tools: combinedTools,
    serverToolNames,
    cleanup: async () => {
      const cleanupResults = await Promise.allSettled(
        connected.map((result) => result.cleanup())
      );

      const failures = cleanupResults.filter(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected'
      );

      if (failures.length > 0) {
        throw new Error(
          `Failed to cleanup ${failures.length} MCP client connection(s).`
        );
      }
    },
  };
}
