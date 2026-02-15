// Types
export type {
  FeatureModuleMeta,
  OpRef,
  EventRef,
  PresentationRef,
  DataViewRef,
  FormRef,
  FeatureModuleSpec,
  FeatureRef,
} from './types';

// Registry
export { FeatureRegistry } from './registry';

// Install
export { installFeature, type InstallFeatureDeps } from './install';

// Validation
export { validateFeatureTargetsV2 } from './validation';

// Helpers
export { defineFeature } from './types';
