import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureDetailProps {
  /** The feature to display. */
  feature: FeatureModuleSpec;
  /** Additional class name. */
  className?: string;
}
