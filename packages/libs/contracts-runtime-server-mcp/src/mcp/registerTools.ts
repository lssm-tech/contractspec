import {
	defaultMcpTool,
	sanitizeMcpName,
} from '@contractspec/lib.contracts-spec/jsonschema';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { McpCtxFactories } from './mcpTypes';

export function registerMcpTools(
	server: McpServer,
	ops: OperationSpecRegistry,
	ctx: Pick<McpCtxFactories, 'toolCtx'>
) {
	for (const spec of ops.list()) {
		if (spec.meta.kind !== 'command') continue;

		const rawToolName = spec.transport?.mcp?.toolName;
		const toolName = rawToolName
			? sanitizeMcpName(rawToolName)
			: defaultMcpTool(spec.meta.key, spec.meta.version);

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
