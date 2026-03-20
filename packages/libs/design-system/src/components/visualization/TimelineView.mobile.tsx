'use client';

import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import * as React from 'react';
import type { VisualizationSurfaceItem } from './types';
import { VisualizationCard } from './VisualizationCard.mobile';

export interface TimelineViewProps {
	items: VisualizationSurfaceItem[];
	title?: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
}

export function TimelineView({
	items,
	title = 'Timeline',
	description,
	className,
}: TimelineViewProps) {
	return (
		<VStack gap="md" className={className}>
			<VStack gap="xs">
				<Text className="font-semibold text-xl">{title}</Text>
				{description ? (
					<Text className="text-muted-foreground text-sm">{description}</Text>
				) : null}
			</VStack>
			{items.map((item) => (
				<VisualizationCard
					key={item.key}
					className={item.className}
					data={item.data}
					description={item.description}
					footer={item.footer}
					height={item.height}
					spec={item.spec}
					title={item.title}
				/>
			))}
		</VStack>
	);
}
