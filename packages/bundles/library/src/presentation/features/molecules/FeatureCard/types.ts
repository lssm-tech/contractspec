import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureCardProps {
  /** The feature to display. */
  feature: FeatureModuleSpec;
  /** Callback when the card is clicked. */
  onSelect?: (feature: FeatureModuleSpec) => void;
  /** Additional class name. */
  className?: string;
}
