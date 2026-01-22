import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';
import type { DataViewRef } from '@contractspec/lib.contracts';

export interface FeatureDataViewDetailTemplateProps {
  feature: FeatureModuleSpec;
  viewKey: string;
  view?: DataViewRef;
  spec?: any; 
  onBack?: () => void;
  className?: string;
}
