/**
 * MCP server setup for ContractSpec local operations.
 *
 * Creates an MCP server with tools, resources, and prompts for contract analysis.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createMcpServer, PromptRegistry, ResourceRegistry, SpecRegistry } from '@lssm/lib.contracts';
import { Logger, LogLevel } from '@lssm/lib.logger';
import { createNodeFsAdapter } from '@lssm/bundle.contractspec-workspace';
import type { FsAdapter, LoggerAdapter } from '@lssm/bundle.contractspec-workspace';
import type { HandlerCtx } from '@lssm/lib.contracts';
import { registerMcpLocalTools } from './tools';
import { registerMcpLocalResources } from './resources';
import { registerMcpLocalPrompts } from './prompts';
import { createNoopWorkspaceLoggerAdapter } from './adapters/noop-workspace-logger';

/**
 * Configuration for the MCP local server.
 */
export interface McpLocalConfig {
  /**
   * Root directory of the workspace to analyze.
   */
  workspaceRoot: string;

  /**
   * Server name shown to clients.
   */
  serverName?: string;

  /**
   * Server version shown to clients.
   */
  serverVersion?: string;
}

/**
 * Adapters for workspace operations.
 */
export interface WorkspaceAdapters {
  fs: FsAdapter;
  logger: LoggerAdapter;
}

/**
 * Create adapters for workspace operations.
 */
function createAdapters(config: McpLocalConfig): WorkspaceAdapters {
  const fs = createNodeFsAdapter(config.workspaceRoot);
  const logger: LoggerAdapter = createNoopWorkspaceLoggerAdapter();

  return { fs, logger };
}

/**
 * Create an MCP server for ContractSpec local operations.
 */
export function createServer(config: McpLocalConfig): McpServer {
  const serverName = config.serverName ?? 'contractspec-local';
  const serverVersion = config.serverVersion ?? '0.1.0';

  const server = new McpServer({
    name: serverName,
    version: serverVersion,
  });

  const adapters = createAdapters(config);

  // ContractSpec registries
  const ops = new SpecRegistry();
  const resources = new ResourceRegistry();
  const prompts = new PromptRegistry();

  registerMcpLocalTools(ops, adapters);
  registerMcpLocalResources(resources, adapters);
  registerMcpLocalPrompts(prompts);

  const logger = new Logger({
    level: LogLevel.INFO,
    enableColors: false,
    environment: (process.env['NODE_ENV'] as 'development' | 'production') ?? 'development',
  });

  const ctxFactories = {
    logger,
    toolCtx: (): HandlerCtx => ({
      actor: 'admin',
      channel: 'agent',
    }),
    promptCtx: () => ({}),
    resourceCtx: () => ({}),
  };

  createMcpServer(server, ops, resources, prompts, ctxFactories);

  return server;
}

