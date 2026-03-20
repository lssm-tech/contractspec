'use client';

import type { VisualizationGeoJsonSource } from '@contractspec/lib.contracts-spec/visualizations';
import {
	type ContractVisualizationRenderModel,
	formatVisualizationValue,
} from '@contractspec/lib.presentation-runtime-core';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as echarts from 'echarts/core';

export function MetricVisualization({
	className,
	model,
}: {
	className?: string;
	model: ContractVisualizationRenderModel;
}) {
	return (
		<div className={cn('space-y-2', className)}>
			<div className="text-muted-foreground text-sm">
				{model.metric?.label ?? model.title}
			</div>
			<div className="font-semibold text-3xl">
				{formatVisualizationValue(model.metric?.value, model.metric?.format)}
			</div>
			{model.metric?.comparisonValue != null ? (
				<div className="text-muted-foreground text-sm">
					Comparison:{' '}
					{formatVisualizationValue(
						model.metric.comparisonValue,
						model.metric.format
					)}
				</div>
			) : null}
			<TableAlternative model={model} />
		</div>
	);
}

export function TableAlternative({
	model,
}: {
	model: ContractVisualizationRenderModel;
}) {
	if (!model.table.columns.length || !model.table.rows.length) return null;

	return (
		<details className="rounded-md border p-3 text-sm">
			<summary className="cursor-pointer font-medium">Data summary</summary>
			<div className="mt-3 overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr>
							{model.table.columns.map((column) => (
								<th key={column.key} className="px-2 py-1 font-medium">
									{column.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{model.table.rows.slice(0, 8).map((row, index) => (
							<tr key={`summary-row-${index}`}>
								{model.table.columns.map((column) => (
									<td key={column.key} className="px-2 py-1">
										{String(row[column.key] ?? '—')}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</details>
	);
}

export function FallbackVisualization({
	className,
	model,
	reason,
}: {
	className?: string;
	model: ContractVisualizationRenderModel;
	reason: string;
}) {
	return (
		<div className={cn('space-y-3', className)}>
			<p className="text-muted-foreground text-sm">{reason}</p>
			<TableAlternative model={model} />
		</div>
	);
}

export function shouldRenderEChart(model: ContractVisualizationRenderModel) {
	if (model.kind === 'metric') return false;
	if (model.kind === 'geo' && model.geo?.mode === 'slippy-map') return false;
	if (model.kind === 'geo' && model.geo?.geoJson?.type === 'url') return false;
	return true;
}

export function registerGeoMap(model: ContractVisualizationRenderModel) {
	if (model.kind !== 'geo' || model.geo?.geoJson?.type !== 'inline') return;
	registerInlineMap(model.geo.geoJson);
}

function registerInlineMap(geoJson: VisualizationGeoJsonSource) {
	if (geoJson.type !== 'inline') return;
	echarts.registerMap('contractspec-visualization-geo', geoJson.data as never);
}
