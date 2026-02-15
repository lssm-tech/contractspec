'use client';

import { FeatureFormDetailTemplate } from '@contractspec/bundle.library/presentation/features';
import type {
  FeatureModuleSpec,
  FormRef,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedFormSpec } from '@contractspec/bundle.library/features';

export interface FeatureFormDetailClientProps {
  feature: FeatureModuleSpec;
  formKey: string;
  form?: FormRef;
  spec?: SerializedFormSpec;
}

/**
 * Client component wrapper for FeatureFormDetailTemplate.
 * Handles client-side navigation (back) for the form detail page.
 */
export function FeatureFormDetailClient({
  feature,
  formKey,
  form,
  spec,
}: FeatureFormDetailClientProps) {
  return (
    <FeatureFormDetailTemplate
      feature={feature}
      formKey={formKey}
      form={form}
      spec={spec}
    />
  );
}
