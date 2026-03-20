'use client';

import {
	Breadcrumbs,
	PageHeaderResponsive,
} from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { FeatureEventsList } from '../../organisms/FeatureEventsList';
import type { FeatureListTemplateProps } from '../types';

export function FeatureEventsTemplate({
	feature,
	className,
}: FeatureListTemplateProps) {
	return (
		<VStack gap="lg" className={cn('mx-auto w-full max-w-5xl p-6', className)}>
			<PageHeaderResponsive
				title="Events"
				subtitle={`Events defined in ${feature.meta.title ?? feature.meta.key}`}
				breadcrumb={
					<Breadcrumbs
						items={[
							{ label: 'Features', href: '/features' },
							{
								label: feature.meta.title || feature.meta.key,
								href: `/features/${feature.meta.key}`,
							},
							{ label: 'Events' },
						]}
					/>
				}
			/>
			<FeatureEventsList feature={feature} />
		</VStack>
	);
}
