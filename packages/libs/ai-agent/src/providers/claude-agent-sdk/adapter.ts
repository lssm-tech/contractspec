/**
 * Claude Agent SDK Provider
 *
 * Enables ContractSpec agents to leverage Claude's agentic capabilities:
 * - Computer use (file editing, bash execution)
 * - Extended thinking for complex reasoning
 * - Agentic search and subagents
 * - MCP server integration
 *
 * This adapter wraps @anthropic-ai/claude-agent-sdk to work as a backend
 * for ContractSpec agents.
 */

import { randomUUID } from 'node:crypto';
import type { Tool } from 'ai';
import type { AgentSpec } from '../../spec/spec';
import { agentKey } from '../../spec/spec';
import type {
  ExternalAgentProvider,
  ExternalAgentContext,
  ExternalExecuteParams,
  ExternalExecuteResult,
  ExternalStreamChunk,
  ExternalToolSet,
  ClaudeAgentSDKConfig,
  ClaudeAgentContextMetadata,
} from '../types';
import {
  ContextCreationError,
  ProviderExecutionError,
  ProviderNotAvailableError,
} from '../types';
import { specToolToExternalTool, extractToolCalls } from './tool-bridge';
import {
  buildClaudeAgentContext,
  createEmptyClaudeSession,
  appendUserMessage,
  appendAssistantMessage,
  type ClaudeAgentSessionState,
  type ClaudeAgentContentBlock,
} from './session-bridge';
import { injectStaticKnowledge } from '../../knowledge/injector';
import { createMcpToolsets } from '../../tools/mcp-client';
import { createAgentI18n } from '../../i18n';

// ============================================================================
// Provider Implementation
// ============================================================================

/**
 * Claude Agent SDK Provider implementation.
 */
export class ClaudeAgentSDKProvider implements ExternalAgentProvider {
  readonly name = 'claude-agent-sdk';
  readonly version = '1.0.0';

  private config: ClaudeAgentSDKConfig;
  private sdkAvailable: boolean | null = null;

  constructor(config: ClaudeAgentSDKConfig = {}) {
    this.config = {
      model: 'claude-sonnet-4-20250514',
      extendedThinking: false,
      computerUse: false,
      maxTokens: 4096,
      temperature: 0.7,
      ...config,
    };
  }

  /**
   * Check if Claude Agent SDK is available.
   */
  isAvailable(): boolean {
    if (this.sdkAvailable !== null) {
      return this.sdkAvailable;
    }

    try {
      // Check if the SDK is installed
      require.resolve('@anthropic-ai/claude-agent-sdk');

      // Check for API key
      const apiKey = this.config.apiKey ?? process.env.ANTHROPIC_API_KEY;
      this.sdkAvailable = Boolean(apiKey);
    } catch {
      this.sdkAvailable = false;
    }

    return this.sdkAvailable;
  }

