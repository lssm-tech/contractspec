'use client';

import * as React from 'react';

export interface HoverPreviewMediaProps {
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	media: React.ReactNode; // image/video/illustration
	caption?: React.ReactNode;
	className?: string;
}

export function HoverPreviewMedia({
	title,
	subtitle,
	media,
	caption,
	className,
}: HoverPreviewMediaProps) {
	return (
		<div className={['space-y-2', className].filter(Boolean).join(' ')}>
			{title && <div className="truncate font-medium text-sm">{title}</div>}
			{subtitle && (
				<div className="truncate text-base text-muted-foreground">
					{subtitle}
				</div>
			)}
			<div className="rounded-md border bg-card p-1">{media}</div>
			{caption && (
				<div className="text-base text-muted-foreground">{caption}</div>
			)}
		</div>
	);
}
