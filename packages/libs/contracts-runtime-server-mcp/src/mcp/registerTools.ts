import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { defaultMcpTool } from '@contractspec/lib.contracts-spec/jsonschema';
import type { McpCtxFactories } from './mcpTypes';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function registerMcpTools(
  server: McpServer,
  ops: OperationSpecRegistry,
  ctx: Pick<McpCtxFactories, 'toolCtx'>
) {
  for (const spec of ops.list()) {
    if (spec.meta.kind !== 'command') continue;

    const toolName =
      spec.transport?.mcp?.toolName ??
      defaultMcpTool(spec.meta.key, spec.meta.version);

    server.registerTool(
      toolName,
      {
        description: spec.meta.description,
        inputSchema: spec.io.input?.getZod(),
      },
      async (args: unknown): Promise<CallToolResult> => {
        const result = await ops.execute(
          spec.meta.key,
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
