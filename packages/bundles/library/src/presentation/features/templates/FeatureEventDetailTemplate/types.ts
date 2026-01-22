import type {
  EventRef,
  FeatureModuleSpec,
} from '@contractspec/lib.contracts/features';
import type { SerializedEventSpec } from '@contractspec/lib.contracts/serialization';

export interface FeatureEventDetailTemplateProps {
  feature: FeatureModuleSpec;
  eventKey: string;
  event?: EventRef;
  spec?: SerializedEventSpec;
  className?: string;
}
