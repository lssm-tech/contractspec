/**
 * AI Chat providers
 *
 * Re-exports from @contractspec/lib.ai-providers with chat-specific utilities.
 */

// Re-export core types and functions from shared library
export {
	// Factory functions
	createProvider,
	createProviderFromEnv,
	// Model utilities
	DEFAULT_MODELS,
	getAvailableProviders,
	getDefaultModel,
	getEnvVarName,
	getModelInfo,
	getModelsForProvider,
	getRecommendedModels,
	hasCredentials,
	isOllamaRunning,
	listOllamaModels,
	MODELS,
	type ModelCapabilities,
	type ModelInfo as ChatModelInfo,
	type Provider as ChatProvider,
	type ProviderAvailability,
	type ProviderConfig as ChatProviderConfig,
	type ProviderMode as ChatProviderMode,
	// Types
	type ProviderName as ChatProviderName,
	// Validation
	validateProvider,
} from '@contractspec/lib.ai-providers';

// Chat-specific utilities
export { isStudioAvailable, supportsLocalMode } from './chat-utilities';
