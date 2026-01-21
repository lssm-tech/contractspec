import type { ExampleGeneratorPluginConfig } from './types.js';

/**
 * Default configuration for the ExampleGeneratorPlugin
 */
export const defaultConfig: ExampleGeneratorPluginConfig = {
  outputDir: './docs',
  format: 'auto',
  maxItems: 100,
  maxDepth: 2,
  excludeFields: [],
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(
  userConfig: Partial<ExampleGeneratorPluginConfig>
): ExampleGeneratorPluginConfig {
  return {
    ...defaultConfig,
    ...userConfig,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: ExampleGeneratorPluginConfig): void {
  if (!config.outputDir) {
    throw new Error('outputDir is required');
  }

  if (
    config.format &&
    !['table', 'list', 'detail', 'auto'].includes(config.format)
  ) {
    throw new Error('format must be one of: table, list, detail, auto');
  }

  if (config.maxItems !== undefined && config.maxItems < 1) {
    throw new Error('maxItems must be greater than 0');
  }

  if (config.maxDepth !== undefined && config.maxDepth < 1) {
    throw new Error('maxDepth must be greater than 0');
  }
}
