'use client';

import { FeatureEventDetailTemplate } from '@contractspec/bundle.library/presentation/features';
import type {
  EventRef,
  FeatureModuleSpec,
} from '@contractspec/lib.contracts-spec/features';
import type { SerializedEventSpec } from '@contractspec/bundle.library/features';

export interface FeatureEventDetailClientProps {
  feature: FeatureModuleSpec;
  eventKey: string;
  event?: EventRef;
  spec?: SerializedEventSpec;
}

/**
 * Client component wrapper for FeatureEventDetailTemplate.
 * Handles client-side navigation (back) for the event detail page.
 */
export function FeatureEventDetailClient({
  feature,
  eventKey,
  event,
  spec,
}: FeatureEventDetailClientProps) {
  return (
    <FeatureEventDetailTemplate
      feature={feature}
      eventKey={eventKey}
      event={event}
      spec={spec}
    />
  );
}
