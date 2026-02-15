'use client';

import { EntityCard } from '@contractspec/lib.design-system';
import { Radio } from 'lucide-react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';
import { resolveSerializedEventSpec } from '../../../features';

export function FeatureEventsList({ feature }: { feature: FeatureModuleSpec }) {
  if (!feature.events?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feature.events.map((ev) => {
        const spec = resolveSerializedEventSpec(ev.key, ev.version);
        return (
          <EntityCard
            key={ev.key}
            cardTitle={ev.key}
            cardSubtitle={`v${ev.version}`}
            footer={spec?.meta.description}
            icon={<Radio className="h-4 w-4" />}
            href={`/features/${feature.meta.key}/events/${ev.key}`}
          />
        );
      })}
    </div>
  );
}
