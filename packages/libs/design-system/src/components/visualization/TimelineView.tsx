'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import type { VisualizationSurfaceItem } from './types';
import { VisualizationCard } from './VisualizationCard';

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
		<section className={cn('space-y-4', className)}>
			<div className="space-y-1">
				<h3 className="font-semibold text-lg">{title}</h3>
				{description ? (
					<p className="text-muted-foreground text-sm">{description}</p>
				) : null}
			</div>
			<div className="space-y-4">
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
