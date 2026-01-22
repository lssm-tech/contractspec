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

import type { FeatureModuleSpec } from './types';

// Registry
export { FeatureRegistry } from './registry';

// Install
export { installFeature, type InstallFeatureDeps } from './install';

// Validation
export { validateFeatureTargetsV2 } from './validation';

/**
 * Helper to define a Feature.
 */
export const defineFeature = (spec: FeatureModuleSpec): FeatureModuleSpec =>
  spec;
