import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PromptRegistry } from '../../promptRegistry';
import type { McpCtxFactories } from './mcpTypes';
import type { GetPromptResult } from '@modelcontextprotocol/sdk/types.js';
import type { ZodRawShapeCompat } from '@modelcontextprotocol/sdk/server/zod-compat.js';
import z from 'zod';

function promptArgsSchemaFromPromptArgs(
  args: { name: string; schema: z.ZodType }[]
): ZodRawShapeCompat {
  const shape: Record<string, z.ZodType> = {};
  for (const a of args) shape[a.name] = a.schema;
  return shape as unknown as ZodRawShapeCompat;
}

export function registerMcpPrompts(
  server: McpServer,
  prompts: PromptRegistry,
  ctx: Pick<McpCtxFactories, 'promptCtx'>
) {
  for (const prompt of prompts.list()) {
    server.registerPrompt(
      prompt.meta.name,
      {
        title: prompt.meta.title,
        description: prompt.meta.description,
        // MCP SDK expects a "raw shape" of zod schemas (Record<string, ZodSchema>)
        // rather than JSON Schema.
        argsSchema: promptArgsSchemaFromPromptArgs(prompt.args),
      },
      async (args: unknown): Promise<GetPromptResult> => {
        const link = (tpl: string, vars: Record<string, string | number>) => {
          let out = tpl;
          for (const [k, v] of Object.entries(vars))
            out = out.replace(
              new RegExp(`\\{${k}\\}`, 'g'),
              encodeURIComponent(String(v))
            );
          return out;
        };

        const parts = await prompt.render(prompt.input.parse(args), {
          ...ctx.promptCtx(),
          link,
        });

        // MCP SDK types represent message content as a single content block.
        // We keep a single assistant message and concatenate all parts as text.
        const text = parts
          .map((p) =>
            p.type === 'text'
              ? p.text
              : `See resource: ${p.title ?? p.uri}\nURI: ${p.uri}`
          )
          .join('\n\n');
        const contents: GetPromptResult['messages'][number]['content'] = {
          type: 'text',
          text,
        };

        return {
          messages: [{ role: 'assistant', content: contents }],
          description: prompt.meta.description,
        };
      }
    );
  }
}
