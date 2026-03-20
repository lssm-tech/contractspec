'use client';

import * as React from 'react';

export interface HoverPreviewStat {
	label: React.ReactNode;
	value: React.ReactNode;
	hint?: React.ReactNode;
}

export function HoverPreviewStats({
	title,
	stats,
	footer,
	className,
}: {
	title?: React.ReactNode;
	stats: HoverPreviewStat[];
	footer?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={['space-y-2', className].filter(Boolean).join(' ')}>
			{title && <div className="truncate font-medium text-sm">{title}</div>}
			<div className="grid grid-cols-1 gap-2">
				{stats.map((s, i) => (
					<div key={i} className="flex items-baseline justify-between gap-3">
						<div className="text-base text-muted-foreground">{s.label}</div>
						<div className="truncate font-semibold text-sm">{s.value}</div>
					</div>
				))}
			</div>
			{footer && (
				<div className="pt-1 text-base text-muted-foreground">{footer}</div>
			)}
		</div>
	);
}
