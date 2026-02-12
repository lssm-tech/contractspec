/**
 * Tool bridge for converting between ContractSpec and Claude Agent SDK tool formats.
 *
 * Provides bidirectional conversion:
 * - ContractSpec AgentToolConfig → Claude Agent SDK tool
 * - Claude Agent SDK tool → ContractSpec AgentToolConfig
 */

import type { AgentToolConfig } from '../../spec/spec';
import type { ToolHandler, ToolExecutionContext } from '../../types';
import type { ExternalToolDefinition } from '../types';
import { getDefaultI18n } from '../../i18n';

// ============================================================================
// Claude Agent SDK Tool Types (based on SDK API)
// ============================================================================

/**
 * Claude Agent SDK tool definition.
 * Based on Anthropic's tool format.
 */
export interface ClaudeAgentTool {
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Input schema in JSON Schema format */
  input_schema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
  /** Whether tool requires confirmation before execution */
  requires_confirmation?: boolean;
  /** Tool category for organization */
  category?: string;
}

/**
 * Claude Agent SDK tool result.
 */
export interface ClaudeAgentToolResult {
  /** Tool call ID this result corresponds to */
  tool_use_id: string;
  /** Result content */
  content: string | ClaudeAgentToolResultContent[];
  /** Whether the tool execution failed */
  is_error?: boolean;
}

/**
 * Claude Agent SDK tool result content block.
 */
export interface ClaudeAgentToolResultContent {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

// ============================================================================
// ContractSpec → Claude Agent SDK Conversion
// ============================================================================

/**
 * Convert a ContractSpec AgentToolConfig to Claude Agent SDK tool format.
 *
 * @param tool - ContractSpec tool configuration
 * @param handler - Tool handler function
 * @param context - Partial execution context to inject
 * @returns Claude Agent SDK tool definition with execute function
 */
export function specToolToClaudeAgentTool(
  tool: AgentToolConfig,
  handler: ToolHandler,
  context: Partial<ToolExecutionContext>
): ClaudeAgentTool & { execute: (input: unknown) => Promise<unknown> } {
  return {
    name: tool.name,
    description:
      tool.description ??
      getDefaultI18n().t('tool.fallbackDescription', { name: tool.name }),
    input_schema: normalizeSchema(tool.schema),
    requires_confirmation: tool.requiresApproval ?? !tool.automationSafe,
    execute: async (input: unknown) => {
      const fullContext: ToolExecutionContext = {
        agentId: context.agentId ?? 'unknown',
        sessionId: context.sessionId ?? 'unknown',
        tenantId: context.tenantId,
        actorId: context.actorId,
        metadata: context.metadata,
        signal: context.signal,
      };
      return handler(input, fullContext);
    },
  };
}

/**
 * Convert multiple ContractSpec tools to Claude Agent SDK format.
 */
export function specToolsToClaudeAgentTools(
  tools: AgentToolConfig[],
  handlers: Map<string, ToolHandler>,
  context: Partial<ToolExecutionContext>
): (ClaudeAgentTool & { execute: (input: unknown) => Promise<unknown> })[] {
  return tools
    .filter((tool) => handlers.has(tool.name))
    .map((tool) => {
      const handler = handlers.get(tool.name);
      if (!handler) {
        throw new Error(
          getDefaultI18n().t('error.handlerNotFoundForTool', {
            name: tool.name,
          })
        );
      }
      return specToolToClaudeAgentTool(tool, handler, context);
    });
}

// ============================================================================
// Claude Agent SDK → ContractSpec Conversion
// ============================================================================

/**
 * Convert a Claude Agent SDK tool to ContractSpec AgentToolConfig.
 * This enables importing tools defined in Claude Agent SDK format.
 *
 * @param claudeTool - Claude Agent SDK tool definition
 * @param execute - Optional execute function to wrap
 * @returns ContractSpec tool config and optional handler
 */
export function claudeAgentToolToSpecTool(
  claudeTool: ClaudeAgentTool,
  execute?: (input: unknown) => Promise<unknown>
): {
  config: AgentToolConfig;
  handler?: ToolHandler;
} {
  const config: AgentToolConfig = {
    name: claudeTool.name,
    description: claudeTool.description,
    schema: claudeTool.input_schema,
    requiresApproval: claudeTool.requires_confirmation,
    automationSafe: !claudeTool.requires_confirmation,
  };

  const handler: ToolHandler | undefined = execute
    ? async (input, _ctx) => String(await execute(input))
    : undefined;

  return { config, handler };
}

/**
 * Convert multiple Claude Agent SDK tools to ContractSpec format.
 */
export function claudeAgentToolsToSpecTools(
  claudeTools: (ClaudeAgentTool & {
    execute?: (input: unknown) => Promise<unknown>;
  })[]
): {
  configs: AgentToolConfig[];
  handlers: Map<string, ToolHandler>;
} {
  const configs: AgentToolConfig[] = [];
  const handlers = new Map<string, ToolHandler>();

  for (const claudeTool of claudeTools) {
    const { config, handler } = claudeAgentToolToSpecTool(
      claudeTool,
      claudeTool.execute
    );
    configs.push(config);
    if (handler) {
      handlers.set(config.name, handler);
    }
  }

  return { configs, handlers };
}

// ============================================================================
// External Tool Definition Conversion
// ============================================================================

/**
 * Convert ContractSpec tool to ExternalToolDefinition format.
 */
export function specToolToExternalTool(
  tool: AgentToolConfig,
  handler?: ToolHandler,
  context?: Partial<ToolExecutionContext>
): ExternalToolDefinition {
  return {
    name: tool.name,
    description:
      tool.description ??
      getDefaultI18n().t('tool.fallbackDescription', { name: tool.name }),
    inputSchema: tool.schema ?? { type: 'object' },
    requiresApproval: tool.requiresApproval ?? !tool.automationSafe,
    execute: handler
      ? async (input) => {
          const fullContext: ToolExecutionContext = {
            agentId: context?.agentId ?? 'unknown',
            sessionId: context?.sessionId ?? 'unknown',
            tenantId: context?.tenantId,
            actorId: context?.actorId,
            metadata: context?.metadata,
            signal: context?.signal,
          };
          return handler(input, fullContext);
        }
      : undefined,
  };
}

// ============================================================================
// Schema Normalization
// ============================================================================

/**
 * Normalize a schema to Claude Agent SDK's expected format.
 * Ensures the schema is a valid JSON Schema object type.
 */
function normalizeSchema(
  schema?: Record<string, unknown>
): ClaudeAgentTool['input_schema'] {
  if (!schema) {
    return { type: 'object' };
  }

  // If it's already an object type schema, return as-is with type assertion
  if (schema.type === 'object') {
    return schema as ClaudeAgentTool['input_schema'];
  }

  // Wrap non-object schemas in an object
  return {
    type: 'object',
    properties: {
      value: schema,
    },
    required: ['value'],
  };
}

/**
 * Extract tool call info from Claude Agent SDK response.
 */
export function extractToolCalls(response: {
  content?: {
    type: string;
    id?: string;
    name?: string;
    input?: unknown;
  }[];
}): {
  toolCallId: string;
  toolName: string;
  args: unknown;
}[] {
  if (!response.content) {
    return [];
  }

  return response.content
    .filter((block) => block.type === 'tool_use')
    .map((block) => ({
      toolCallId: block.id ?? '',
      toolName: block.name ?? '',
      args: block.input,
    }));
}
