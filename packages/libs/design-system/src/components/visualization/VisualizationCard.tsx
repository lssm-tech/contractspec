'use client';

import type { VisualizationSpec } from '@contractspec/lib.contracts-spec/visualizations';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import {
	resolveTranslationNode,
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import { VisualizationRenderer } from './VisualizationRenderer';

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
	const translate = useDesignSystemTranslation();
	const resolvedTitle =
		title ?? resolveTranslationNode(spec.meta.title, translate);
	const resolvedDescription =
		description ?? resolveTranslationString(spec.meta.description, translate);

	return (
		<Card className={className}>
			{resolvedTitle || resolvedDescription ? (
				<CardHeader className="gap-2">
					{resolvedTitle ? <CardTitle>{resolvedTitle}</CardTitle> : null}
					{resolvedDescription ? (
						<CardDescription>{resolvedDescription}</CardDescription>
					) : null}
				</CardHeader>
			) : null}
			<CardContent
				className={cn(
					resolvedTitle || resolvedDescription ? 'pt-0' : '',
					contentClassName
				)}
			>
				<VisualizationRenderer data={data} height={height} spec={spec} />
			</CardContent>
			{footer ? <CardFooter>{footer}</CardFooter> : null}
		</Card>
	);
}
