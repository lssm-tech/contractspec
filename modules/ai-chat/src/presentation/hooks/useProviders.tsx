'use client';

import * as React from 'react';
import {
  type ProviderName,
  type ProviderMode,
  type ModelInfo,
  getAvailableProviders,
  getModelsForProvider,
} from '@contractspec/lib.ai-providers';

/**
 * Provider availability info
 */
export interface ProviderInfo {
  provider: ProviderName;
  available: boolean;
  mode: ProviderMode;
  reason?: string;
  models: ModelInfo[];
}

/**
 * Return type for useProviders hook
 */
export interface UseProvidersReturn {
  /** All providers with availability info */
  providers: ProviderInfo[];
  /** Available providers only */
  availableProviders: ProviderInfo[];
  /** Check if a provider is available */
  isAvailable: (provider: ProviderName) => boolean;
  /** Get models for a provider */
  getModels: (provider: ProviderName) => ModelInfo[];
  /** Loading state */
  isLoading: boolean;
  /** Refresh provider availability */
  refresh: () => Promise<void>;
}

/**
 * Hook for managing AI provider information
 */
export function useProviders(): UseProvidersReturn {
  const [providers, setProviders] = React.useState<ProviderInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadProviders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const available = getAvailableProviders();
      const providersWithModels: ProviderInfo[] = available.map((p) => ({
        ...p,
        models: getModelsForProvider(p.provider),
      }));
      setProviders(providersWithModels);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const availableProviders = React.useMemo(
    () => providers.filter((p) => p.available),
    [providers]
  );

  const isAvailable = React.useCallback(
    (provider: ProviderName) =>
      providers.some((p) => p.provider === provider && p.available),
    [providers]
  );

  const getModelsCallback = React.useCallback(
    (provider: ProviderName) =>
      providers.find((p) => p.provider === provider)?.models ?? [],
    [providers]
  );

  return {
    providers,
    availableProviders,
    isAvailable,
    getModels: getModelsCallback,
    isLoading,
    refresh: loadProviders,
  };
}
