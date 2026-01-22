import type {
  FeatureModuleSpec,
  DataViewRef,
} from '@contractspec/lib.contracts/features';
import type { SerializedDataViewSpec } from '@contractspec/lib.contracts/serialization';

export interface FeatureDataViewDetailTemplateProps {
  feature: FeatureModuleSpec;
  viewKey: string;
  view?: DataViewRef;
  spec?: SerializedDataViewSpec;
  className?: string;
}
