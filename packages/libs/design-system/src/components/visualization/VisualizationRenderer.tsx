'use client';

import type { VisualizationSpec } from '@contractspec/lib.contracts-spec/visualizations';
import { useVisualizationModel } from '@contractspec/lib.presentation-runtime-react';
import {
	Visualization,
	type VisualizationInteractionHandler,
} from '@contractspec/lib.ui-kit-web/ui/visualization';
import * as React from 'react';

export interface VisualizationRendererProps {
	spec: VisualizationSpec;
	data: unknown;
	className?: string;
	height?: number;
	emptyState?: React.ReactNode;
	onDataPointPress?: VisualizationInteractionHandler;
}

export function VisualizationRenderer({
	spec,
	data,
	className,
	height,
	emptyState,
	onDataPointPress,
}: VisualizationRendererProps) {
	const model = useVisualizationModel({ spec, data });
	const hasContent =
		model.metric?.value != null ||
		model.series.some((series) => series.points.length > 0) ||
		model.table.rows.length > 0;

	if (!hasContent && emptyState) {
		return <>{emptyState}</>;
	}

	return (
		<Visualization
			className={className}
			height={height}
			model={model}
			onDataPointPress={onDataPointPress}
		/>
	);
}
