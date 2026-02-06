/**
 * Unified Agent Wrapper
 *
 * Provides a single API surface for running agents regardless of backend:
 * - AI SDK v6 (existing ContractSpec implementation)
 * - Claude Agent SDK (@anthropic-ai/claude-agent-sdk)
 * - OpenCode SDK (@opencode-ai/sdk)
 *
 * @example
 * ```typescript
 * import { UnifiedAgent, createUnifiedAgent } from '@contractspec/lib.ai-agent';
 *
 * // Create agent with AI SDK backend (default)
 * const agent = createUnifiedAgent(mySpec, {
 *   backend: 'ai-sdk',
 * });
 *
 * // Create agent with Claude Agent SDK backend
 * const claudeAgent = createUnifiedAgent(mySpec, {
 *   backend: 'claude-agent-sdk',
 *   config: { extendedThinking: true },
 * });
 *
 * // All agents use the same API
 * const response = await agent.run('Hello');
 * ```
 */
import type { LanguageModel } from 'ai';
import type { ProviderConfig } from '@contractspec/lib.ai-providers/types';
import { createProvider } from '@contractspec/lib.ai-providers/factory';
import type { AgentSpec } from '../spec/spec';
import type {
  AgentCallOptions,
  AgentGenerateResult,
  ToolHandler,
  LanguageModelUsage,
} from '../types';
import type {
  ExternalAgentProvider,
  ClaudeAgentSDKConfig,
  OpenCodeSDKConfig,
  ExternalExecuteResult,
} from '../providers/types';

// =============================================================================
// Types
// =============================================================================

/** Supported backend types */
export type UnifiedAgentBackend =
  | 'ai-sdk'
  | 'claude-agent-sdk'
  | 'opencode-sdk';

/** Backend-specific configuration */
export interface UnifiedAgentBackendConfig {
  'ai-sdk'?: {
    model?: string;
    modelInstance?: LanguageModel;
    provider?: ProviderConfig;
    temperature?: number;
    maxTokens?: number;
  };
  'claude-agent-sdk'?: ClaudeAgentSDKConfig;
  'opencode-sdk'?: OpenCodeSDKConfig;
}

/** Unified agent configuration */
export interface UnifiedAgentConfig {
  /** Backend to use */
  backend: UnifiedAgentBackend;
  /** Backend-specific configuration */
  config?: UnifiedAgentBackendConfig[UnifiedAgentBackend];
  /** Tool handlers for the agent */
  tools?: Map<string, ToolHandler>;
  /** Fallback backend if primary fails */
  fallbackBackend?: UnifiedAgentBackend;
  /** Enable verbose logging */
  verbose?: boolean;
}

/** Unified agent run options */
export interface UnifiedAgentRunOptions extends AgentCallOptions {
  /** Override backend for this call */
  backend?: UnifiedAgentBackend;
}

/** Unified agent state */
export interface UnifiedAgentState {
  backend: UnifiedAgentBackend;
  isReady: boolean;
  sessionId?: string;
  messageCount: number;
  lastError?: Error;
}

// =============================================================================
// Unified Agent Implementation
// =============================================================================

/**
 * Unified agent that works across multiple backends.
 */
export class UnifiedAgent {
  private readonly spec: AgentSpec;
  private readonly config: UnifiedAgentConfig;
  private readonly tools: Map<string, ToolHandler>;
  private provider?: ExternalAgentProvider;
  private context?: unknown;
  private state: UnifiedAgentState;

  constructor(spec: AgentSpec, config: UnifiedAgentConfig) {
    this.spec = spec;
    this.config = config;
    this.tools = config.tools ?? new Map();
    this.state = {
      backend: config.backend,
      isReady: false,
      messageCount: 0,
    };
  }

  /**
   * Initialize the agent with its backend.
   */
  async initialize(): Promise<void> {
    const backend = this.config.backend;

    try {
      switch (backend) {
        case 'ai-sdk':
          // AI SDK is always available
          this.state.isReady = true;
          break;

        case 'claude-agent-sdk':
          await this.initializeClaudeAgentSDK();
          break;

        case 'opencode-sdk':
          await this.initializeOpenCodeSDK();
          break;

        default:
          throw new Error(`Unknown backend: ${backend}`);
      }
    } catch (error) {
      this.state.lastError =
        error instanceof Error ? error : new Error(String(error));

      // Try fallback if configured
      if (
        this.config.fallbackBackend &&
        this.config.fallbackBackend !== backend
      ) {
        console.warn(
          `[UnifiedAgent] ${backend} failed, falling back to ${this.config.fallbackBackend}`
        );
        this.state.backend = this.config.fallbackBackend;
        await this.initialize();
      } else {
        throw error;
      }
    }
  }

