import type {
  FeatureModuleSpec,
  PresentationRef,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedPresentationSpec } from '@contractspec/lib.contracts-spec/serialization';

export interface FeaturePresentationDetailTemplateProps {
  feature: FeatureModuleSpec;
  presentationKey: string;
  presentation?: PresentationRef;
  spec?: SerializedPresentationSpec;
  onBack?: () => void;
  className?: string;
}
