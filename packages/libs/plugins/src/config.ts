import type { PluginRegistryConfig } from './types.js';
import { defaultPluginRegistryConfig } from './registry.js';

export function mergePluginConfig(
  config?: Partial<PluginRegistryConfig>
): PluginRegistryConfig {
  return {
    ...defaultPluginRegistryConfig,
    ...config,
    registry: {
      ...defaultPluginRegistryConfig.registry,
      ...config?.registry,
      sources: {
        ...(defaultPluginRegistryConfig.registry?.sources ?? {}),
        ...(config?.registry?.sources ?? {}),
      },
    },
  };
}
