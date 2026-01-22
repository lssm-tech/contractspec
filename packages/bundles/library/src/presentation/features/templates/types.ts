import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureListTemplateProps {
  feature: FeatureModuleSpec;
  onBack?: () => void;
  className?: string;
}
