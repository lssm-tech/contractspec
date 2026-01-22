import type {
  FeatureModuleSpec,
  OpRef,
} from '@contractspec/lib.contracts/features';
import type { SerializedOperationSpec } from '@contractspec/lib.contracts/serialization';

export interface FeatureOperationDetailTemplateProps {
  feature: FeatureModuleSpec;
  operationKey: string;
  operation?: OpRef;
  spec?: SerializedOperationSpec;
  className?: string;
}
