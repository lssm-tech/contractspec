'use client';

import { PageHeaderResponsive, Breadcrumbs } from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { FeatureDetail } from '../../organisms/FeatureDetail';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

export interface FeatureOverviewTemplateProps {
  feature: FeatureModuleSpec;
  className?: string;
}

export function FeatureOverviewTemplate({
  feature,
  className,
}: FeatureOverviewTemplateProps) {
  return (
    <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
      <PageHeaderResponsive
        title={feature.meta.title || feature.meta.key}
        subtitle={feature.meta.description || 'Feature overview'}
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: 'Features', href: '/features' },
              { label: feature.meta.title || feature.meta.key },
            ]}
          />
        }
      />
      <FeatureDetail feature={feature} />
    </VStack>
  );
}
