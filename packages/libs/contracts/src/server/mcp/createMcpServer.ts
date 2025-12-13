import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SpecRegistry } from '../../registry';
import type { ResourceRegistry } from '../../resources';
import type { PromptRegistry } from '../../promptRegistry';
import type { McpCtxFactories } from './mcpTypes';
import { registerMcpTools } from './registerTools';
import { registerMcpResources } from './registerResources';
import { registerMcpPrompts } from './registerPrompts';
import { registerMcpPresentations } from './registerPresentations';

/**
 * Creates a unified Model Context Protocol (MCP) server exposing operations, resources, prompts,
 * and (optionally) presentations.\n+ *
 * ContractSpec exposes:\n+ * - Tools: `command` operations from `SpecRegistry`.\n+ * - Resources: templates from `ResourceRegistry`.\n+ * - Prompts: templates from `PromptRegistry`.\n+ * - Presentations: V1 registry and/or V2 descriptors as read-only resources.\n+ */
export function createMcpServer(
  server: McpServer,
  ops: SpecRegistry,
  resources: ResourceRegistry,
  prompts: PromptRegistry,
  ctxFactories: McpCtxFactories
) {
  ctxFactories.logger.info('Creating MCP server');

  registerMcpTools(server, ops, { toolCtx: ctxFactories.toolCtx });
  registerMcpResources(server, resources, {
    logger: ctxFactories.logger,
    resourceCtx: ctxFactories.resourceCtx,
  });
  registerMcpPresentations(server, {
    logger: ctxFactories.logger,
    presentations: ctxFactories.presentations,
    presentationsV2: ctxFactories.presentationsV2,
  });
  registerMcpPrompts(server, prompts, { promptCtx: ctxFactories.promptCtx });

  return server;
}
