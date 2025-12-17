/**
 * AI Chat providers
 *
 * Re-exports from @lssm/lib.ai-providers with chat-specific utilities.
 */

// Re-export core types and functions from shared library
export {
  // Types
  type ProviderName as ChatProviderName,
  type ProviderMode as ChatProviderMode,
  type ProviderConfig as ChatProviderConfig,
  type ModelInfo as ChatModelInfo,
  type Provider as ChatProvider,
  type ProviderAvailability,
  type ModelCapabilities,

  // Factory functions
  createProvider,
  createProviderFromEnv,
  getAvailableProviders,

  // Model utilities
  DEFAULT_MODELS,
  MODELS,
  getModelsForProvider,
  getModelInfo,
  getRecommendedModels,
  getDefaultModel,

  // Validation
  validateProvider,
  hasCredentials,
  getEnvVarName,
  isOllamaRunning,
  listOllamaModels,
} from '@lssm/lib.ai-providers';

// Chat-specific utilities
export { supportsLocalMode, isStudioAvailable } from './chat-utilities';
