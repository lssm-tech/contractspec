/**
 * AI Provider types and interfaces
 */
import type { LanguageModel } from 'ai';

/**
 * Supported AI providers
 */
export type ProviderName =
  | 'ollama'
  | 'openai'
  | 'anthropic'
  | 'mistral'
  | 'gemini';

/**
 * Legacy provider names (for backwards compatibility)
 */
export type LegacyProviderName = 'claude' | 'openai' | 'ollama' | 'custom';

/**
 * Provider mode determines how API keys are resolved
 */
export type ProviderMode =
  | 'local' // Local provider (Ollama only)
  | 'byok' // Bring Your Own Key
  | 'managed'; // Managed keys via API proxy

/**
 * Configuration for creating a provider
 */
export interface ProviderConfig {
  /** Which provider to use */
  provider: ProviderName;
  /** Specific model to use (optional, uses provider default) */
  model?: string;
  /** API key for BYOK mode */
  apiKey?: string;
  /** Custom base URL (for Ollama or custom endpoints) */
  baseUrl?: string;
  /** API proxy URL for managed mode */
  proxyUrl?: string;
  /** Organization/tenant ID for managed mode */
  organizationId?: string;
}

/**
 * Model capability flags
 */
export interface ModelCapabilities {
  /** Supports image/vision input */
  vision: boolean;
  /** Supports tool/function calling */
  tools: boolean;
  /** Supports extended thinking/reasoning */
  reasoning: boolean;
  /** Supports streaming */
  streaming: boolean;
}

/**
 * Model information
 */
export interface ModelInfo {
  /** Model identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Provider this model belongs to */
  provider: ProviderName;
  /** Context window size in tokens */
  contextWindow: number;
  /** Model capabilities */
  capabilities: ModelCapabilities;
  /** Approximate cost per million tokens (input, output) */
  costPerMillion?: { input: number; output: number };
}

/**
 * AI Provider interface
 */
export interface Provider {
  /** Provider name */
  readonly name: ProviderName;
  /** Current model ID */
  readonly model: string;
  /** Provider mode */
  readonly mode: ProviderMode;

  /**
   * Get the underlying AI SDK language model
   */
  getModel(): LanguageModel;

  /**
   * List available models for this provider
   */
  listModels(): Promise<ModelInfo[]>;

  /**
   * Validate the provider configuration/credentials
   */
  validate(): Promise<{ valid: boolean; error?: string }>;
}

/**
 * Provider availability info
 */
export interface ProviderAvailability {
  provider: ProviderName;
  available: boolean;
  mode: ProviderMode;
  reason?: string;
}

/**
 * Legacy Config type for backwards compatibility
 * This matches the Config type from contractspec-workspace
 */
export interface LegacyConfig {
  aiProvider: LegacyProviderName;
  aiModel?: string;
  customEndpoint?: string;
}