  private async initializeClaudeAgentSDK(): Promise<void> {
    // Dynamic import to avoid requiring the dependency
    try {
      const { ClaudeAgentSDKProvider } =
        await import('../providers/claude-agent-sdk');
      const config = this.config.config as ClaudeAgentSDKConfig | undefined;
      this.provider = new ClaudeAgentSDKProvider(config ?? {});

      if (!this.provider.isAvailable()) {
        throw new Error(
          'Claude Agent SDK not available. Install @anthropic-ai/claude-agent-sdk'
        );
      }

      this.context = await this.provider.createContext(this.spec);
      this.state.isReady = true;
    } catch (error) {
      if ((error as { code?: string }).code === 'MODULE_NOT_FOUND') {
        throw new Error(
          'Claude Agent SDK not installed. Run: npm install @anthropic-ai/claude-agent-sdk'
        );
      }
      throw error;
    }
  }

  private async initializeOpenCodeSDK(): Promise<void> {
    // Dynamic import to avoid requiring the dependency
    try {
      const { OpenCodeSDKProvider } = await import('../providers/opencode-sdk');
      const config = this.config.config as OpenCodeSDKConfig | undefined;
      this.provider = new OpenCodeSDKProvider(config ?? {});

      if (!this.provider.isAvailable()) {
        throw new Error('OpenCode SDK not available. Install @opencode-ai/sdk');
      }

      this.context = await this.provider.createContext(this.spec);
      this.state.isReady = true;
    } catch (error) {
      if ((error as { code?: string }).code === 'MODULE_NOT_FOUND') {
        throw new Error(
          'OpenCode SDK not installed. Run: npm install @opencode-ai/sdk'
        );
      }
      throw error;
    }
  }

  /**
   * Run the agent with a message.
   */
  async run(
    message: string,
    options?: UnifiedAgentRunOptions
  ): Promise<AgentGenerateResult> {
    if (!this.state.isReady) {
      await this.initialize();
    }

    const backend = options?.backend ?? this.state.backend;
    this.state.messageCount++;

    try {
      switch (backend) {
        case 'ai-sdk':
          return await this.runWithAISDK(message, options);

        case 'claude-agent-sdk':
        case 'opencode-sdk':
          return await this.runWithExternalProvider(message, options);

        default:
          throw new Error(`Unknown backend: ${backend}`);
      }
    } catch (error) {
      this.state.lastError =
        error instanceof Error ? error : new Error(String(error));
      throw error;
    }
  }

  private async runWithAISDK(
    message: string,
    options?: UnifiedAgentRunOptions
  ): Promise<AgentGenerateResult> {
    // Import the existing ContractSpec agent factory
    const { ContractSpecAgent } = await import('./contract-spec-agent');
    const model = await this.resolveAISDKModel();
    const agent = await ContractSpecAgent.create({
      spec: this.spec,
      model,
      toolHandlers: this.tools,
    });

    return await agent.generate({
      prompt: message,
      options,
    });
  }

  private async runWithExternalProvider(
    message: string,
    options?: UnifiedAgentRunOptions
  ): Promise<AgentGenerateResult> {
    if (!this.provider || !this.context) {
      throw new Error('Provider not initialized');
    }

    const result: ExternalExecuteResult = await this.provider.execute(
      this.context as Parameters<ExternalAgentProvider['execute']>[0],
      {
        prompt: message,
        options,
      }
    );

    return this.convertExternalResult(result);
  }

  private convertExternalResult(
    result: ExternalExecuteResult
  ): AgentGenerateResult {
    return {
      text: result.text,
      steps: [],
      toolCalls: result.toolCalls.map((tc) => ({
        type: 'tool-call' as const,
        toolCallId: tc.toolCallId,
        toolName: tc.toolName,
        args: tc.args,
      })),
      toolResults: result.toolResults.map((tr) => ({
        type: 'tool-result' as const,
        toolCallId: tr.toolCallId,
        toolName: tr.toolName,
        output: tr.output,
      })),
      finishReason: result.finishReason,
      usage: result.usage
        ? ({
            promptTokens: result.usage.inputTokens,
            completionTokens: result.usage.outputTokens,
            totalTokens:
              result.usage.totalTokens ??
              result.usage.inputTokens + result.usage.outputTokens,
          } as unknown as LanguageModelUsage)
        : undefined,
    };
  }

  private getAISDKConfig(): UnifiedAgentBackendConfig['ai-sdk'] | undefined {
    if (this.config.backend !== 'ai-sdk') return undefined;
    return this.config.config as UnifiedAgentBackendConfig['ai-sdk'];
  }

  private async resolveAISDKModel(): Promise<LanguageModel> {
    const backendConfig = this.getAISDKConfig();
    let model: LanguageModel;

    if (backendConfig?.modelInstance) {
      model = backendConfig.modelInstance;
    } else if (backendConfig?.provider) {
      model = createProvider(backendConfig.provider).getModel();
    } else {
      const { anthropic } = await import('@ai-sdk/anthropic');
      model = anthropic(backendConfig?.model ?? 'claude-3-5-sonnet-20240620');
    }

    return this.applyModelSettings(model, {
      temperature: backendConfig?.temperature,
      maxTokens: backendConfig?.maxTokens,
    });
  }

