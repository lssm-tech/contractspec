import {
	buildVisualizationEChartsOption,
	type ContractVisualizationRenderModel,
	formatVisualizationValue,
} from '@contractspec/lib.presentation-runtime-core';
import type {
	SharedVisualizationInteractionHandler,
	SharedVisualizationProps,
} from '@contractspec/lib.ui-kit-core/interfaces';
import SvgChart, { SVGRenderer } from '@wuba/react-native-echarts/svgChart';
import {
	BarChart,
	FunnelChart,
	HeatmapChart,
	LineChart,
	MapChart,
	PieChart,
	ScatterChart,
} from 'echarts/charts';
import {
	AriaComponent,
	GeoComponent,
	GridComponent,
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import { VStack } from '../stack';
import { Text } from '../text';

echarts.use([
	AriaComponent,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent,
	GeoComponent,
	SVGRenderer,
	LineChart,
	BarChart,
	PieChart,
	ScatterChart,
	HeatmapChart,
	FunnelChart,
	MapChart,
]);

export type VisualizationInteractionHandler =
	SharedVisualizationInteractionHandler;

export interface VisualizationProps
	extends Omit<SharedVisualizationProps, 'model'> {
	model: ContractVisualizationRenderModel;
}

export function Visualization({
	model,
	className,
	height = 280,
	onDataPointPress,
}: VisualizationProps) {
	const chartRef = useRef<unknown>(null);
	const [width, setWidth] = useState(320);
	const option = useMemo(() => buildVisualizationEChartsOption(model), [model]);

	useEffect(() => {
		if (!shouldRenderEChart(model) || !chartRef.current || width <= 0) return;
		if (model.kind === 'geo' && model.geo?.geoJson?.type === 'inline') {
			echarts.registerMap(
				'contractspec-visualization-geo',
				model.geo.geoJson.data as never
			);
		}
		const chart = echarts.init(chartRef.current as never, 'light', {
			renderer: 'svg',
			width,
			height,
		});
		chart.setOption(option);
		if (onDataPointPress) {
			chart.on('click', onDataPointPress);
		}
		return () => {
			if (onDataPointPress) {
				chart.off('click', onDataPointPress);
			}
			chart.dispose();
		};
	}, [height, model, onDataPointPress, option, width]);

	if (model.kind === 'metric') {
		return <MetricVisualization className={className} model={model} />;
	}

	if (!shouldRenderEChart(model)) {
		return <FallbackVisualization className={className} model={model} />;
	}

	return (
		<VStack gap="sm" className={className}>
			<View
				className="w-full"
				onLayout={(event: LayoutChangeEvent) =>
					setWidth(Math.max(event.nativeEvent.layout.width, 1))
				}
				style={{ height }}
			>
				<SvgChart ref={chartRef} />
			</View>
			<SummaryList model={model} />
		</VStack>
	);
}

function MetricVisualization({
	className,
	model,
}: {
	className?: string;
	model: ContractVisualizationRenderModel;
}) {
	return (
		<VStack gap="xs" className={className}>
			<Text className="text-muted-foreground text-sm">
				{model.metric?.label ?? model.title}
			</Text>
			<Text className="font-semibold text-3xl">
				{formatVisualizationValue(model.metric?.value, model.metric?.format)}
			</Text>
			{model.metric?.comparisonValue != null ? (
				<Text className="text-muted-foreground text-sm">
					Comparison:{' '}
					{formatVisualizationValue(
						model.metric.comparisonValue,
						model.metric.format
					)}
				</Text>
			) : null}
			<SummaryList model={model} />
		</VStack>
	);
}

function FallbackVisualization({
	className,
	model,
}: {
	className?: string;
	model: ContractVisualizationRenderModel;
}) {
	return (
		<VStack gap="sm" className={className}>
			<Text className="text-muted-foreground text-sm">
				This visualization falls back to a summary view on native.
			</Text>
			<SummaryList model={model} />
		</VStack>
	);
}

function SummaryList({ model }: { model: ContractVisualizationRenderModel }) {
	if (!model.table.columns.length || !model.table.rows.length) return null;

	return (
		<VStack gap="xs">
			<Text className="font-medium text-sm">Data summary</Text>
			{model.table.rows.slice(0, 6).map((row, index) => (
				<Text
					key={`summary-${index}`}
					className="text-muted-foreground text-sm"
				>
					{model.table.columns
						.map(
							(column) => `${column.label}: ${String(row[column.key] ?? '—')}`
						)
						.join(' • ')}
				</Text>
			))}
		</VStack>
	);
}

function shouldRenderEChart(model: ContractVisualizationRenderModel) {
	if (model.kind === 'metric') return false;
	if (model.kind === 'geo' && model.geo?.mode === 'slippy-map') return false;
	if (model.kind === 'geo' && model.geo?.geoJson?.type === 'url') return false;
	return true;
}
