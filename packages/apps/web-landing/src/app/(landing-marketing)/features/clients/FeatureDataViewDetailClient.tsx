'use client';

import { FeatureDataViewDetailTemplate } from '@contractspec/bundle.library/presentation/features';
import type {
  FeatureModuleSpec,
  DataViewRef,
} from '@contractspec/lib.contracts/features';
import type { SerializedDataViewSpec } from '@contractspec/bundle.library/features';

export interface FeatureDataViewDetailClientProps {
  feature: FeatureModuleSpec;
  viewKey: string;
  view?: DataViewRef;
  spec?: SerializedDataViewSpec;
}

/**
 * Client component wrapper for FeatureDataViewDetailTemplate.
 * Handles client-side navigation (back) for the data view detail page.
 */
export function FeatureDataViewDetailClient({
  feature,
  viewKey,
  view,
  spec,
}: FeatureDataViewDetailClientProps) {
  return (
    <FeatureDataViewDetailTemplate
      feature={feature}
      viewKey={viewKey}
      view={view}
      spec={spec}
    />
  );
}
