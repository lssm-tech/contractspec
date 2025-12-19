/**
 * Model definitions and recommendations
 */
import type { ModelInfo, ProviderName } from './types';

/**
 * Default models per provider
 */
export const DEFAULT_MODELS: Record<ProviderName, string> = {
  ollama: 'llama3.2',
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  mistral: 'mistral-large-latest',
  gemini: 'gemini-2.0-flash',
};

/**
 * All recommended models with metadata
 */
export const MODELS: ModelInfo[] = [
  // Ollama
  {
    id: 'llama3.2',
    name: 'Llama 3.2',
    provider: 'ollama',
    contextWindow: 128000,
    capabilities: {
      vision: false,
      tools: true,
      reasoning: false,
      streaming: true,
    },
  },
  {
    id: 'codellama',
    name: 'Code Llama',
    provider: 'ollama',
    contextWindow: 16000,
    capabilities: {
      vision: false,
      tools: false,
      reasoning: false,
      streaming: true,
    },
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'ollama',
    contextWindow: 16000,
    capabilities: {
      vision: false,
      tools: false,
      reasoning: false,
      streaming: true,
    },
  },
  {
    id: 'mistral',
    name: 'Mistral 7B',
    provider: 'ollama',
    contextWindow: 32000,
    capabilities: {
      vision: false,
      tools: false,
      reasoning: false,
      streaming: true,
    },
  },

  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    contextWindow: 128000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 2.5, output: 10 },
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    contextWindow: 128000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 0.15, output: 0.6 },
  },
  {
    id: 'o1',
    name: 'o1',
    provider: 'openai',
    contextWindow: 200000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: true,
      streaming: true,
    },
    costPerMillion: { input: 15, output: 60 },
  },
  {
    id: 'o1-mini',
    name: 'o1 Mini',
    provider: 'openai',
    contextWindow: 128000,
    capabilities: {
      vision: false,
      tools: true,
      reasoning: true,
      streaming: true,
    },
    costPerMillion: { input: 3, output: 12 },
  },

  // Anthropic
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    contextWindow: 200000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: true,
      streaming: true,
    },
    costPerMillion: { input: 3, output: 15 },
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    contextWindow: 200000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 3, output: 15 },
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    contextWindow: 200000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 0.8, output: 4 },
  },

  // Mistral
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    provider: 'mistral',
    contextWindow: 128000,
    capabilities: {
      vision: false,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 2, output: 6 },
  },
  {
    id: 'codestral-latest',
    name: 'Codestral',
    provider: 'mistral',
    contextWindow: 32000,
    capabilities: {
      vision: false,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 0.2, output: 0.6 },
  },
  {
    id: 'mistral-small-latest',
    name: 'Mistral Small',
    provider: 'mistral',
    contextWindow: 32000,
    capabilities: {
      vision: false,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 0.2, output: 0.6 },
  },

  // Gemini
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    contextWindow: 1000000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: false,
      streaming: true,
    },
    costPerMillion: { input: 0.075, output: 0.3 },
  },
  {
    id: 'gemini-2.5-pro-preview-06-05',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    contextWindow: 1000000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: true,
      streaming: true,
    },
    costPerMillion: { input: 1.25, output: 10 },
  },
  {
    id: 'gemini-2.5-flash-preview-05-20',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    contextWindow: 1000000,
    capabilities: {
      vision: true,
      tools: true,
      reasoning: true,
      streaming: true,
    },
    costPerMillion: { input: 0.15, output: 0.6 },
  },
];

/**
 * Get models for a specific provider
 */
export function getModelsForProvider(provider: ProviderName): ModelInfo[] {
  return MODELS.filter((m) => m.provider === provider);
}

/**
 * Get model info by ID
 */
export function getModelInfo(modelId: string): ModelInfo | undefined {
  return MODELS.find((m) => m.id === modelId);
}

/**
 * Get recommended models for a provider (legacy format)
 */
export function getRecommendedModels(
  provider: ProviderName | 'claude' | 'custom'
): string[] {
  // Handle legacy provider names
  const normalizedProvider =
    provider === 'claude'
      ? 'anthropic'
      : provider === 'custom'
        ? 'openai'
        : provider;

  return getModelsForProvider(normalizedProvider as ProviderName).map(
    (m) => m.id
  );
}

/**
 * Get default model for a provider
 */
export function getDefaultModel(provider: ProviderName): string {
  return DEFAULT_MODELS[provider];
}
