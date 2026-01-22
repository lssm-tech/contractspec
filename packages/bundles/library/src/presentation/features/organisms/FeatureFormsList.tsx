'use client';

import { EntityCard } from '@contractspec/lib.design-system';
import { FormInput } from 'lucide-react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';
import { resolveSerializedFormSpec } from '../../../features';

export function FeatureFormsList({ feature }: { feature: FeatureModuleSpec }) {
  if (!feature.forms?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feature.forms.map((form) => {
        const spec = resolveSerializedFormSpec(form.key, form.version);

        return (
          <EntityCard
            key={form.key}
            cardTitle={form.key}
            cardSubtitle={form.version ? `v${form.version}` : undefined}
            footer={spec?.meta.description}
            icon={<FormInput className="h-4 w-4" />}
            href={`/features/${feature.meta.key}/forms/${form.key}`}
          />
        );
      })}
    </div>
  );
}
