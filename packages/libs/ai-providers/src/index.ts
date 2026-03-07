/**
 * @contractspec/lib.ai-providers
 *
 * Unified AI provider abstraction for ContractSpec applications.
 */

// Types
export * from './types';

// Provider factory
export * from './factory';

// Model definitions
export * from './models';

// Validation utilities
export * from './validation';

// Model selector
export * from './selector-types';
export { createModelSelector } from './selector';
export type { ModelSelectorOptions } from './selector';

// Legacy compatibility
export {
  getAIProvider,
  validateProvider as validateLegacyProvider,
} from './legacy';
