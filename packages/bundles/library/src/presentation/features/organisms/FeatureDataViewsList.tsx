'use client';

import { EntityCard } from '@contractspec/lib.design-system';
import { Table } from 'lucide-react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';
import { resolveSerializedDataViewSpec } from '../../../features';

export function FeatureDataViewsList({
  feature,
}: {
  feature: FeatureModuleSpec;
}) {
  if (!feature.dataViews?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feature.dataViews.map((view) => {
        const spec = resolveSerializedDataViewSpec(view.key, view.version);

        return (
          <EntityCard
            key={view.key}
            cardTitle={view.key}
            cardSubtitle={`v${view.version}`}
            footer={spec?.meta.description}
            icon={<Table className="h-4 w-4" />}
            href={`/features/${feature.meta.key}/dataviews/${view.key}`}
          />
        );
      })}
    </div>
  );
}
