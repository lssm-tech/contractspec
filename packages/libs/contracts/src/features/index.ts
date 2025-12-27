// Types
export type {
  FeatureModuleMeta,
  OpRef,
  EventRef,
  PresentationRef,
  FeatureModuleSpec,
  FeatureRef,
} from './types';

// Registry
export { FeatureRegistry } from './registry';

// Install
export { installFeature, type InstallFeatureDeps } from './install';

// Validation
export { validateFeatureTargetsV2 } from './validation';
