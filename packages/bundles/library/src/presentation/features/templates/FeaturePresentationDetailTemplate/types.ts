import type { FeatureModuleSpec, PresentationRef } from '@contractspec/lib.contracts/features';

export interface FeaturePresentationDetailTemplateProps {
  feature: FeatureModuleSpec;
  presentationKey: string;
  presentation?: PresentationRef;
  spec?: any; 
  onBack?: () => void;
  className?: string;
}
