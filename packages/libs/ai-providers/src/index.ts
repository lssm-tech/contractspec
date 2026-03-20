/**
 * @contractspec/lib.ai-providers
 *
 * Unified AI provider abstraction for ContractSpec applications.
 */

// Provider factory
export * from './factory';
// Legacy compatibility
export {
	getAIProvider,
	validateProvider as validateLegacyProvider,
} from './legacy';

// Model definitions
export * from './models';
export type { ModelSelectorOptions } from './selector';
export { createModelSelector } from './selector';
// Model selector
export * from './selector-types';
// Types
export * from './types';
// Validation utilities
export * from './validation';
