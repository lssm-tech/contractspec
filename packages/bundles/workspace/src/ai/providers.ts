/**
 * AI Provider utilities for ContractSpec workspace.
 *
 * Re-exports from @contractspec/lib.ai-providers with workspace-specific additions.
 */
import type { LanguageModel } from 'ai';
import {
  getAIProvider as getProviderFromLib,
  type LegacyConfig,
} from '@contractspec/lib.ai-providers';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts';

/**
 * Initialize AI provider based on configuration
 *
 * @deprecated Use createProvider() from @contractspec/lib.ai-providers instead
 */
export function getAIProvider(
  config: ResolvedContractsrcConfig
): LanguageModel {
  const legacyConfig: LegacyConfig = {
    aiProvider: config.aiProvider,
    aiModel: config.aiModel || undefined,
    customEndpoint: config.customEndpoint || undefined,
  };
  return getProviderFromLib(legacyConfig);
}
