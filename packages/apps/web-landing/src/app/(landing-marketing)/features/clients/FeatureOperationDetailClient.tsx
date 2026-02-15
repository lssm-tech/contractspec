'use client';

import { FeatureOperationDetailTemplate } from '@contractspec/bundle.library/presentation/features';
import type {
  FeatureModuleSpec,
  OpRef,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedOperationSpec } from '@contractspec/bundle.library/features';

export interface FeatureOperationDetailClientProps {
  feature: FeatureModuleSpec;
  operationKey: string;
  operation?: OpRef;
  spec?: SerializedOperationSpec;
}

/**
 * Client component wrapper for FeatureOperationDetailTemplate.
 * Handles client-side navigation (back) for the operation detail page.
 */
export function FeatureOperationDetailClient({
  feature,
  operationKey,
  operation,
  spec,
}: FeatureOperationDetailClientProps) {
  return (
    <FeatureOperationDetailTemplate
      feature={feature}
      operationKey={operationKey}
      operation={operation}
      spec={spec}
    />
  );
}
