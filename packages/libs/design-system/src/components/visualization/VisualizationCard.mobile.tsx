'use client';

import type { VisualizationSpec } from '@contractspec/lib.contracts-spec/visualizations';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit/ui/card';
import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import * as React from 'react';
import { VisualizationRenderer } from './VisualizationRenderer.mobile';

export interface VisualizationCardProps {
	spec: VisualizationSpec;
	data: unknown;
	title?: React.ReactNode;
	description?: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
	contentClassName?: string;
	height?: number;
}

export function VisualizationCard({
	spec,
	data,
	title,
	description,
	footer,
	className,
	contentClassName,
	height,
}: VisualizationCardProps) {
	return (
		<Card className={className}>
			{title || description ? (
				<CardHeader>
					{title ? <CardTitle>{title}</CardTitle> : null}
					{description ? (
						<CardDescription>{description}</CardDescription>
					) : null}
				</CardHeader>
			) : null}
			<CardContent
				className={cn(title || description ? 'pt-0' : '', contentClassName)}
			>
				<VisualizationRenderer data={data} height={height} spec={spec} />
			</CardContent>
			{footer ? <CardFooter>{footer}</CardFooter> : null}
		</Card>
	);
}
