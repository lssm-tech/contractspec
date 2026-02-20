/**
 * OpenCode SDK Provider
 *
 * Enables ContractSpec agents to run via OpenCode server:
 * - Session-based execution
 * - Multiple agent types (Build, Plan, General, Explore)
 * - Type-safe client interface
 * - Real-time streaming support
 *
 * This adapter wraps @opencode-ai/sdk to work as a backend
 * for ContractSpec agents.
 */

import type { AgentSpec } from '../../spec/spec';
import { agentKey } from '../../spec/spec';
import type {
  ExternalAgentProvider,
  ExternalAgentContext,
  ExternalExecuteParams,
  ExternalExecuteResult,
  ExternalStreamChunk,
  ExternalToolSet,
  OpenCodeSDKConfig,
  OpenCodeContextMetadata,
  OpenCodeAgentType,
} from '../types';
import {
  ContextCreationError,
  ProviderExecutionError,
  ProviderNotAvailableError,
} from '../types';
import {
  specToolToExternalToolForOpenCode,
  createToolHandlerMap,
  executeToolCall,
  type OpenCodeToolCall,
} from './tool-bridge';
import { inferAgentType } from './agent-bridge';
import { injectStaticKnowledge } from '../../knowledge/injector';
import { createAgentI18n } from '../../i18n';

// ============================================================================
// Provider Implementation
// ============================================================================

/**
 * OpenCode SDK Provider implementation.
 */
export class OpenCodeSDKProvider implements ExternalAgentProvider {
  readonly name = 'opencode-sdk';
  readonly version = '1.0.0';

  private config: OpenCodeSDKConfig;
  private sdkAvailable: boolean | null = null;

  constructor(config: OpenCodeSDKConfig = {}) {
    this.config = {
      serverUrl: 'http://127.0.0.1:4096',
      port: 4096,
      agentType: 'general',
      temperature: 0.7,
      timeout: 30000,
      ...config,
    };

    // Build server URL from port if not explicitly set
    if (!config.serverUrl && config.port) {
      this.config.serverUrl = `http://127.0.0.1:${config.port}`;
    }
  }

  /**
   * Check if OpenCode SDK is available.
   */
  isAvailable(): boolean {
    if (this.sdkAvailable !== null) {
      return this.sdkAvailable;
    }

    try {
      // Check if the SDK is installed
      require.resolve('@opencode-ai/sdk');
      this.sdkAvailable = true;
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
        createAgentI18n(this.config.locale).t('error.provider.sdkNotInstalled')
      );
    }

