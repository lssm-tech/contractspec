// Features
export * from './docs';
export { DocsFeature } from './docs.feature';
export { MCPFeature } from './mcp.feature';
export { PresentationsFeature } from './presentations.feature';

// Feature Registry
export {
  createContractSpecFeatureRegistry,
  getContractSpecFeatureRegistry,
  resetContractSpecFeatureRegistry,
} from './registry';

// Contracts Registry (for resolving OpRef/EventRef/PresentationRef to full specs)
export {
  createContractSpecOperationRegistry,
  getContractSpecOperationRegistry,
  resetContractSpecOperationRegistry,
  resolveOperationSpec,
} from './contracts-registry';

// Re-export types and utilities from lib.contracts
export type {
  FeatureModuleSpec,
  FeatureModuleMeta,
  OpRef,
  EventRef,
  PresentationRef,
  FeatureRef,
} from '@contractspec/lib.contracts/features';

export { FeatureRegistry } from '@contractspec/lib.contracts/features';
