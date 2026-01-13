import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureDiscoveryProps {
  /** Callback when a feature is selected. */
  onSelectFeature?: (feature: FeatureModuleSpec) => void;
  /** Additional class name. */
  className?: string;
}
