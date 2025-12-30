import { ExampleRegistry } from '@contractspec/lib.contracts';
import type { ExampleSpec } from '@contractspec/lib.contracts';
import { EXAMPLE_REGISTRY as BUILTIN_EXAMPLES } from './builtins';

// Export the ExampleRegistry class from contracts
export { ExampleRegistry } from '@contractspec/lib.contracts';

// Create a global registry instance populated with builtins
const globalRegistry = new ExampleRegistry();

// Register all builtin examples
for (const example of BUILTIN_EXAMPLES) {
  globalRegistry.register(example);
}

/**
 * Global registry containing all builtin ContractSpec examples.
 * @deprecated Prefer using ExampleRegistry directly for custom registrations.
 */
export const EXAMPLE_REGISTRY: readonly ExampleSpec[] = globalRegistry.list();

/**
 * List all registered examples.
 */
export function listExamples(): readonly ExampleSpec[] {
  return globalRegistry.list();
}

/**
 * Get an example by its key.
 */
export function getExample(key: string): ExampleSpec | undefined {
  return globalRegistry.get(key);
}

/**
 * Search examples by query (matches key, title, description, tags).
 */
export function searchExamples(query: string): ExampleSpec[] {
  return globalRegistry.search(query);
}
