import type {
  FeatureModuleSpec,
  FormRef,
} from '@contractspec/lib.contracts/features';
import type { SerializedFormSpec } from '@contractspec/lib.contracts/serialization';

export interface FeatureFormDetailTemplateProps {
  feature: FeatureModuleSpec;
  formKey: string;
  form?: FormRef;
  spec?: SerializedFormSpec;
  className?: string;
}
