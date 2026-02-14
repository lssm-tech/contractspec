'use client';

import { EntityCard } from '@contractspec/lib.design-system';
import { Zap } from 'lucide-react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';
import { resolveSerializedOperationSpec } from '../../../features/contracts-registry';

export function FeatureOperationsList({
  feature,
}: {
  feature: FeatureModuleSpec;
}) {
  if (!feature.operations?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feature.operations.map((op) => {
        const spec = resolveSerializedOperationSpec(op.key, op.version);

        return (
          <EntityCard
            key={op.key}
            cardTitle={op.key}
            cardSubtitle={`v${op.version}`}
            footer={spec?.meta.description}
            icon={<Zap className="h-4 w-4" />}
            href={`/features/${feature.meta.key}/operations/${op.key}`}
          />
        );
      })}
    </div>
  );
}
