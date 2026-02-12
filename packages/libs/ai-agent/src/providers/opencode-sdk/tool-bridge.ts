/**
 * Tool bridge for converting between ContractSpec and OpenCode SDK tool formats.
 */

import type { AgentToolConfig } from '../../spec/spec';
import type { ToolHandler, ToolExecutionContext } from '../../types';
import type { ExternalToolDefinition } from '../types';
import { getDefaultI18n } from '../../i18n';

// ============================================================================
// OpenCode SDK Tool Types
// ============================================================================

/**
 * OpenCode SDK tool definition.
 */
export interface OpenCodeTool {
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Input parameters schema */
  parameters: {
    type: 'object';
    properties?: Record<string, OpenCodeParameter>;
    required?: string[];
  };
  /** Tool category */
  category?: string;
  /** Permission level */
  permission?: 'allow' | 'ask' | 'deny';
}

/**
 * OpenCode parameter definition.
 */
export interface OpenCodeParameter {
  type: string;
  description?: string;
  enum?: string[];
  default?: unknown;
}

/**
 * OpenCode tool call from session.
 */
export interface OpenCodeToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * OpenCode tool result.
 */
export interface OpenCodeToolResult {
  tool_call_id: string;
  output: string;
  is_error?: boolean;
}

// ============================================================================
// ContractSpec → OpenCode Conversion
// ============================================================================

/**
 * Convert a ContractSpec AgentToolConfig to OpenCode tool format.
 */
export function specToolToOpenCodeTool(tool: AgentToolConfig): OpenCodeTool {
  return {
    name: tool.name,
    description:
      tool.description ??
      getDefaultI18n().t('tool.fallbackDescription', { name: tool.name }),
    parameters: normalizeToOpenCodeParameters(tool.schema),
    // category property not in AgentToolConfig
    permission: getPermissionLevel(tool),
  };
}

/**
 * Convert multiple ContractSpec tools to OpenCode format.
 */
export function specToolsToOpenCodeTools(
  tools: AgentToolConfig[]
): OpenCodeTool[] {
  return tools.map(specToolToOpenCodeTool);
}

/**
 * Determine permission level from tool config.
 */
function getPermissionLevel(tool: AgentToolConfig): OpenCodeTool['permission'] {
  if (tool.requiresApproval) {
    return 'ask';
  }
  if (tool.automationSafe === false) {
    return 'ask';
  }
  return 'allow';
}

// ============================================================================
// OpenCode → ContractSpec Conversion
// ============================================================================

/**
 * Convert an OpenCode tool to ContractSpec AgentToolConfig.
 */
export function openCodeToolToSpecTool(
  openCodeTool: OpenCodeTool
): AgentToolConfig {
  return {
    name: openCodeTool.name,
    description: openCodeTool.description,
    schema: openCodeTool.parameters,
    requiresApproval: openCodeTool.permission === 'ask',
    automationSafe: openCodeTool.permission === 'allow',
    // category property not in AgentToolConfig
  };
}

/**
 * Convert multiple OpenCode tools to ContractSpec format.
 */
export function openCodeToolsToSpecTools(
  openCodeTools: OpenCodeTool[]
): AgentToolConfig[] {
  return openCodeTools.map(openCodeToolToSpecTool);
}

// ============================================================================
// External Tool Definition Conversion
// ============================================================================

/**
 * Convert ContractSpec tool to ExternalToolDefinition format for OpenCode.
 */
export function specToolToExternalToolForOpenCode(
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
// Schema Conversion
// ============================================================================

/**
 * Normalize a schema to OpenCode's expected parameter format.
 */
function normalizeToOpenCodeParameters(
  schema?: Record<string, unknown>
): OpenCodeTool['parameters'] {
  if (!schema) {
    return { type: 'object' };
  }

  // Already in correct format
  if (schema.type === 'object') {
    return {
      type: 'object',
      properties: schema.properties as
        | Record<string, OpenCodeParameter>
        | undefined,
      required: schema.required as string[] | undefined,
    };
  }

  // Wrap non-object schemas
  return {
    type: 'object',
    properties: {
      value: convertToOpenCodeParameter(schema),
    },
    required: ['value'],
  };
}

/**
 * Convert a JSON Schema property to OpenCode parameter format.
 */
function convertToOpenCodeParameter(
  schema: Record<string, unknown>
): OpenCodeParameter {
  const param: OpenCodeParameter = {
    type: (schema.type as string) ?? 'string',
  };

  if (schema.description) {
    param.description = schema.description as string;
  }

  if (schema.enum) {
    param.enum = schema.enum as string[];
  }

  if (schema.default !== undefined) {
    param.default = schema.default;
  }

  return param;
}

// ============================================================================
// Tool Execution Helpers
// ============================================================================

/**
 * Create a tool handler map from ExternalToolSet.
 */
export function createToolHandlerMap(
  tools: Record<string, ExternalToolDefinition>
): Map<string, (input: unknown) => Promise<unknown>> {
  const handlers = new Map<string, (input: unknown) => Promise<unknown>>();

  for (const [name, tool] of Object.entries(tools)) {
    if (tool.execute) {
      handlers.set(name, tool.execute);
    }
  }

  return handlers;
}

/**
 * Execute a tool call and format the result.
 */
export async function executeToolCall(
  toolCall: OpenCodeToolCall,
  handlers: Map<string, (input: unknown) => Promise<unknown>>
): Promise<OpenCodeToolResult> {
  const handler = handlers.get(toolCall.name);

  if (!handler) {
    return {
      tool_call_id: toolCall.id,
      output: getDefaultI18n().t('error.toolNotFoundOrNoHandler', {
        name: toolCall.name,
      }),
      is_error: true,
    };
  }

  try {
    const result = await handler(toolCall.arguments);
    return {
      tool_call_id: toolCall.id,
      output: typeof result === 'string' ? result : JSON.stringify(result),
    };
  } catch (error) {
    return {
      tool_call_id: toolCall.id,
      output: `Error: ${error instanceof Error ? error.message : String(error)}`,
      is_error: true,
    };
  }
}
