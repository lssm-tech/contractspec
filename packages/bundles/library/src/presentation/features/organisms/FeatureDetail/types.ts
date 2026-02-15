import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';

export interface FeatureDetailProps {
  /** The feature to display. */
  feature: FeatureModuleSpec;
  /** Additional class name. */
  className?: string;
}
