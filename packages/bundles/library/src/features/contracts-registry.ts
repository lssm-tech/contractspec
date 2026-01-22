/**
 * Central contracts registry for ContractSpec.
 *
 * This registry holds all operation, event, and presentation specs
 * so they can be resolved by key for the feature discovery system.
 * Unlike the MCP's OperationSpecRegistry (which also binds handlers),
 * this is a spec-only registry for documentation and discovery purposes.
 */

import {
  OperationSpecRegistry,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts';

// Import all operation specs from features
import { docsSearchSpec } from './docs';

/**
 * Central registry for all ContractSpec operation specs.
 * Used by the feature discovery system to resolve OpRef to full OperationSpec.
 */
let operationRegistry: OperationSpecRegistry | null = null;

/**
 * Create and initialize the central operation spec registry.
 * Registers all ContractSpec operation specs for discovery.
 */
export function createContractSpecOperationRegistry(): OperationSpecRegistry {
  const registry = new OperationSpecRegistry();

  // Register docs operations
  registry.register(docsSearchSpec);

  // TODO: Register additional operation specs as they are extracted
  // registry.register(otherOperationSpec);

  return registry;
}

/**
 * Get the singleton ContractSpec operation spec registry.
 * Creates the registry on first call, returns cached instance thereafter.
 */
export function getContractSpecOperationRegistry(): OperationSpecRegistry {
  if (!operationRegistry) {
    operationRegistry = createContractSpecOperationRegistry();
  }
  return operationRegistry;
}

/**
 * Reset the operation registry singleton (for testing).
 */
export function resetContractSpecOperationRegistry(): void {
  operationRegistry = null;
}

/**
 * Resolve an operation spec by key and optional version.
 * Returns undefined if the spec is not found in the registry.
 */
export function resolveOperationSpec(
  key: string,
  version?: string
): AnyOperationSpec | undefined {
  return getContractSpecOperationRegistry().get(key, version);
}
