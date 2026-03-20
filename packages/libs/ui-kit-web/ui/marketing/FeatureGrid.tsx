import * as React from 'react';
import { cn } from '../utils';

export interface FeatureItem {
	title: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
}

export function FeatureGrid({
	items,
	columns = 3,
	className,
}: {
	items: FeatureItem[];
	columns?: 2 | 3 | 4;
	className?: string;
}) {
	const gridCols =
		columns === 4
			? 'md:grid-cols-4'
			: columns === 2
				? 'md:grid-cols-2'
				: 'md:grid-cols-3';
	return (
		<section className={cn('mx-auto max-w-6xl py-12', className)}>
			<div className={cn('grid grid-cols-1 gap-6', gridCols)}>
				{items.map((it, idx) => (
					<div key={idx} className="rounded-lg border p-6">
						{it.icon && <div className="mb-3 text-primary">{it.icon}</div>}
						<h3 className="font-semibold text-lg">{it.title}</h3>
						{it.description && (
							<p className="mt-2 text-base text-muted-foreground">
								{it.description}
							</p>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
