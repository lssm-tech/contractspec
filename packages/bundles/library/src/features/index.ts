// Features
export { DocsFeature } from './docs.feature';
export { MCPFeature } from './mcp.feature';
export { PresentationsFeature } from './presentations.feature';

// Registry
export {
  createContractSpecFeatureRegistry,
  getContractSpecFeatureRegistry,
  resetContractSpecFeatureRegistry,
} from './registry';

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
