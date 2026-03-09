/**
 * Converts AgentToolConfig from ai-agent to AI SDK ToolSet.
 * Handlers are optional; when missing, execute returns unimplemented stub.
 */
import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import type { AgentToolConfig } from '@contractspec/lib.ai-agent';
import { jsonSchemaToZodSafe } from '@contractspec/lib.ai-agent/schema/json-schema-to-zod';

export type ToolHandler = (
  input: Record<string, unknown>
) => Promise<unknown> | unknown;

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
    const inputSchema = config.schema
      ? jsonSchemaToZodSafe(config.schema)
      : z.record(z.unknown());

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
    });
  }

  return result as ToolSet;
}
