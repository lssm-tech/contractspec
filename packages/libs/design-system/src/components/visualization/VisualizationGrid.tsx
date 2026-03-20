'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';

export interface VisualizationGridProps {
	children: React.ReactNode;
	className?: string;
}

export function VisualizationGrid({
	children,
	className,
}: VisualizationGridProps) {
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3',
				className
			)}
		>
			{children}
		</div>
	);
}
