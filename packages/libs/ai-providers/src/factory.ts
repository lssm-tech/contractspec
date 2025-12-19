/**
 * Provider factory and creation utilities
 */
import type { LanguageModel } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';
import { ollama } from 'ollama-ai-provider';
import type {
  ModelInfo,
  Provider,
  ProviderAvailability,
  ProviderConfig,
  ProviderMode,
  ProviderName,
} from './types';
import { DEFAULT_MODELS, getModelsForProvider } from './models';

/**
 * Base provider implementation
 */
class BaseProvider implements Provider {
  readonly name: ProviderName;
  readonly model: string;
  readonly mode: ProviderMode;

  private readonly config: ProviderConfig;
  private cachedModel: LanguageModel | null = null;

  constructor(config: ProviderConfig) {
    this.name = config.provider;
    this.model = config.model ?? DEFAULT_MODELS[config.provider];
    this.mode = this.determineMode(config);
    this.config = config;
  }

  getModel(): LanguageModel {
    if (!this.cachedModel) {
      this.cachedModel = this.createModel();
    }
    return this.cachedModel;
  }

  async listModels(): Promise<ModelInfo[]> {
    if (this.name === 'ollama') {
      return this.listOllamaModels();
    }
    return getModelsForProvider(this.name);
  }

  async validate(): Promise<{ valid: boolean; error?: string }> {
    if (this.name === 'ollama') {
      return this.validateOllama();
    }

    if (this.mode === 'byok' && !this.config.apiKey) {
      return {
        valid: false,
        error: `API key required for ${this.name}`,
      };
    }

    if (
      this.mode === 'managed' &&
      !this.config.proxyUrl &&
      !this.config.organizationId
    ) {
      return {
        valid: false,
        error: 'Managed mode requires proxyUrl or organizationId',
      };
    }

    return { valid: true };
  }

  private determineMode(config: ProviderConfig): ProviderMode {
    if (config.provider === 'ollama') return 'local';
    if (config.apiKey) return 'byok';
    return 'managed';
  }

  private createModel(): LanguageModel {
    const { apiKey, baseUrl, proxyUrl, organizationId } = this.config;

    switch (this.name) {
      case 'ollama': {
        // For Ollama, set the base URL via environment variable
        const originalBaseUrl = process.env.OLLAMA_BASE_URL;
        if (baseUrl && baseUrl !== 'http://localhost:11434') {
          process.env.OLLAMA_BASE_URL = baseUrl;
        }

        const ollamaModel = ollama(this.model);

        // Restore original environment variable
        if (originalBaseUrl !== undefined) {
          process.env.OLLAMA_BASE_URL = originalBaseUrl;
        } else if (baseUrl && baseUrl !== 'http://localhost:11434') {
          delete process.env.OLLAMA_BASE_URL;
        }

        return ollamaModel as unknown as LanguageModel;
      }

      case 'openai':
        if (this.mode === 'managed') {
          // For managed mode, use proxy URL via environment variable
          const originalBaseUrl = process.env.OPENAI_BASE_URL;
          if (proxyUrl) {
            process.env.OPENAI_BASE_URL = proxyUrl;
          }

          const model = openai(this.model, {
            apiKey,
          });

          // Restore original environment variable
          if (originalBaseUrl !== undefined) {
            process.env.OPENAI_BASE_URL = originalBaseUrl;
          } else if (proxyUrl) {
            delete process.env.OPENAI_BASE_URL;
          }

          return model;
        }
        return openai(this.model);

      case 'anthropic':
        if (this.mode === 'managed') {
          // For managed mode with Anthropic, we use the proxy via openai
          const originalBaseUrl = process.env.OPENAI_BASE_URL;
          if (proxyUrl) {
            process.env.OPENAI_BASE_URL = proxyUrl;
          }

          const model = openai(this.model);

          // Restore original environment variable
          if (originalBaseUrl !== undefined) {
            process.env.OPENAI_BASE_URL = originalBaseUrl;
          } else if (proxyUrl) {
            delete process.env.OPENAI_BASE_URL;
          }

          return model;
        }
        return anthropic(this.model);

      case 'mistral':
        if (this.mode === 'managed') {
          // For managed mode with Mistral, we use the proxy via openai
          const originalBaseUrl = process.env.OPENAI_BASE_URL;
          if (proxyUrl) {
            process.env.OPENAI_BASE_URL = proxyUrl;
          }

          const model = openai(this.model);

          // Restore original environment variable
          if (originalBaseUrl !== undefined) {
            process.env.OPENAI_BASE_URL = originalBaseUrl;
          } else if (proxyUrl) {
            delete process.env.OPENAI_BASE_URL;
          }

          return model;
        }
        return mistral(this.model);

      case 'gemini':
        if (this.mode === 'managed') {
          // For managed mode with Gemini, we use the proxy via openai
          const originalBaseUrl = process.env.OPENAI_BASE_URL;
          if (proxyUrl) {
            process.env.OPENAI_BASE_URL = proxyUrl;
          }

          const model = openai(this.model);

          // Restore original environment variable
          if (originalBaseUrl !== undefined) {
            process.env.OPENAI_BASE_URL = originalBaseUrl;
          } else if (proxyUrl) {
            delete process.env.OPENAI_BASE_URL;
          }

          return model;
        }
        return google(this.model);

      default:
        throw new Error(`Unknown provider: ${this.name}`);
    }
  }

