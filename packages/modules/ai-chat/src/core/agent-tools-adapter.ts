/**
 * Converts AgentToolConfig from ai-agent to AI SDK ToolSet.
 * Handlers are optional; when missing, execute returns unimplemented stub.
 */
import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import type { AgentToolConfig } from '@contractspec/lib.ai-agent';

export type ToolHandler = (
  input: Record<string, unknown>
) => Promise<unknown> | unknown;

function getInputSchema(_schema: Record<string, unknown> | undefined) {
  return z.object({}).passthrough();
}

/**
 * Convert AgentToolConfig array to AI SDK ToolSet.
 * When handler is missing, execute returns { status: 'unimplemented', message: 'Wire handler in host' }.
 */
export function agentToolConfigsToToolSet(
  configs: AgentToolConfig[],
  handlers?: Record<string, ToolHandler>
): ToolSet {
  const result: Record<string, ReturnType<typeof tool>> = {};

  for (const config of configs) {
    const handler = handlers?.[config.name];
    const inputSchema = getInputSchema(config.schema);

    result[config.name] = tool({
      description: config.description ?? config.name,
      inputSchema,
      execute: async (input: Record<string, unknown>) => {
        if (!handler) {
          return {
            status: 'unimplemented',
            message: 'Wire handler in host',
            toolName: config.name,
          };
        }
        try {
          const output = await Promise.resolve(handler(input));
          return typeof output === 'string' ? output : output;
        } catch (err) {
          return {
            status: 'error',
            error: err instanceof Error ? err.message : String(err),
            toolName: config.name,
          };
        }
      },
    }) as unknown as ReturnType<typeof tool>;
  }

  return result as unknown as ToolSet;
}
