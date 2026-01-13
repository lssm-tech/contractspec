import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureDetailProps {
  /** The feature to display. */
  feature: FeatureModuleSpec;
  /** Callback when back button is clicked. */
  onBack?: () => void;
  /** Additional class name. */
  className?: string;
}
