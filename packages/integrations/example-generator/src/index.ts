/**
 * @contractspec/lib.plugin.example-generator
 * Example plugin: Markdown documentation generator for ContractSpec specs
 */

export { defaultConfig, mergeConfig, validateConfig } from './config.js';
export { ExampleGeneratorPlugin } from './generator.js';
export type {
	ConfigurationError,
	ExampleGeneratorError,
	ExampleGeneratorPluginConfig,
	GenerationError,
	GeneratorResult,
	PluginMetadata,
	ValidationError,
} from './types.js';
