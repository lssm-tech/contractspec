/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool, type Tool } from 'ai';
import type { AgentToolConfig } from '../spec/spec';
import type { ToolExecutionContext, ToolHandler } from '../types';
import { jsonSchemaToZodSafe } from '../schema/json-schema-to-zod';

/**
 * Convert ContractSpec AgentToolConfig to AI SDK CoreTool.
 *
 * @param specTool - The tool configuration from AgentSpec
 * @param handler - The handler function for the tool
 * @param context - Partial context to inject into handler calls
 * @returns AI SDK CoreTool
 */
export function specToolToAISDKTool(
  specTool: AgentToolConfig,
  handler: ToolHandler,
  context: Partial<ToolExecutionContext> = {}
): Tool<any, any> {
  return tool({
    description: specTool.description ?? specTool.name,
    // AI SDK v6 uses inputSchema instead of parameters
    inputSchema: jsonSchemaToZodSafe(specTool.schema),
    // AI SDK v6 native approval support
    needsApproval: specTool.requiresApproval ?? !specTool.automationSafe,
    execute: async (input) => {
      const result = await handler(input, {
        agentId: context.agentId ?? 'unknown',
        sessionId: context.sessionId ?? 'unknown',
        tenantId: context.tenantId,
        actorId: context.actorId,
        metadata: context.metadata,
        signal: context.signal,
      });
      return typeof result === 'string' ? result : JSON.stringify(result);
    },
  });
}

/**
 * Convert multiple ContractSpec tool configs to AI SDK tools.
 *
 * @param specTools - Array of tool configurations
 * @param handlers - Map of tool name to handler function
 * @param context - Partial context to inject into handler calls
 * @returns Record of AI SDK tools keyed by name
 */
export function specToolsToAISDKTools(
  specTools: AgentToolConfig[],
  handlers: Map<string, ToolHandler>,
  context: Partial<ToolExecutionContext> = {}
): Record<string, Tool<any, any>> {
  const tools: Record<string, Tool<any, any>> = {};

  for (const specTool of specTools) {
    const handler = handlers.get(specTool.name);
    if (!handler) {
      throw new Error(`Missing handler for tool: ${specTool.name}`);
    }

    tools[specTool.name] = specToolToAISDKTool(specTool, handler, context);
  }

  return tools;
}

/**
 * Type-safe tool handler builder.
 *
 * @example
 * ```typescript
 * const handler = createToolHandler<{ query: string }>((input, ctx) => {
 *   return `Searched for: ${input.query}`;
 * });
 * ```
 */
export function createToolHandler<TInput = unknown, TOutput = string>(
  handler: (
    input: TInput,
    context: ToolExecutionContext
  ) => Promise<TOutput> | TOutput
): ToolHandler<TInput, TOutput> {
  return async (input, context) => {
    return handler(input as TInput, context);
  };
}

/**
 * Build a tool handlers map from an object.
 *
 * @example
 * ```typescript
 * const handlers = buildToolHandlers({
 *   search: async (input: { query: string }) => `Found: ${input.query}`,
 *   calculate: async (input: { a: number, b: number }) => `${input.a + input.b}`,
 * });
 * ```
 */
export function buildToolHandlers(
  handlersObj: Record<string, ToolHandler>
): Map<string, ToolHandler> {
  return new Map(Object.entries(handlersObj));
}
