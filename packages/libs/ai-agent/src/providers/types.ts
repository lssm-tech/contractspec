/**
 * External SDK provider types for ContractSpec agents.
 *
 * These interfaces define the contract for integrating external agent SDKs
 * (like @anthropic-ai/claude-agent-sdk and @opencode-ai/sdk) with ContractSpec's
 * agent system.
 */

import type { AgentSpec } from '../spec/spec';
import type {
  AgentCallOptions,
  AgentFinishReason,
  ToolCallInfo,
  ToolResultInfo,
} from '../types';
import type { McpClientConfig } from '../tools/mcp-client';
import { createAgentI18n } from '../i18n';

// ============================================================================
// Core Provider Interface
// ============================================================================

/**
 * External SDK provider interface for ContractSpec agents.
 * Allows external SDKs to be used as execution backends.
 */
export interface ExternalAgentProvider {
  /** Provider name identifier */
  readonly name: string;
  /** Provider version */
  readonly version: string;

  /**
   * Check if this provider is available (dependencies installed, configured).
   * Should be a quick synchronous check.
   */
  isAvailable(): boolean;

  /**
   * Create an execution context from an AgentSpec.
   * This prepares the provider for execution with the given spec.
   */
  createContext(spec: AgentSpec): Promise<ExternalAgentContext>;

  /**
   * Execute a prompt using this provider.
   * Non-streaming execution that returns the complete result.
   */
  execute(
    context: ExternalAgentContext,
    params: ExternalExecuteParams
  ): Promise<ExternalExecuteResult>;

  /**
   * Stream execution with real-time updates.
   * Returns an async iterable of stream chunks.
   */
  stream(
    context: ExternalAgentContext,
    params: ExternalExecuteParams
  ): AsyncIterable<ExternalStreamChunk>;
}

// ============================================================================
// Context and Execution Types
// ============================================================================

/**
 * Execution context created by a provider.
 * Holds the prepared state for executing prompts.
 */
