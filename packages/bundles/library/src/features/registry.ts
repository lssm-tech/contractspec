import { FeatureRegistry } from '@contractspec/lib.contracts-spec/features';
import { AppConfigFeature } from '@contractspec/lib.contracts-spec/app-config';
import { DocsFeature } from './docs.feature';
import { MCPFeature } from './mcp.feature';
import { PresentationsFeature } from './presentations.feature';

/**
 * Create and initialize the ContractSpec feature registry.
 * Registers all ContractSpec features without validation (ops/presentations not registered).
 */
export function createContractSpecFeatureRegistry(): FeatureRegistry {
  const features = new FeatureRegistry();

  // Register ContractSpec-specific features
  features.register(DocsFeature);
  features.register(MCPFeature);
  features.register(PresentationsFeature);

  // Register lib.contracts features
  features.register(AppConfigFeature);

  return features;
}

/** Singleton instance of the feature registry. */
let registryInstance: FeatureRegistry | null = null;

/**
 * Get the singleton ContractSpec feature registry.
 * Creates the registry on first call, returns cached instance thereafter.
 */
export function getContractSpecFeatureRegistry(): FeatureRegistry {
  if (!registryInstance) {
    registryInstance = createContractSpecFeatureRegistry();
  }
  return registryInstance;
}

/**
 * Reset the feature registry singleton (for testing).
 */
export function resetContractSpecFeatureRegistry(): void {
  registryInstance = null;
}
