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
  // Operations
  createContractSpecOperationRegistry,
  getContractSpecOperationRegistry,
  resetContractSpecOperationRegistry,
  resolveOperationSpec,
  // Events
  createContractSpecEventRegistry,
  getContractSpecEventRegistry,
  resetContractSpecEventRegistry,
  resolveEventSpec,
  // Presentations
  createContractSpecPresentationRegistry,
  getContractSpecPresentationRegistry,
  resetContractSpecPresentationRegistry,
  resolvePresentationSpec,
  // DataViews
  createContractSpecDataViewRegistry,
  getContractSpecDataViewRegistry,
  resetContractSpecDataViewRegistry,
  resolveDataViewSpec,
  // Forms
  createContractSpecFormRegistry,
  getContractSpecFormRegistry,
  resetContractSpecFormRegistry,
  resolveFormSpec,
  // Serialized spec resolution (for Server -> Client Component transfer)
  resolveSerializedOperationSpec,
  resolveSerializedEventSpec,
  resolveSerializedPresentationSpec,
  resolveSerializedDataViewSpec,
  resolveSerializedFormSpec,
  // Reset all
  resetAllContractSpecRegistries,
} from './contracts-registry';

// Serialized spec types for client components
export type {
  SerializedOperationSpec,
  SerializedEventSpec,
  SerializedPresentationSpec,
  SerializedDataViewSpec,
  SerializedFormSpec,
  SerializedSchemaModel,
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
