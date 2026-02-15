'use client';

import { FeaturePresentationDetailTemplate } from '@contractspec/bundle.library/presentation/features';
import type {
  FeatureModuleSpec,
  PresentationRef,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedPresentationSpec } from '@contractspec/bundle.library/features';

export interface FeaturePresentationDetailClientProps {
  feature: FeatureModuleSpec;
  presentationKey: string;
  presentation?: PresentationRef;
  spec?: SerializedPresentationSpec;
}

/**
 * Client component wrapper for FeaturePresentationDetailTemplate.
 * Handles client-side navigation (back) for the presentation detail page.
 */
export function FeaturePresentationDetailClient({
  feature,
  presentationKey,
  presentation,
  spec,
}: FeaturePresentationDetailClientProps) {
  return (
    <FeaturePresentationDetailTemplate
      feature={feature}
      presentationKey={presentationKey}
      presentation={presentation}
      spec={spec}
    />
  );
}
