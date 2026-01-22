import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';
import type { FormRef } from '@contractspec/lib.contracts';

export interface FeatureFormDetailTemplateProps {
  feature: FeatureModuleSpec;
  formKey: string;
  form?: FormRef;
  spec?: any; 
  onBack?: () => void;
  className?: string;
}
