import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SpecRegistry } from '../../registry';
import { defaultMcpTool } from '../../jsonschema';
import type { McpCtxFactories } from './mcpTypes';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function registerMcpTools(
  server: McpServer,
  ops: SpecRegistry,
  ctx: Pick<McpCtxFactories, 'toolCtx'>
) {
  for (const spec of ops.listSpecs()) {
    if (spec.meta.kind !== 'command') continue; // expose only commands as tools

    const toolName =
      spec.transport?.mcp?.toolName ??
      defaultMcpTool(spec.meta.name, spec.meta.version);

    server.registerTool(
      toolName,
      {
        description: spec.meta.description,
        inputSchema: spec.io.input?.getZod(),
      },
      async (args: unknown): Promise<CallToolResult> => {
        const result = await ops.execute(
          spec.meta.name,
          spec.meta.version,
          args ?? {},
          ctx.toolCtx()
        );
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 4) }],
        };
      }
    );
  }
}
