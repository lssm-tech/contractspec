/**
 * @contractspec/lib.plugin.example-generator
 * Example plugin: Markdown documentation generator for ContractSpec specs
 */

export { ExampleGeneratorPlugin } from './generator.js';
export type {
  ExampleGeneratorPluginConfig,
  GeneratorResult,
  PluginMetadata,
  ExampleGeneratorError,
  ValidationError,
  ConfigurationError,
  GenerationError,
} from './types.js';
export { defaultConfig, mergeConfig, validateConfig } from './config.js';
