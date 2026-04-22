'use client';

import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import * as React from 'react';
import {
	resolveTranslationNode,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import type { VisualizationSurfaceItem } from './types';
import { VisualizationCard } from './VisualizationCard.native';

export interface ComparisonViewProps {
	items: VisualizationSurfaceItem[];
	title?: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
}

export function ComparisonView({
	items,
	title = 'Comparison',
	description,
	className,
}: ComparisonViewProps) {
	const translate = useDesignSystemTranslation();
	return (
		<VStack gap="md" className={className}>
			<VStack gap="xs">
				<Text className="font-semibold text-xl">
					{resolveTranslationNode(title, translate)}
				</Text>
				{description ? (
					<Text className="text-muted-foreground text-sm">
						{resolveTranslationNode(description, translate)}
					</Text>
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
