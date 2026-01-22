import type { FeatureModuleSpec, EventRef } from '@contractspec/lib.contracts/features';

export interface FeatureEventDetailTemplateProps {
  feature: FeatureModuleSpec;
  eventKey: string;
  event?: EventRef;
  spec?: any; 
  onBack?: () => void;
  className?: string;
}
