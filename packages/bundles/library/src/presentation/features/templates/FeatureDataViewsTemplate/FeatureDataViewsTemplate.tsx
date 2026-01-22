'use client';

import {
  PageHeaderResponsive,
  Breadcrumbs,
} from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { FeatureListTemplateProps } from '../types';
import { FeatureDataViewsList } from '../../organisms/FeatureDataViewsList';

export function FeatureDataViewsTemplate({
  feature,
  className,
}: FeatureListTemplateProps) {
  return (
    <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
      <PageHeaderResponsive
        title="Data Views"
        subtitle={`Data views defined in ${feature.meta.title ?? feature.meta.key}`}
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: 'Features', href: '/features' },
              { label: feature.meta.title || feature.meta.key, href: `/features/${feature.meta.key}` },
              { label: 'Data Views' },
            ]}
          />
        }
      />
      <FeatureDataViewsList feature={feature} />
    </VStack>
  );
}