export interface ExternalAgentContext {
  /** Unique context ID */
  id: string;
  /** The spec this context was created from */
  spec: AgentSpec;
  /** Tools available in this context */
  tools: ExternalToolSet;
  /** Cleanup function to release resources */
  cleanup: () => Promise<void>;
  /** Provider-specific metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Parameters for executing a prompt.
 */
export interface ExternalExecuteParams {
  /** The prompt to execute */
  prompt: string;
  /** Optional system prompt override/addition */
  systemOverride?: string;
  /** Call options (tenant, actor, session, metadata) */
  options?: AgentCallOptions;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  /** Maximum steps/iterations (provider may interpret differently) */
  maxSteps?: number;
}

/**
 * Result from a non-streaming execution.
 */
export interface ExternalExecuteResult {
  /** Final text response */
  text: string;
  /** Tool calls made during execution */
  toolCalls: ToolCallInfo[];
  /** Results from tool executions */
  toolResults: ToolResultInfo[];
  /** Token usage statistics */
  usage?: ExternalUsage;
  /** Reason the execution finished */
  finishReason: AgentFinishReason;
  /** Provider-specific result metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Token usage statistics.
 */
export interface ExternalUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
}

/**
 * Stream chunk from streaming execution.
 */
export interface ExternalStreamChunk {
  /** Chunk type */
  type: 'text' | 'tool-call' | 'tool-result' | 'step-complete' | 'done';
  /** Text content (for text chunks) */
  text?: string;
  /** Tool call info (for tool-call chunks) */
  toolCall?: ToolCallInfo;
  /** Tool result info (for tool-result chunks) */
  toolResult?: ToolResultInfo;
  /** Step index (for step-complete chunks) */
  stepIndex?: number;
  /** Final result (for done chunks) */
  result?: ExternalExecuteResult;
}

/**
 * Set of tools available to an external provider.
 */
export type ExternalToolSet = Record<string, ExternalToolDefinition>;

/**
 * External tool definition in a provider-agnostic format.
 */
export interface ExternalToolDefinition {
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Input schema (JSON Schema format) */
  inputSchema: Record<string, unknown>;
  /** Whether tool requires user approval */
  requiresApproval?: boolean;
  /** Tool handler function */
  execute?: (input: unknown) => Promise<unknown>;
}

// ============================================================================
// Claude Agent SDK Configuration
// ============================================================================

/**
 * Configuration for Claude Agent SDK provider.
 */
export interface ClaudeAgentSDKConfig {
  /** API key (defaults to ANTHROPIC_API_KEY env var) */
  apiKey?: string;
  /** Model to use (defaults to claude-sonnet-4-20250514) */
  model?: string;
  /** Enable extended thinking mode */
  extendedThinking?: boolean;
  /** Enable computer use capabilities (file editing, bash) */
  computerUse?: boolean;
  /** MCP servers to connect (stdio, sse, or http transports) */
  mcpServers?: McpClientConfig[];
  /** Maximum tokens for response */
  maxTokens?: number;
  /** Temperature for generation */
  temperature?: number;
  /** Locale for i18n (BCP 47). Falls back to 'en'. */
  locale?: string;
}

/**
 * Claude Agent SDK specific context metadata.
 */
export interface ClaudeAgentContextMetadata {
  /** Session ID for Claude Agent SDK */
  sessionId?: string;
  /** Whether computer use is enabled */
  computerUseEnabled: boolean;
  /** Whether extended thinking is enabled */
  extendedThinkingEnabled: boolean;
  /** Connected MCP servers */
  mcpServerIds?: string[];
  /** Allow additional metadata properties */
  [key: string]: unknown;
}

// ============================================================================
// OpenCode SDK Configuration
// ============================================================================

/**
 * Configuration for OpenCode SDK provider.
 */
export interface OpenCodeSDKConfig {
  /** Server URL (defaults to http://127.0.0.1:4096) */
  serverUrl?: string;
  /** Server port (alternative to full URL) */
  port?: number;
  /** Agent type to use */
  agentType?: OpenCodeAgentType;
  /** Session ID for resuming sessions */
  sessionId?: string;
  /** Model to use */
  model?: string;
  /** Temperature for generation */
  temperature?: number;
  /** Connection timeout in milliseconds */
  timeout?: number;
  /** Locale for i18n (BCP 47). Falls back to 'en'. */
  locale?: string;
}

/**
 * OpenCode agent types.
 */
export type OpenCodeAgentType = 'build' | 'plan' | 'general' | 'explore';

/**
 * OpenCode SDK specific context metadata.
 */
export interface OpenCodeContextMetadata {
  /** Session ID from OpenCode */
  sessionId: string;
  /** Agent type being used */
  agentType: OpenCodeAgentType;
  /** Server URL */
  serverUrl: string;
}

// ============================================================================
// Provider Factory Types
// ============================================================================

/**
 * Factory function type for creating providers.
 */
export type ExternalProviderFactory<TConfig> = (
  config: TConfig
) => ExternalAgentProvider;

/**
 * Registry of available providers.
 */
export interface ProviderRegistry {
  /** Get a provider by name */
  get(name: string): ExternalAgentProvider | undefined;
  /** Register a provider */
  register(name: string, provider: ExternalAgentProvider): void;
  /** List available provider names */
  list(): string[];
  /** Check if a provider is registered and available */
  isAvailable(name: string): boolean;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Base error for external provider operations.
 */
export class ExternalProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ExternalProviderError';
  }
}

/**
 * Error when provider is not available.
 */
export class ProviderNotAvailableError extends ExternalProviderError {
  constructor(provider: string, reason?: string, locale?: string) {
    const i18n = createAgentI18n(locale);
    super(
      i18n.t('error.provider.notAvailable', {
        provider,
        reason: reason ? `: ${reason}` : '',
      }),
      provider,
      'PROVIDER_NOT_AVAILABLE'
    );
    this.name = 'ProviderNotAvailableError';
  }
}

/**
 * Error when provider execution fails.
 */
export class ProviderExecutionError extends ExternalProviderError {
  constructor(provider: string, message: string, cause?: Error) {
    super(message, provider, 'EXECUTION_FAILED', cause);
    this.name = 'ProviderExecutionError';
  }
}

/**
 * Error when context creation fails.
 */
export class ContextCreationError extends ExternalProviderError {
  constructor(provider: string, message: string, cause?: Error) {
    super(message, provider, 'CONTEXT_CREATION_FAILED', cause);
    this.name = 'ContextCreationError';
  }
}