    try {
      const sdk = await this.loadSDK();

      // Create or connect to OpenCode client
      const { client } = await sdk.createOpencode({
        hostname: this.getHostname(),
        port: this.config.port ?? 4096,
        timeout: this.config.timeout,
      });

      // Create session
      const session = await client.session.create({
        agent: this.config.agentType ?? inferAgentType(spec),
        model: this.config.model,
      });

      // Build tools set
      const toolSet: ExternalToolSet = {};
      for (const tool of spec.tools) {
        toolSet[tool.name] = specToolToExternalToolForOpenCode(tool);
      }

      // Inject static knowledge into instructions
      const instructions = await injectStaticKnowledge(
        spec.instructions,
        spec.knowledge ?? [],
        undefined
      );

      const contextId = `opencode-${agentKey(spec.meta)}-${Date.now()}`;

      const metadata: OpenCodeContextMetadata = {
        sessionId: session.id,
        agentType: this.config.agentType ?? inferAgentType(spec),
        serverUrl:
          this.config.serverUrl ??
          `http://127.0.0.1:${this.config.port ?? 4096}`,
      };

      return {
        id: contextId,
        spec: {
          ...spec,
          instructions,
        },
        tools: toolSet,
        metadata: metadata as unknown as Record<string, unknown>,
        cleanup: async () => {
          // Cleanup session if needed
          try {
            await client.session.delete({ id: session.id });
          } catch {
            // Ignore cleanup errors
          }
        },
      };
    } catch (error) {
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
   * Execute a prompt using OpenCode SDK.
   */
  async execute(
    context: ExternalAgentContext,
    params: ExternalExecuteParams
  ): Promise<ExternalExecuteResult> {
    try {
      const sdk = await this.loadSDK();
      const metadata = context.metadata as unknown as OpenCodeContextMetadata;

      // Connect to existing session
      const { client } = await sdk.createOpencodeClient({
        baseUrl: metadata.serverUrl,
      });

      // Build system prompt
      const systemPrompt = params.systemOverride
        ? `${context.spec.instructions}\n\n${params.systemOverride}`
        : context.spec.instructions;

      // Execute prompt
      const response = await client.session.prompt({
        id: metadata.sessionId,
        body: {
          content: params.prompt,
          system: systemPrompt,
        },
      });

      // Extract tool calls from response
      const toolCalls = this.extractToolCalls(response);
      const toolHandlers = createToolHandlerMap(context.tools);

      // Execute tools
      const toolResults = await Promise.all(
        toolCalls.map((tc) => executeToolCall(tc, toolHandlers))
      );

      return {
        text: this.extractTextContent(response),
        toolCalls: toolCalls.map((tc) => ({
          type: 'tool-call' as const,
          toolCallId: tc.id,
          toolName: tc.name,
          args: tc.arguments,
        })),
        toolResults: toolResults.map((tr) => ({
          type: 'tool-result' as const,
          toolCallId: tr.tool_call_id,
          toolName:
            toolCalls.find((tc) => tc.id === tr.tool_call_id)?.name ?? '',
          output: tr.output,
        })),
        usage: {
          inputTokens: response.usage?.input_tokens ?? 0,
          outputTokens: response.usage?.output_tokens ?? 0,
        },
        finishReason: this.mapFinishReason(response.finish_reason),
        metadata: {
          sessionId: metadata.sessionId,
          agentType: metadata.agentType,
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
      const metadata = context.metadata as unknown as OpenCodeContextMetadata;

      const { client } = await sdk.createOpencodeClient({
        baseUrl: metadata.serverUrl,
      });

      const systemPrompt = params.systemOverride
        ? `${context.spec.instructions}\n\n${params.systemOverride}`
        : context.spec.instructions;

      // Subscribe to session events
      const events = client.session.subscribe({
        id: metadata.sessionId,
      });

      // Send prompt
      await client.session.prompt({
        id: metadata.sessionId,
        body: {
          content: params.prompt,
          system: systemPrompt,
        },
      });

      let fullText = '';
      const allToolCalls: OpenCodeToolCall[] = [];
      const toolHandlers = createToolHandlerMap(context.tools);
      let stepIndex = 0;

      for await (const event of events) {
        if (event.type === 'message.delta') {
          const text = event.delta?.content ?? '';
          fullText += text;
          yield { type: 'text', text };
        }

        if (event.type === 'tool.call') {
          const toolCall: OpenCodeToolCall = {
            id: event.tool_call_id ?? `tc-${Date.now()}`,
            name: event.tool_name ?? '',
            arguments: event.arguments ?? {},
          };
          allToolCalls.push(toolCall);
          yield {
            type: 'tool-call',
            toolCall: {
              type: 'tool-call',
              toolCallId: toolCall.id,
              toolName: toolCall.name,
              args: toolCall.arguments,
            },
          };
        }

        if (event.type === 'step.complete') {
          stepIndex++;
          yield { type: 'step-complete', stepIndex };
        }

        if (event.type === 'message.complete') {
          break;
        }
      }

      // Execute pending tools
      for (const toolCall of allToolCalls) {
        const result = await executeToolCall(toolCall, toolHandlers);
        yield {
          type: 'tool-result',
          toolResult: {
            type: 'tool-result',
            toolCallId: result.tool_call_id,
            toolName: toolCall.name,
            output: result.output,
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
            toolCallId: tc.id,
            toolName: tc.name,
            args: tc.arguments,
          })),
          toolResults: [],
          usage: { inputTokens: 0, outputTokens: 0 },
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
   * Load the OpenCode SDK dynamically.
   */
  private async loadSDK(): Promise<OpenCodeSDKInterface> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module = require('@opencode-ai/sdk');
      return module;
    } catch {
      throw new ProviderNotAvailableError(
        this.name,
        createAgentI18n(this.config.locale).t(
          'error.provider.opencodeSdkMissing'
        )
      );
    }
  }

  /**
   * Get hostname from server URL.
   */
  private getHostname(): string {
    if (!this.config.serverUrl) {
      return '127.0.0.1';
    }
    try {
      const url = new URL(this.config.serverUrl);
      return url.hostname;
    } catch {
      return '127.0.0.1';
    }
  }

  /**
   * Extract tool calls from response.
   */
  private extractToolCalls(response: {
    tool_calls?: { id: string; name: string; arguments: unknown }[];
  }): OpenCodeToolCall[] {
    if (!response.tool_calls) {
      return [];
    }

    return response.tool_calls.map((tc) => ({
      id: tc.id,
      name: tc.name,
      arguments: (tc.arguments ?? {}) as Record<string, unknown>,
    }));
  }

  /**
   * Extract text content from response.
   */
  private extractTextContent(response: {
    content?: string;
    message?: { content?: string };
  }): string {
    return response.content ?? response.message?.content ?? '';
  }

  /**
   * Map OpenCode finish reason to ContractSpec finish reason.
   */
  private mapFinishReason(
    finishReason?: string
  ): ExternalExecuteResult['finishReason'] {
    switch (finishReason) {
      case 'stop':
      case 'end':
        return 'stop';
      case 'tool_use':
      case 'tool_calls':
        return 'tool-calls';
      case 'length':
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
 * Interface for OpenCode SDK (used for dynamic import).
 */
interface OpenCodeSDKInterface {
  createOpencode(options: {
    hostname?: string;
    port?: number;
    timeout?: number;
    config?: unknown;
  }): Promise<{
    client: OpenCodeClient;
  }>;

  createOpencodeClient(options: { baseUrl: string }): Promise<{
    client: OpenCodeClient;
  }>;
}

/**
 * OpenCode client interface.
 */
interface OpenCodeClient {
  session: {
    create(options: {
      agent?: OpenCodeAgentType;
      model?: string;
    }): Promise<{ id: string }>;

    prompt(options: {
      id: string;
      body: {
        content: string;
        system?: string;
      };
    }): Promise<{
      content?: string;
      message?: { content?: string };
      tool_calls?: { id: string; name: string; arguments: unknown }[];
      usage?: { input_tokens?: number; output_tokens?: number };
      finish_reason?: string;
    }>;

    delete(options: { id: string }): Promise<void>;

    subscribe(options: { id: string }): AsyncIterable<{
      type: string;
      delta?: { content?: string };
      tool_call_id?: string;
      tool_name?: string;
      arguments?: Record<string, unknown>;
    }>;
  };

  app: {
    agents(): Promise<{ name: string; type: OpenCodeAgentType }[]>;
  };

  global: {
    health(): Promise<{ status: string }>;
  };
}
