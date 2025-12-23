/**
 * Legacy compatibility layer
 *
 * Provides backwards-compatible functions for existing code
 * that uses the old provider API from contractspec-workspace.
 */
import type { LanguageModel } from 'ai';
import type { LegacyConfig, ProviderName } from './types';
import { createProvider } from './factory';
import { getRecommendedModels as getModels } from './models';

/**
 * Map legacy provider names to new ones
 */
function mapLegacyProvider(legacy: LegacyConfig['aiProvider']): ProviderName {
  switch (legacy) {
    case 'claude':
      return 'anthropic';
    case 'custom':
      return 'openai'; // Custom endpoints use OpenAI-compatible API
    default:
      return legacy as ProviderName;
  }
}

/**
 * Get AI provider from legacy Config type
 *
 * @deprecated Use createProvider() instead
 */
export function getAIProvider(config: LegacyConfig): LanguageModel {
  const provider = mapLegacyProvider(config.aiProvider);

  // Get API key from environment
  let apiKey: string | undefined;
  switch (provider) {
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY;
      break;
    case 'anthropic':
      apiKey = process.env.ANTHROPIC_API_KEY;
      break;
    case 'mistral':
      apiKey = process.env.MISTRAL_API_KEY;
      break;
    case 'gemini':
      apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
      break;
  }

  const instance = createProvider({
    provider,
    model: config.aiModel,
    apiKey,
    baseUrl: config.customEndpoint,
  });

  return instance.getModel();
}

/**
 * Validate provider from legacy Config type
 *
 * @deprecated Use validateProvider() from './validation' instead
 */
export async function validateProvider(
  config: LegacyConfig
): Promise<{ success: boolean; error?: string }> {
  const provider = mapLegacyProvider(config.aiProvider);

  // For Ollama, we can't easily validate without making a request
  if (provider === 'ollama') {
    return { success: true };
  }

  // For cloud providers, check API key exists
  if (provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    return {
      success: false,
      error: 'ANTHROPIC_API_KEY environment variable not set',
    };
  }

  if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: 'OPENAI_API_KEY environment variable not set',
    };
  }

  if (provider === 'mistral' && !process.env.MISTRAL_API_KEY) {
    return {
      success: false,
      error: 'MISTRAL_API_KEY environment variable not set',
    };
  }

  if (
    provider === 'gemini' &&
    !process.env.GOOGLE_API_KEY &&
    !process.env.GEMINI_API_KEY
  ) {
    return {
      success: false,
      error: 'GOOGLE_API_KEY or GEMINI_API_KEY environment variable not set',
    };
  }

  return { success: true };
}

/**
 * Get recommended models for legacy provider name
 *
 * @deprecated Use getModelsForProvider() instead
 */
export { getModels as getRecommendedModels };
