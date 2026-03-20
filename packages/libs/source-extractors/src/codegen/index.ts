/**
 * Code generation module.
 *
 * Generates ContractSpec definitions from the Intermediate Representation.
 */

// Operation generators
export { generateOperation, generateOperations } from './operation-gen';
// Registry generators
export { generateRegistry } from './registry-gen';
// Schema generators
export { generateSchema, generateSchemas } from './schema-gen';

// Types
export type {
	GeneratedFile,
	GenerationOptions,
	GenerationResult,
} from './types';
