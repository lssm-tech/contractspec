import { anthropic } from '@ai-sdk/anthropic';
import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';
import { ollama } from 'ollama-ai-provider';
import type { LanguageModel } from 'ai';
import { DEFAULT_MODELS, getModelsForProvider } from '@contractspec/lib.ai-providers/models';
import type { Config } from '../utils/config';

/**
 * Initialize AI provider based on configuration
 */
export function getAIProvider(config: Config): LanguageModel {
  const { aiProvider, aiModel, customEndpoint } = config;

  switch (aiProvider) {
    case 'claude': {
      const model = aiModel || DEFAULT_MODELS.anthropic;
      return anthropic(model);
    }

    case 'openai': {
      const model = aiModel || DEFAULT_MODELS.openai;
      return openai(model);
    }

    case 'mistral': {
      const model = aiModel || DEFAULT_MODELS.mistral;
      return mistral(model);
    }

    case 'ollama': {
      const model = aiModel || 'codellama';
      // ollama-ai-provider returns LanguageModelV1, wrap it to satisfy LanguageModel interface
      const ollamaModel = ollama(model);
      // Return as unknown then LanguageModel to bypass strict type checking
      // This is safe because ollama models are compatible at runtime
      return ollamaModel as unknown as LanguageModel;
    }

    case 'custom': {
      if (!customEndpoint) {
        throw new Error(
          'Custom endpoint required. Set customEndpoint in .contractsrc.json or CONTRACTSPEC_LLM_ENDPOINT env var'
        );
      }

      const model = aiModel || 'default';
      return openai(model);
    }

    default:
      throw new Error(`Unknown AI provider: ${aiProvider}`);
  }
}

/**
 * Validate that the provider is accessible and working
 */
export async function validateProvider(
  config: Config
): Promise<{ success: boolean; error?: string }> {
  try {
    const { aiProvider } = config;

    // For Ollama, we can't easily validate without making a request
    if (aiProvider === 'ollama') {
      return { success: true };
    }

    // For cloud providers, check API key exists
    if (aiProvider === 'claude' && !process.env.ANTHROPIC_API_KEY) {
      return {
        success: false,
        error: 'ANTHROPIC_API_KEY environment variable not set',
      };
    }

    if (aiProvider === 'openai' && !process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: 'OPENAI_API_KEY environment variable not set',
      };
    }

    if (aiProvider === 'mistral' && !process.env.MISTRAL_API_KEY) {
      return {
        success: false,
        error: 'MISTRAL_API_KEY environment variable not set',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get recommended models for each provider
 */
export function getRecommendedModels(provider: Config['aiProvider']): string[] {
  switch (provider) {
    case 'claude':
      return getModelsForProvider('anthropic').map((m) => m.id);
    case 'openai':
      return getModelsForProvider('openai').map((m) => m.id);
    case 'mistral':
      return getModelsForProvider('mistral').map((m) => m.id);
    case 'ollama':
      return ['codellama', 'llama3.1', 'mistral', 'deepseek-coder'];
    case 'custom':
      return [];
    default:
      return [];
  }
}