  /**
   * Create an execution context from an AgentSpec.
   */
  async createContext(spec: AgentSpec): Promise<ExternalAgentContext> {
    if (!this.isAvailable()) {
      throw new ProviderNotAvailableError(
        this.name,
        createAgentI18n(this.config.locale).t('error.provider.sdkNotConfigured')
      );
    }

    let mcpToolset: Awaited<ReturnType<typeof createMcpToolsets>> | null = null;

    try {
      // Build tools set
      const toolSet: ExternalToolSet = {};
      for (const tool of spec.tools) {
        toolSet[tool.name] = specToolToExternalTool(tool);
      }

      if ((this.config.mcpServers?.length ?? 0) > 0) {
        mcpToolset = await createMcpToolsets(this.config.mcpServers ?? [], {
          onNameCollision: 'error',
        });

        for (const [toolName, mcpTool] of Object.entries(mcpToolset.tools)) {
          if (toolSet[toolName]) {
            throw new Error(
              `MCP tool "${toolName}" collides with a ContractSpec tool. Configure MCP toolPrefix values to avoid collisions.`
            );
          }

          toolSet[toolName] = this.mcpToolToExternalTool(toolName, mcpTool);
        }
      }

      // Inject static knowledge into instructions
      const instructions = await injectStaticKnowledge(
        spec.instructions,
        spec.knowledge ?? [],
        undefined // Knowledge retriever would be passed if available
      );

      const contextId = `claude-${agentKey(spec.meta)}-${Date.now()}`;

      const metadata: ClaudeAgentContextMetadata = {
        computerUseEnabled: this.config.computerUse ?? false,
        extendedThinkingEnabled: this.config.extendedThinking ?? false,
        mcpServerIds: this.config.mcpServers?.map((s) => s.name) ?? [],
      };

      const cleanupMcp = mcpToolset?.cleanup;

      return {
        id: contextId,
        spec: {
          ...spec,
          instructions, // Use knowledge-injected instructions
        },
        tools: toolSet,
        metadata,
        cleanup: async () => {
          if (cleanupMcp) {
            await cleanupMcp();
          }
        },
      };
    } catch (error) {
      if (mcpToolset) {
        await mcpToolset.cleanup().catch(() => undefined);
      }

      throw new ContextCreationError(
        this.name,
        createAgentI18n(this.config.locale).t(
          'error.provider.contextCreation',
          {
            error: error instanceof Error ? error.message : String(error),
          }
        ),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Execute a prompt using Claude Agent SDK.
   */
  async execute(
    context: ExternalAgentContext,
    params: ExternalExecuteParams
  ): Promise<ExternalExecuteResult> {
    try {
      // Dynamic import of Claude Agent SDK
      const sdk = await this.loadSDK();

      // Build system prompt
      const systemPrompt = params.systemOverride
        ? `${context.spec.instructions}\n\n${params.systemOverride}`
        : context.spec.instructions;

      // Build Claude Agent SDK context
      const claudeContext = buildClaudeAgentContext(params.options);

      // Create session state
      let session: ClaudeAgentSessionState = createEmptyClaudeSession();
      session = appendUserMessage(session, params.prompt);

      // Prepare tools for Claude Agent SDK
      const claudeTools = this.prepareToolsForSDK(context);

      // Execute via SDK
      // Execute via SDK
      const rawResponse = await sdk.execute({
        model: this.config.model,
        system: systemPrompt,
        messages: session.messages,
        tools: claudeTools,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        metadata: claudeContext,
        extended_thinking: this.config.extendedThinking,
        computer_use: this.config.computerUse,
      });

      // Define expected response shape manually since direct import is tricky with dynamic import
      interface InternalClaudeResponse {
        content?: {
          type: string;
          id?: string;
          name?: string;
          input?: unknown;
          text?: string;
        }[];
        usage?: {
          input_tokens?: number;
          output_tokens?: number;
        };
        stop_reason?: string;
        model?: string;
      }

      const response = rawResponse as unknown as InternalClaudeResponse;

      // Extract tool calls and results
      const toolCalls = extractToolCalls(response);
      const toolResults = await this.executeTools(toolCalls, context, params);

      // Update session with assistant response
      if (response.content) {
        // cast content to expected type
        const content =
          response.content as unknown as ClaudeAgentContentBlock[];
        session = appendAssistantMessage(session, content);
      }

      return {
        text: this.extractTextContent(response),
        toolCalls: toolCalls.map((tc) => ({
          type: 'tool-call' as const,
          toolCallId: tc.toolCallId,
          toolName: tc.toolName,
          args: tc.args,
        })),
        toolResults: toolResults.map((tr) => ({
          type: 'tool-result' as const,
          toolCallId: tr.toolCallId,
          toolName: tr.toolName,
          output: tr.output,
        })),
        usage: {
          inputTokens: response.usage?.input_tokens ?? 0,
          outputTokens: response.usage?.output_tokens ?? 0,
        },
        finishReason: this.mapStopReason(response.stop_reason),
        metadata: {
          sessionId: (context.metadata as ClaudeAgentContextMetadata)
            ?.sessionId,
          model: response.model,
        },
      };
    } catch (error) {
      throw new ProviderExecutionError(
        this.name,
        createAgentI18n(this.config.locale).t(
          'error.provider.executionFailed',
          {
            error: error instanceof Error ? error.message : String(error),
          }
        ),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Stream execution with real-time updates.
   */
  async *stream(
    context: ExternalAgentContext,
    params: ExternalExecuteParams
  ): AsyncIterable<ExternalStreamChunk> {
    try {
      const sdk = await this.loadSDK();

      const systemPrompt = params.systemOverride
        ? `${context.spec.instructions}\n\n${params.systemOverride}`
        : context.spec.instructions;

      const claudeContext = buildClaudeAgentContext(params.options);
      const claudeTools = this.prepareToolsForSDK(context);

      const stream = await sdk.stream({
        model: this.config.model,
        system: systemPrompt,
        messages: [{ role: 'user', content: params.prompt }],
        tools: claudeTools,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        metadata: claudeContext,
        extended_thinking: this.config.extendedThinking,
        computer_use: this.config.computerUse,
      });

      let fullText = '';
      const allToolCalls: {
        toolCallId: string;
        toolName: string;
        args: unknown;
      }[] = [];
      const allToolResults: {
        toolCallId: string;
        toolName: string;
        output: unknown;
      }[] = [];
      let stepIndex = 0;

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta?.type === 'text_delta'
        ) {
          const text = event.delta.text ?? '';
          fullText += text;
          yield { type: 'text', text };
        }

        if (
          event.type === 'content_block_start' &&
          event.content_block?.type === 'tool_use'
        ) {
          const toolCall = {
            toolCallId: event.content_block.id ?? '',
            toolName: event.content_block.name ?? '',
            args: event.content_block.input,
          };
          allToolCalls.push(toolCall);
          yield {
            type: 'tool-call',
            toolCall: {
              type: 'tool-call',
              ...toolCall,
            },
          };
        }

        if (event.type === 'message_stop') {
          stepIndex++;
          yield { type: 'step-complete', stepIndex };
        }
      }

      // Execute any pending tools
      for (const toolCall of allToolCalls) {
        const result = await this.executeTool(toolCall, context, params);
        allToolResults.push(result);
        yield {
          type: 'tool-result',
          toolResult: {
            type: 'tool-result',
            ...result,
          },
        };
      }

      // Final done event
      yield {
        type: 'done',
        result: {
          text: fullText,
          toolCalls: allToolCalls.map((tc) => ({
            type: 'tool-call' as const,
            ...tc,
          })),
          toolResults: allToolResults.map((tr) => ({
            type: 'tool-result' as const,
            ...tr,
          })),
          usage: { inputTokens: 0, outputTokens: 0 }, // Not available in stream
          finishReason: 'stop',
        },
      };
    } catch (error) {
      throw new ProviderExecutionError(
        this.name,
        createAgentI18n(this.config.locale).t('error.provider.streamFailed', {
          error: error instanceof Error ? error.message : String(error),
        }),
        error instanceof Error ? error : undefined
      );
    }
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  /**
   * Load the Claude Agent SDK dynamically.
   */
  private async loadSDK(): Promise<ClaudeAgentSDKInterface> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module = require('@anthropic-ai/claude-agent-sdk');
      return module.default ?? module;
    } catch {
      throw new ProviderNotAvailableError(
        this.name,
        createAgentI18n(this.config.locale).t('error.provider.claudeSdkMissing')
      );
    }
  }

  /**
   * Prepare tools for Claude Agent SDK format.
   */
  private prepareToolsForSDK(context: ExternalAgentContext): unknown[] {
    const i18n = createAgentI18n(this.config.locale);
    const toolsForSdk: unknown[] = [];

    for (const [toolName, externalTool] of Object.entries(context.tools)) {
      if (!externalTool.execute) {
        continue;
      }

      toolsForSdk.push({
        name: toolName,
        description:
          externalTool.description ??
          i18n.t('tool.fallbackDescription', { name: toolName }),
        input_schema: this.normalizeToolSchemaForClaude(
          externalTool.inputSchema
        ),
        requires_confirmation: externalTool.requiresApproval,
        execute: async (input: unknown) => {
          const result = await externalTool.execute?.(input);
          return typeof result === 'string' ? result : JSON.stringify(result);
        },
      });
    }

    return toolsForSdk;
  }

  private mcpToolToExternalTool(
    toolName: string,
    tool: Tool<unknown, unknown>
  ): ExternalToolSet[string] {
    return {
      name: toolName,
      description:
        tool.description ??
        createAgentI18n(this.config.locale).t('tool.fallbackDescription', {
          name: toolName,
        }),
      inputSchema: this.normalizeExternalInputSchema(
        (tool as { inputSchema?: unknown }).inputSchema
      ),
      execute: async (input: unknown) => {
        if (!tool.execute) {
          throw new Error(
            createAgentI18n(this.config.locale).t(
              'error.toolNoExecuteHandler',
              {
                name: toolName,
              }
            )
          );
        }

        return tool.execute(input, {
          toolCallId: `mcp-${randomUUID()}`,
          messages: [],
        });
      },
    };
  }

  private normalizeExternalInputSchema(
    schema: unknown
  ): Record<string, unknown> {
    if (this.isRecord(schema)) {
      const type = schema['type'];
      if (type === 'object' || schema['properties']) {
        return schema;
      }
    }

    return {
      type: 'object',
      properties: {},
    };
  }

  private normalizeToolSchemaForClaude(schema: Record<string, unknown>): {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  } {
    if (schema.type === 'object') {
      return {
        type: 'object',
        properties: schema.properties as Record<string, unknown> | undefined,
        required: schema.required as string[] | undefined,
        additionalProperties: schema.additionalProperties as
          | boolean
          | undefined,
      };
    }

    return {
      type: 'object',
      properties: {
        value: schema,
      },
      required: ['value'],
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  /**
   * Execute a single tool.
   */
  private async executeTool(
    toolCall: { toolCallId: string; toolName: string; args: unknown },
    context: ExternalAgentContext,
    _params: ExternalExecuteParams
  ): Promise<{ toolCallId: string; toolName: string; output: unknown }> {
    const tool = context.tools[toolCall.toolName];
    if (!tool?.execute) {
      return {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        output: createAgentI18n(this.config.locale).t(
          'error.toolNotFoundOrNoHandler',
          {
            name: toolCall.toolName,
          }
        ),
      };
    }

    try {
      const output = await tool.execute(toolCall.args);
      return {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        output,
      };
    } catch (error) {
      return {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Execute multiple tools.
   */
  private async executeTools(
    toolCalls: { toolCallId: string; toolName: string; args: unknown }[],
    context: ExternalAgentContext,
    params: ExternalExecuteParams
  ): Promise<{ toolCallId: string; toolName: string; output: unknown }[]> {
    return Promise.all(
      toolCalls.map((tc) => this.executeTool(tc, context, params))
    );
  }

  /**
   * Extract text content from response.
   */
  private extractTextContent(response: { content?: unknown[] }): string {
    if (!response.content) {
      return '';
    }

    return response.content
      .filter(
        (block): block is { type: 'text'; text: string } =>
          typeof block === 'object' &&
          block !== null &&
          (block as { type?: string }).type === 'text'
      )
      .map((block) => block.text)
      .join('');
  }

  /**
   * Map Claude Agent SDK stop reason to ContractSpec finish reason.
   */
  private mapStopReason(
    stopReason?: string
  ): ExternalExecuteResult['finishReason'] {
    switch (stopReason) {
      case 'end_turn':
      case 'stop_sequence':
        return 'stop';
      case 'tool_use':
        return 'tool-calls';
      case 'max_tokens':
        return 'length';
      default:
        return 'stop';
    }
  }
}

// ============================================================================
// SDK Interface Type (for dynamic import)
// ============================================================================

/**
 * Interface for Claude Agent SDK (used for dynamic import).
 */
interface ClaudeAgentSDKInterface {
  execute(options: {
    model?: string;
    system?: string;
    messages: unknown[];
    tools?: unknown[];
    max_tokens?: number;
    temperature?: number;
    metadata?: Record<string, unknown>;
    extended_thinking?: boolean;
    computer_use?: boolean;
  }): Promise<{
    content?: unknown[];
    usage?: { input_tokens?: number; output_tokens?: number };
    stop_reason?: string;
    model?: string;
  }>;

  stream(options: {
    model?: string;
    system?: string;
    messages: unknown[];
    tools?: unknown[];
    max_tokens?: number;
    temperature?: number;
    metadata?: Record<string, unknown>;
    extended_thinking?: boolean;
    computer_use?: boolean;
  }): AsyncIterable<{
    type: string;
    delta?: { type?: string; text?: string };
    content_block?: {
      type?: string;
      id?: string;
      name?: string;
      input?: unknown;
    };
  }>;
}
