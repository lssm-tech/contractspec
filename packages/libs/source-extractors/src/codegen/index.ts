/**
 * Code generation module.
 *
 * Generates ContractSpec definitions from the Intermediate Representation.
 */

// Operation generators
export { generateOperation, generateOperations } from './operation-gen';

// Schema generators
export { generateSchema, generateSchemas } from './schema-gen';

// Registry generators
export { generateRegistry } from './registry-gen';

// Types
export type {
  GeneratedFile,
  GenerationOptions,
  GenerationResult,
} from './types';
