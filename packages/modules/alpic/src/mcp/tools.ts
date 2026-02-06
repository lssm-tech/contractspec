import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { alpicAssetPath } from '../assets/paths';

export interface AlpicMcpToolConfig {
  name?: string;
  description?: string;
}

const defaultToolName = 'alpic.ping';

export function registerAlpicTools(
  server: McpServer,
  config: AlpicMcpToolConfig = {}
): void {
  const toolName = config.name ?? defaultToolName;
  const description =
    config.description ?? 'Ping the MCP server and return basic Alpic info.';
  const inputSchema = z.object({
    message: z.string().optional(),
  });

  server.registerTool(toolName, { description, inputSchema }, async (args) => {
    const payload = {
      ok: true,
      message: args.message ?? 'pong',
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
  });
}
