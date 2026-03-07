/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool, type Tool } from 'ai';
import type { AgentToolConfig } from '../spec/spec';
import type { ToolExecutionContext, ToolHandler } from '../types';
import { jsonSchemaToZodSafe } from '../schema/json-schema-to-zod';
import { createAgentI18n } from '../i18n';

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
  let lastInvocationAt: number | undefined;

  return tool({
    description: specTool.description ?? specTool.name,
    // AI SDK v6 uses inputSchema instead of parameters
    inputSchema: jsonSchemaToZodSafe(specTool.schema),
    // AI SDK v6 native approval support
    needsApproval: specTool.requiresApproval ?? !specTool.automationSafe,
    execute: async (input) => {
      const now = Date.now();
      const cooldownMs = normalizeDuration(specTool.cooldownMs);
      if (cooldownMs && lastInvocationAt !== undefined) {
        const elapsed = now - lastInvocationAt;
        if (elapsed < cooldownMs) {
          const retryAfterMs = cooldownMs - elapsed;
          throw createToolExecutionError(
            `Tool "${specTool.name}" is cooling down. Retry in ${retryAfterMs}ms.`,
            'TOOL_COOLDOWN_ACTIVE',
            retryAfterMs
          );
        }
      }

      const timeoutMs = normalizeDuration(specTool.timeoutMs);
      const { signal, dispose } = createTimeoutSignal(
        context.signal,
        timeoutMs
      );

      try {
        const execution = handler(input, {
          agentId: context.agentId ?? 'unknown',
          sessionId: context.sessionId ?? 'unknown',
          tenantId: context.tenantId,
          actorId: context.actorId,
          locale: context.locale,
          metadata: context.metadata,
          signal,
        });

        const result = timeoutMs
          ? await withTimeout(execution, timeoutMs, specTool.name)
          : await execution;

        return typeof result === 'string' ? result : JSON.stringify(result);
      } finally {
        dispose();
        lastInvocationAt = Date.now();
      }
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
      throw new Error(
        createAgentI18n(context.locale).t('error.missingToolHandler', {
          name: specTool.name,
        })
      );
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

function normalizeDuration(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isFinite(value)) {
    return undefined;
  }

  if (value <= 0) {
    return undefined;
  }

  return Math.round(value);
}

function withTimeout<T>(
  execution: Promise<T>,
  timeoutMs: number,
  toolName: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutHandle = setTimeout(() => {
      reject(
        createToolExecutionError(
          `Tool "${toolName}" timed out after ${timeoutMs}ms.`,
          'TOOL_EXECUTION_TIMEOUT'
        )
      );
    }, timeoutMs);

    execution
      .then((result) => {
        clearTimeout(timeoutHandle);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutHandle);
        reject(error);
      });
  });
}

function createTimeoutSignal(
  signal: AbortSignal | undefined,
  timeoutMs?: number
) {
  const controller = new AbortController();
  const abortFromSource = () => controller.abort();

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', abortFromSource);
    }
  }

  const timeoutHandle =
    timeoutMs !== undefined
      ? setTimeout(() => {
          controller.abort();
        }, timeoutMs)
      : undefined;

  return {
    signal: controller.signal,
    dispose: () => {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
      if (signal) {
        signal.removeEventListener('abort', abortFromSource);
      }
    },
  };
}

function createToolExecutionError(
  message: string,
  code: string,
  retryAfterMs?: number
) {
  return Object.assign(new Error(message), {
    code,
    kind: 'retryable',
    retryAfterMs,
  });
}
