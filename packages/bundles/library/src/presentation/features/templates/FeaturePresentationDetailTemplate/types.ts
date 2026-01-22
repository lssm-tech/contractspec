import type {
  FeatureModuleSpec,
  PresentationRef,
} from '@contractspec/lib.contracts/features';
import type { SerializedPresentationSpec } from '@contractspec/lib.contracts/serialization';

export interface FeaturePresentationDetailTemplateProps {
  feature: FeatureModuleSpec;
  presentationKey: string;
  presentation?: PresentationRef;
  spec?: SerializedPresentationSpec;
  onBack?: () => void;
  className?: string;
}
