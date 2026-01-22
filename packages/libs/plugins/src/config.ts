import type { PluginRegistryConfig } from './types.js';
import { defaultPluginRegistryConfig } from './registry.js';

export function mergePluginConfig(
  config?: Partial<PluginRegistryConfig>
): PluginRegistryConfig {
  return {
    ...defaultPluginRegistryConfig,
    ...config,
    registry: {
      ...(defaultPluginRegistryConfig.registry ?? {
        resolutionOrder: ['workspace', 'npm', 'remote'],
      }),
      ...config?.registry,
      resolutionOrder: config?.registry?.resolutionOrder ??
        defaultPluginRegistryConfig.registry?.resolutionOrder ?? [
          'workspace',
          'npm',
          'remote',
        ],
      sources: {
        ...(defaultPluginRegistryConfig.registry?.sources ?? {}),
        ...(config?.registry?.sources ?? {}),
      },
    },
  };
}
