'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import {
	resolveTranslationNode,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import type { VisualizationSurfaceItem } from './types';
import { VisualizationCard } from './VisualizationCard';

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
		<section className={cn('space-y-4', className)}>
			<div className="space-y-1">
				<h3 className="font-semibold text-lg">
					{resolveTranslationNode(title, translate)}
				</h3>
				{description ? (
					<p className="text-muted-foreground text-sm">
						{resolveTranslationNode(description, translate)}
					</p>
				) : null}
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
			</div>
		</section>
	);
}