  private async listOllamaModels(): Promise<ModelInfo[]> {
    try {
      const baseUrl = this.config.baseUrl ?? 'http://localhost:11434';
      const response = await fetch(`${baseUrl}/api/tags`);
      if (!response.ok) {
        return getModelsForProvider('ollama');
      }

      const data = (await response.json()) as {
        models?: { name: string; size?: number }[];
      };
      const models = data.models ?? [];

      return models.map((m) => ({
        id: m.name,
        name: m.name,
        provider: 'ollama' as const,
        contextWindow: 8000,
        capabilities: {
          vision: false,
          tools: false,
          reasoning: false,
          streaming: true,
        },
      }));
    } catch {
      return getModelsForProvider('ollama');
    }
  }

  private async validateOllama(): Promise<{ valid: boolean; error?: string }> {
    try {
      const baseUrl = this.config.baseUrl ?? 'http://localhost:11434';
      const response = await fetch(`${baseUrl}/api/tags`);
      if (!response.ok) {
        return {
          valid: false,
          error: `Ollama server returned ${response.status}`,
        };
      }

      const data = (await response.json()) as {
        models?: { name: string }[];
      };
      const models = data.models ?? [];
      const hasModel = models.some((m) => m.name === this.model);

      if (!hasModel) {
        return {
          valid: false,
          error: `Model "${this.model}" not found. Available: ${models.map((m) => m.name).join(', ')}`,
        };
      }

      return { valid: true };
    } catch (error) {
      const baseUrl = this.config.baseUrl ?? 'http://localhost:11434';
      return {
        valid: false,
        error: `Cannot connect to Ollama at ${baseUrl}: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

/**
 * Create a provider from configuration
 */
export function createProvider(config: ProviderConfig): Provider {
  return new BaseProvider(config);
}

/**
 * Create a provider from environment variables
 */
export function createProviderFromEnv(): Provider {
  const provider =
    (process.env.CONTRACTSPEC_AI_PROVIDER as ProviderName) ?? 'openai';
  const model = process.env.CONTRACTSPEC_AI_MODEL;

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
    case 'ollama':
      // No API key needed
      break;
  }

  return createProvider({
    provider,
    model,
    apiKey,
    baseUrl: process.env.OLLAMA_BASE_URL,
    proxyUrl: process.env.CONTRACTSPEC_AI_PROXY_URL,
    organizationId: process.env.CONTRACTSPEC_ORG_ID,
  });
}

/**
 * Get all available providers with their status
 */
export function getAvailableProviders(): ProviderAvailability[] {
  const providers: ProviderAvailability[] = [];

  // Ollama (local)
  providers.push({
    provider: 'ollama',
    available: true,
    mode: 'local',
  });

  // OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  providers.push({
    provider: 'openai',
    available:
      Boolean(openaiKey) || Boolean(process.env.CONTRACTSPEC_AI_PROXY_URL),
    mode: openaiKey ? 'byok' : 'managed',
    reason: !openaiKey ? 'Set OPENAI_API_KEY for BYOK mode' : undefined,
  });

  // Anthropic
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  providers.push({
    provider: 'anthropic',
    available:
      Boolean(anthropicKey) || Boolean(process.env.CONTRACTSPEC_AI_PROXY_URL),
    mode: anthropicKey ? 'byok' : 'managed',
    reason: !anthropicKey ? 'Set ANTHROPIC_API_KEY for BYOK mode' : undefined,
  });

  // Mistral
  const mistralKey = process.env.MISTRAL_API_KEY;
  providers.push({
    provider: 'mistral',
    available:
      Boolean(mistralKey) || Boolean(process.env.CONTRACTSPEC_AI_PROXY_URL),
    mode: mistralKey ? 'byok' : 'managed',
    reason: !mistralKey ? 'Set MISTRAL_API_KEY for BYOK mode' : undefined,
  });

  // Gemini
  const geminiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  providers.push({
    provider: 'gemini',
    available:
      Boolean(geminiKey) || Boolean(process.env.CONTRACTSPEC_AI_PROXY_URL),
    mode: geminiKey ? 'byok' : 'managed',
    reason: !geminiKey ? 'Set GOOGLE_API_KEY for BYOK mode' : undefined,
  });

  return providers;
}
