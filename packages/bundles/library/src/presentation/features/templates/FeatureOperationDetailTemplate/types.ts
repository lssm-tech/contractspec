import type {
  FeatureModuleSpec,
  OpRef,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedOperationSpec } from '@contractspec/lib.contracts-spec/serialization';

export interface FeatureOperationDetailTemplateProps {
  feature: FeatureModuleSpec;
  operationKey: string;
  operation?: OpRef;
  spec?: SerializedOperationSpec;
  className?: string;
}
