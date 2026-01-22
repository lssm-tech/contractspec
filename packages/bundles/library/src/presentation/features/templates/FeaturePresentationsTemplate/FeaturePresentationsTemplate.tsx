'use client';

import {
  PageHeaderResponsive,
  Breadcrumbs,
} from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { FeatureListTemplateProps } from '../types';
import { FeaturePresentationsList } from '../../organisms/FeaturePresentationsList';

export function FeaturePresentationsTemplate({
  feature,
  onBack,
  className,
}: FeatureListTemplateProps) {
  return (
    <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
      <PageHeaderResponsive
        title="Presentations"
        subtitle={`Presentations defined in ${feature.meta.title ?? feature.meta.key}`}
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: 'Features', href: '/features' },
              { label: feature.meta.title || feature.meta.key, href: `/features/${feature.meta.key}` },
              { label: 'Presentations' },
            ]}
          />
        }
      />
      <FeaturePresentationsList feature={feature} />
    </VStack>
  );
}
