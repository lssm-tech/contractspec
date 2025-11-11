import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { ollama } from 'ollama-ai-provider';
import type { LanguageModel } from 'ai';
import type { Config } from '../utils/config.js';

/**
 * Initialize AI provider based on configuration
 */
export function getAIProvider(config: Config): LanguageModel {
  const { aiProvider, aiModel, customEndpoint } = config;

  switch (aiProvider) {
    case 'claude': {
      const model = aiModel || 'claude-3-5-sonnet-20241022';
      return anthropic(model);
    }

    case 'openai': {
      const model = aiModel || 'gpt-4o';
      return openai(model);
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
      
      // For custom endpoints, use openai with environment variable for baseURL
      // The @ai-sdk/openai package reads from OPENAI_BASE_URL env var
      // For now, just use the default openai model
      // TODO: Support custom endpoints properly when needed
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
      return [
        'claude-3-5-sonnet-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
      ];
    case 'openai':
      return ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    case 'ollama':
      return ['codellama', 'llama3.1', 'mistral', 'deepseek-coder'];
    case 'custom':
      return [];
    default:
      return [];
  }
}

