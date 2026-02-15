/**
 * AI adapter port.
 */

import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';

/**
 * AI provider type.
 */
export type AiProvider = 'claude' | 'openai' | 'ollama' | 'custom';

/**
 * AI generation options.
 */
export interface AiGenerateOptions {
  prompt: string;
  systemPrompt?: string;
  stream?: boolean;
}

/**
 * AI structured generation options.
 */
export interface AiGenerateStructuredOptions<_T> {
  prompt: string;
  systemPrompt?: string;
  schema: unknown; // Zod schema
}

/**
 * AI generation result.
 */
export interface AiGenerateResult {
  text: string;
}

/**
 * AI validation result.
 */
export interface AiValidationResult {
  success: boolean;
  error?: string;
}

/**
 * AI adapter interface.
 */
export interface AiAdapter {
  /**
   * Validate provider configuration.
   */
  validateProvider(
    config: ResolvedContractsrcConfig
  ): Promise<AiValidationResult>;

  /**
   * Generate text from prompt.
   */
  generateText(options: AiGenerateOptions): Promise<AiGenerateResult>;

  /**
   * Generate structured data from prompt.
   */
  generateStructured<T>(
    options: AiGenerateStructuredOptions<T>
  ): Promise<{ object: T }>;

  /**
   * Stream text generation.
   */
  streamText(
    options: AiGenerateOptions,
    onChunk: (text: string) => void
  ): Promise<string>;
}
