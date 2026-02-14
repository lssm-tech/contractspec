'use client';

import { EntityCard } from '@contractspec/lib.design-system';
import { Layout } from 'lucide-react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';
import { resolveSerializedPresentationSpec } from '../../../features';

export function FeaturePresentationsList({
  feature,
}: {
  feature: FeatureModuleSpec;
}) {
  if (!feature.presentations?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feature.presentations.map((pres) => {
        const spec = resolveSerializedPresentationSpec(pres.key, pres.version);

        return (
          <EntityCard
            key={pres.key}
            cardTitle={pres.key}
            cardSubtitle={`v${pres.version}`}
            footer={spec?.meta.description}
            icon={<Layout className="h-4 w-4" />}
            href={`/features/${feature.meta.key}/presentations/${pres.key}`}
          />
        );
      })}
    </div>
  );
}
