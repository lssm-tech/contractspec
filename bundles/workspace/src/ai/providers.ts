/**
 * AI Provider utilities for ContractSpec workspace.
 *
 * Re-exports from @contractspec/lib.ai-providers with workspace-specific additions.
 */
import type { LanguageModel } from 'ai';
import {
  getAIProvider as getProviderFromLib,
  validateLegacyProvider as validateProviderFromLib,
  getRecommendedModels as getModelsFromLib,
  type LegacyConfig,
} from '@contractspec/lib.ai-providers';
import type { Config } from '../types/config';

/**
 * Initialize AI provider based on configuration
 *
 * @deprecated Use createProvider() from @contractspec/lib.ai-providers instead
 */
export function getAIProvider(config: Config): LanguageModel {
  const legacyConfig: LegacyConfig = {
    aiProvider: config.aiProvider,
    aiModel: config.aiModel || undefined,
    customEndpoint: config.customEndpoint || undefined,
  };
  return getProviderFromLib(legacyConfig);
}

/**
 * Validate that the provider is accessible and working
 *
 * @deprecated Use validateProvider() from @contractspec/lib.ai-providers instead
 */
export async function validateProvider(
  config: Config
): Promise<{ success: boolean; error?: string }> {
  const legacyConfig: LegacyConfig = {
    aiProvider: config.aiProvider,
    aiModel: config.aiModel || undefined,
    customEndpoint: config.customEndpoint || undefined,
  };
  const result = await validateProviderFromLib(legacyConfig);
  return result;
}

/**
 * Get recommended models for each provider
 *
 * @deprecated Use getModelsForProvider() from @contractspec/lib.ai-providers instead
 */
export function getRecommendedModels(provider: Config['aiProvider']): string[] {
  return getModelsFromLib(provider);
}
