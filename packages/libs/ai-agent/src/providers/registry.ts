/**
 * Provider registry for managing external SDK providers.
 */

import type { ExternalAgentProvider, ProviderRegistry } from './types';
import { ProviderNotAvailableError } from './types';
import { getDefaultI18n } from '../i18n';

/**
 * In-memory implementation of the provider registry.
 */
class InMemoryProviderRegistry implements ProviderRegistry {
  private providers = new Map<string, ExternalAgentProvider>();

  get(name: string): ExternalAgentProvider | undefined {
    return this.providers.get(name);
  }

  register(name: string, provider: ExternalAgentProvider): void {
    this.providers.set(name, provider);
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }

  isAvailable(name: string): boolean {
    const provider = this.providers.get(name);
    return provider !== undefined && provider.isAvailable();
  }

  /**
   * Get a provider, throwing if not found or not available.
   */
  require(name: string): ExternalAgentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new ProviderNotAvailableError(
        name,
        getDefaultI18n().t('error.provider.notRegistered')
      );
    }
    if (!provider.isAvailable()) {
      throw new ProviderNotAvailableError(
        name,
        getDefaultI18n().t('error.provider.depsNotInstalled')
      );
    }
    return provider;
  }

  /**
   * Clear all registered providers.
   */
  clear(): void {
    this.providers.clear();
  }
}

/**
 * Create a new provider registry.
 */
export function createProviderRegistry(): ProviderRegistry & {
  require: (name: string) => ExternalAgentProvider;
  clear: () => void;
} {
  return new InMemoryProviderRegistry();
}

/**
 * Global default provider registry.
 * Use this for convenience when you don't need multiple registries.
 */
export const defaultProviderRegistry = createProviderRegistry();
