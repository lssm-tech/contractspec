import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { ResourceRegistry } from '@contractspec/lib.contracts-spec/resources';
import type { PromptRegistry } from '@contractspec/lib.contracts-spec/promptRegistry';
import type { McpCtxFactories } from './mcpTypes';
import { registerMcpTools } from './registerTools';
import { registerMcpResources } from './registerResources';
import { registerMcpPrompts } from './registerPrompts';
import { registerMcpPresentations } from './registerPresentations';

export function createMcpServer(
  server: McpServer,
  ops: OperationSpecRegistry,
  resources: ResourceRegistry,
  prompts: PromptRegistry,
  ctxFactories: McpCtxFactories
) {
  ctxFactories.logger.debug('Creating MCP server');

  registerMcpTools(server, ops, { toolCtx: ctxFactories.toolCtx });
  registerMcpResources(server, resources, {
    logger: ctxFactories.logger,
    resourceCtx: ctxFactories.resourceCtx,
  });
  registerMcpPresentations(server, {
    logger: ctxFactories.logger,
    presentations: ctxFactories.presentations,
  });
  registerMcpPrompts(server, prompts, { promptCtx: ctxFactories.promptCtx });

  return server;
}
