import { sanitizeMcpName } from '@contractspec/lib.contracts-spec/jsonschema';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import * as z from 'zod';
import { alpicAssetPath } from '../assets/paths';

export interface AlpicMcpToolConfig {
	name?: string;
	description?: string;
}

const defaultToolName = 'alpic_ping';
const alpicPingInputSchema = z.object({
	message: z.string().optional(),
});

export function registerAlpicTools(
	server: McpServer,
	config: AlpicMcpToolConfig = {}
): void {
	const toolName = sanitizeMcpName(config.name ?? defaultToolName);
	const description =
		config.description ?? 'Ping the MCP server and return basic Alpic info.';

	server.registerTool(
		toolName,
		{
			description,
			inputSchema: alpicPingInputSchema as unknown as AnySchema,
		},
		async (args: unknown): Promise<CallToolResult> => {
			const input = alpicPingInputSchema.parse(args ?? {});
			const payload = {
				ok: true,
				message: input.message ?? 'pong',
				assetsBase: alpicAssetPath(''),
				timestamp: new Date().toISOString(),
			};

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(payload, null, 2),
					},
				],
			};
		}
	);
}
