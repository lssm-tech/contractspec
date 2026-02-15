import type {
  FeatureModuleSpec,
  FormRef,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedFormSpec } from '@contractspec/lib.contracts-spec/serialization';

export interface FeatureFormDetailTemplateProps {
  feature: FeatureModuleSpec;
  formKey: string;
  form?: FormRef;
  spec?: SerializedFormSpec;
  className?: string;
}
