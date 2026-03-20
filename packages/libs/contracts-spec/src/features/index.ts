// Types
export type {
  FeatureModuleMeta,
  OpRef,
  EventRef,
  PresentationRef,
  DataViewRef,
  VisualizationRef,
  FormRef,
  WorkflowRef,
  KnowledgeRef,
  TelemetryRef,
  IntegrationRef,
  JobRef,
  DocRef,
  PolicyRef,
  TranslationRef,
  FeatureModuleSpec,
  FeatureRef,
} from './types';

// Registry
export { FeatureRegistry } from './registry';

// Install
export { installFeature, type InstallFeatureDeps } from './install';

// Validation
export { validateFeatureTargetsV2 } from './validation';
export {
  validateBundleRequires,
  type ValidateBundleRequiresResult,
  type BundleRequiresEntry,
} from './validate-bundle-requires';

// Helpers
export { defineFeature } from './types';
