import type { FeatureRef, OpRef, FeatureModuleSpec, DataViewSpec } from '@contractspec/lib.contracts/features';

export interface FeatureOperationDetailTemplateProps {
  feature: FeatureModuleSpec;
  operationKey: string;
  operation?: OpRef;
  spec?: any; // The full OperationSpec if available
  onBack?: () => void;
  className?: string;
}
