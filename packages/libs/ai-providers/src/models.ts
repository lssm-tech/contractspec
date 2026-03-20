/**
 * Model definitions and recommendations
 */
import type { ModelInfo, ProviderName } from './types';

/**
 * Default models per provider
 */
export const DEFAULT_MODELS: Record<ProviderName, string> = {
	ollama: 'llama3.2',
	openai: 'gpt-5.4',
	anthropic: 'claude-sonnet-4-6',
	mistral: 'mistral-large-latest',
	gemini: 'gemini-2.5-flash',
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
		id: 'gpt-5.4',
		name: 'GPT-5.4',
		provider: 'openai',
		contextWindow: 1000000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: true,
			streaming: true,
		},
		costPerMillion: { input: 2.5, output: 15 },
	},
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
	{
		id: 'gpt-5-mini',
		name: 'GPT-5 Mini',
		provider: 'openai',
		contextWindow: 400000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: false,
			streaming: true,
		},
		costPerMillion: { input: 0.25, output: 2 },
	},

	// Anthropic
	{
		id: 'claude-opus-4-6',
		name: 'Claude Opus 4.6',
		provider: 'anthropic',
		contextWindow: 200000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: true,
			streaming: true,
		},
		costPerMillion: { input: 5, output: 25 },
	},
	{
		id: 'claude-sonnet-4-6',
		name: 'Claude Sonnet 4.6',
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
		id: 'claude-haiku-4-5',
		name: 'Claude Haiku 4.5',
		provider: 'anthropic',
		contextWindow: 200000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: false,
			streaming: true,
		},
		costPerMillion: { input: 1, output: 5 },
	},
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
		id: 'mistral-large-2512',
		name: 'Mistral Large 3',
		provider: 'mistral',
		contextWindow: 256000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: false,
			streaming: true,
		},
		costPerMillion: { input: 0.5, output: 1.5 },
	},
	{
		id: 'devstral-2512',
		name: 'Devstral 2',
		provider: 'mistral',
		contextWindow: 256000,
		capabilities: {
			vision: false,
			tools: true,
			reasoning: true,
			streaming: true,
		},
		costPerMillion: { input: 0.4, output: 2 },
	},
	{
		id: 'mistral-medium-2508',
		name: 'Mistral Medium 3.1',
		provider: 'mistral',
		contextWindow: 128000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: false,
			streaming: true,
		},
		costPerMillion: { input: 0.4, output: 2 },
	},
	{
		id: 'mistral-small-2506',
		name: 'Mistral Small 3.2',
		provider: 'mistral',
		contextWindow: 128000,
		capabilities: {
			vision: false,
			tools: true,
			reasoning: false,
			streaming: true,
		},
	},
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
		id: 'mistral-medium-latest',
		name: 'Mistral Medium',
		provider: 'mistral',
		contextWindow: 128000,
		capabilities: {
			vision: false,
			tools: true,
			reasoning: false,
			streaming: true,
		},
	},
	{
		id: 'codestral-latest',
		name: 'Codestral',
		provider: 'mistral',
		contextWindow: 256000,
		capabilities: {
			vision: false,
			tools: true,
			reasoning: false,
			streaming: true,
		},
		costPerMillion: { input: 0.2, output: 0.6 },
	},
	{
		id: 'devstral-small-latest',
		name: 'Devstral Small',
		provider: 'mistral',
		contextWindow: 128000,
		capabilities: {
			vision: false,
			tools: true,
			reasoning: true,
			streaming: true,
		},
	},
	{
		id: 'magistral-medium-latest',
		name: 'Magistral Medium',
		provider: 'mistral',
		contextWindow: 128000,
		capabilities: {
			vision: false,
			tools: true,
			reasoning: true,
			streaming: true,
		},
	},
	{
		id: 'pixtral-large-latest',
		name: 'Pixtral Large',
		provider: 'mistral',
		contextWindow: 128000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: false,
			streaming: true,
		},
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
	{
		id: 'gemini-3.1-pro-preview',
		name: 'Gemini 3.1 Pro',
		provider: 'gemini',
		contextWindow: 1000000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: true,
			streaming: true,
		},
	},
	{
		id: 'gemini-3.1-flash-lite-preview',
		name: 'Gemini 3.1 Flash-Lite',
		provider: 'gemini',
		contextWindow: 1000000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: true,
			streaming: true,
		},
	},
	{
		id: 'gemini-3-flash-preview',
		name: 'Gemini 3 Flash',
		provider: 'gemini',
		contextWindow: 1000000,
		capabilities: {
			vision: true,
			tools: true,
			reasoning: false,
			streaming: true,
		},
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
