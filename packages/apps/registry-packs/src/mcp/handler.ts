/**
 * MCP handler for the agentpacks registry.
 *
 * Creates an Elysia plugin that mounts the MCP server at a given
 * base path. Uses `elysia-mcp` (Pattern B) with `@modelcontextprotocol/sdk`.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { mcp } from 'elysia-mcp';
import { registerTools } from './tools';
import { registerResources } from './resources';
import { registerPrompts } from './prompts';

export interface RegistryMcpOptions {
  /** Base path for the MCP endpoint (default: "/mcp") */
  basePath?: string;
  /** Run in stateless mode (default: true) */
  stateless?: boolean;
  /** Enable JSON response format (default: true) */
  enableJsonResponse?: boolean;
}

function setupMcpServer(server: McpServer): void {
  registerTools(server);
  registerResources(server);
  registerPrompts(server);
}

/**
 * Creates the Elysia MCP plugin for the agentpacks registry.
 *
 * Usage:
 * ```ts
 * import { createRegistryMcpHandler } from "./mcp/handler";
 * app.use(createRegistryMcpHandler());
 * ```
 */
export function createRegistryMcpHandler(options: RegistryMcpOptions = {}) {
  const {
    basePath = '/mcp',
    stateless = true,
    enableJsonResponse = true,
  } = options;

  return mcp({
    basePath,
    stateless,
    enableJsonResponse,
    serverInfo: {
      name: 'agentpacks-registry-mcp',
      version: '0.1.0',
    },
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
    setupServer: setupMcpServer,
  });
}