  private applyModelSettings(
    model: LanguageModel,
    settings: { temperature?: number; maxTokens?: number }
  ): LanguageModel {
    if (
      settings.temperature === undefined &&
      settings.maxTokens === undefined
    ) {
      return model;
    }

    const withSettings = model as LanguageModel & {
      withSettings?: (settings: Record<string, unknown>) => LanguageModel;
    };

    if (typeof withSettings.withSettings === 'function') {
      return withSettings.withSettings({
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
      });
    }

    return model;
  }

  /**
   * Get agent state.
   */
  getState(): UnifiedAgentState {
    return { ...this.state };
  }

  /**
   * Get the agent spec.
   */
  getSpec(): AgentSpec {
    return this.spec;
  }

  /**
   * Get the current backend.
   */
  getBackend(): UnifiedAgentBackend {
    return this.state.backend;
  }

  /**
   * Check if a specific backend is available.
   */
  async isBackendAvailable(backend: UnifiedAgentBackend): Promise<boolean> {
    switch (backend) {
      case 'ai-sdk':
        return true;

      case 'claude-agent-sdk':
        try {
          const { ClaudeAgentSDKProvider } =
            await import('../providers/claude-agent-sdk');
          const provider = new ClaudeAgentSDKProvider({});
          return provider.isAvailable();
        } catch {
          return false;
        }

      case 'opencode-sdk':
        try {
          const { OpenCodeSDKProvider } =
            await import('../providers/opencode-sdk');
          const provider = new OpenCodeSDKProvider({});
          return provider.isAvailable();
        } catch {
          return false;
        }

      default:
        return false;
    }
  }

  /**
   * Switch to a different backend.
   */
  async switchBackend(backend: UnifiedAgentBackend): Promise<void> {
    if (backend === this.state.backend) {
      return;
    }

    this.state.backend = backend;
    this.state.isReady = false;
    this.provider = undefined;
    this.context = undefined;

    await this.initialize();
  }

  /**
   * Reset the agent state.
   */
  reset(): void {
    this.state.messageCount = 0;
    this.state.sessionId = undefined;
    this.state.lastError = undefined;
    this.context = undefined;
  }

  /**
   * Add a tool handler.
   */
  addTool(name: string, handler: ToolHandler): void {
    this.tools.set(name, handler);
  }

  /**
   * Remove a tool handler.
   */
  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create a unified agent.
 */
export function createUnifiedAgent(
  spec: AgentSpec,
  config: UnifiedAgentConfig
): UnifiedAgent {
  return new UnifiedAgent(spec, config);
}

/**
 * Create a unified agent with AI SDK backend (default).
 */
export function createAISDKAgent(
  spec: AgentSpec,
  options?: {
    tools?: Map<string, ToolHandler>;
    model?: string;
    modelInstance?: LanguageModel;
    provider?: ProviderConfig;
    temperature?: number;
    maxTokens?: number;
  }
): UnifiedAgent {
  return new UnifiedAgent(spec, {
    backend: 'ai-sdk',
    tools: options?.tools,
    config: {
      model: options?.model,
      modelInstance: options?.modelInstance,
      provider: options?.provider,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    },
  });
}

/**
 * Create a unified agent with Claude Agent SDK backend.
 */
export function createClaudeAgentSDKAgent(
  spec: AgentSpec,
  config?: ClaudeAgentSDKConfig & {
    tools?: Map<string, ToolHandler>;
  }
): UnifiedAgent {
  const { tools, ...sdkConfig } = config ?? {};
  return new UnifiedAgent(spec, {
    backend: 'claude-agent-sdk',
    tools,
    config: sdkConfig,
  });
}

/**
 * Create a unified agent with OpenCode SDK backend.
 */
export function createOpenCodeSDKAgent(
  spec: AgentSpec,
  config?: OpenCodeSDKConfig & {
    tools?: Map<string, ToolHandler>;
  }
): UnifiedAgent {
  const { tools, ...sdkConfig } = config ?? {};
  return new UnifiedAgent(spec, {
    backend: 'opencode-sdk',
    tools,
    config: sdkConfig,
  });
}

/**
 * Get available backends.
 */
export async function getAvailableBackends(): Promise<UnifiedAgentBackend[]> {
  const backends: UnifiedAgentBackend[] = ['ai-sdk'];

  try {
    const { ClaudeAgentSDKProvider } =
      await import('../providers/claude-agent-sdk');
    const provider = new ClaudeAgentSDKProvider({});
    if (provider.isAvailable()) {
      backends.push('claude-agent-sdk');
    }
  } catch {
    // Not available
  }

  try {
    const { OpenCodeSDKProvider } = await import('../providers/opencode-sdk');
    const provider = new OpenCodeSDKProvider({});
    if (provider.isAvailable()) {
      backends.push('opencode-sdk');
    }
  } catch {
    // Not available
  }

  return backends;
}
