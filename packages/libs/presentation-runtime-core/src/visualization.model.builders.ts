import type { VisualizationSpec } from '@contractspec/lib.contracts-spec/visualizations';
import {
	createAxis,
	createMeasureSeries,
	createValueAxis,
	defaultSeries,
	numericPathValue,
	numericValue,
	readDimensionValue,
	readValue,
	stringValue,
	type VisualizationModelMaps,
} from './visualization.model.helpers';
import type { ContractVisualizationRenderModel } from './visualization.types';

type VisualizationModelBase = Omit<
	ContractVisualizationRenderModel,
	'series' | 'metric' | 'xAxis' | 'yAxis' | 'geo'
>;

export function buildMetricModel(
	base: VisualizationModelBase,
	config: Extract<VisualizationSpec['visualization'], { kind: 'metric' }>,
	rows: Record<string, unknown>[],
	maps: VisualizationModelMaps
): ContractVisualizationRenderModel {
	const measure = maps.measures.get(config.measure);
	const comparison = config.comparisonMeasure
		? maps.measures.get(config.comparisonMeasure)
		: undefined;
	const currentRow = rows.at(-1) ?? {};
	const sparkline = config.sparkline
		? createMeasureSeries(
				config.sparkline.measure ?? config.measure,
				maps.measures,
				rows,
				maps.dimensions.get(config.sparkline.dimension)
			)
		: null;

	return {
		...base,
		series: sparkline ? [sparkline] : [],
		metric: {
			label: measure?.label ?? config.measure,
			value: readValue(currentRow, measure),
			comparisonValue: comparison
				? readValue(currentRow, comparison)
				: undefined,
			format: measure?.format,
		},
	};
}

export function buildCartesianModel(
	base: VisualizationModelBase,
	config: Extract<VisualizationSpec['visualization'], { kind: 'cartesian' }>,
	rows: Record<string, unknown>[],
	maps: VisualizationModelMaps
): ContractVisualizationRenderModel {
	const series = (config.series ?? defaultSeries(config.yMeasures ?? []))
		.map((seriesItem) =>
			createMeasureSeries(
				seriesItem.measure,
				maps.measures,
				rows,
				maps.dimensions.get(config.xDimension),
				seriesItem
			)
		)
		.filter((item): item is NonNullable<typeof item> => Boolean(item));

	return {
		...base,
		series,
		xAxis: createAxis(maps.dimensions.get(config.xDimension)),
		yAxis: createValueAxis(config.yMeasures?.[0], maps.measures),
	};
}

export function buildDistributionModel(
	base: VisualizationModelBase,
	config: Extract<
		VisualizationSpec['visualization'],
		{ kind: 'pie' | 'funnel' }
	>,
	rows: Record<string, unknown>[],
	maps: VisualizationModelMaps
): ContractVisualizationRenderModel {
	const nameDimension = maps.dimensions.get(config.nameDimension);
	const valueMeasure = maps.measures.get(config.valueMeasure);

	return {
		...base,
		series: [
			{
				key: valueMeasure?.key ?? config.valueMeasure,
				label: valueMeasure?.label ?? config.valueMeasure,
				type: config.kind,
				points: rows.map((row, index) => ({
					id: `${config.kind}-${index}`,
					raw: row,
					name: stringValue(row, nameDimension),
					value: numericValue(row, valueMeasure),
				})),
			},
		],
	};
}

export function buildHeatmapModel(
	base: VisualizationModelBase,
	config: Extract<VisualizationSpec['visualization'], { kind: 'heatmap' }>,
	rows: Record<string, unknown>[],
	maps: VisualizationModelMaps
): ContractVisualizationRenderModel {
	const xDimension = maps.dimensions.get(config.xDimension);
	const yDimension = maps.dimensions.get(config.yDimension);
	const valueMeasure = maps.measures.get(config.valueMeasure);

	return {
		...base,
		series: [
			{
				key: config.valueMeasure,
				label: valueMeasure?.label ?? config.valueMeasure,
				type: 'heatmap',
				points: rows.map((row, index) => ({
					id: `heatmap-${index}`,
					raw: row,
					name: stringValue(row, yDimension),
					x: readDimensionValue(row, xDimension),
					y: numericValue(row, valueMeasure),
					value: numericValue(row, valueMeasure),
				})),
			},
		],
		xAxis: createAxis(xDimension),
		yAxis: createAxis(yDimension),
	};
}

export function buildGeoModel(
	base: VisualizationModelBase,
	config: Extract<VisualizationSpec['visualization'], { kind: 'geo' }>,
	rows: Record<string, unknown>[],
	maps: VisualizationModelMaps
): ContractVisualizationRenderModel {
	return {
		...base,
		series: [
			{
				key: 'geo',
				label: 'Geo',
				type: config.variant ?? 'scatter',
				points: rows.map((row, index) => ({
					id: `geo-${index}`,
					raw: row,
					name: config.nameDimension
						? stringValue(row, maps.dimensions.get(config.nameDimension))
						: undefined,
					value: config.valueMeasure
						? numericValue(row, maps.measures.get(config.valueMeasure))
						: undefined,
					latitude: numericPathValue(
						row,
						maps.dimensions.get(config.latitudeDimension ?? '')
					),
					longitude: numericPathValue(
						row,
						maps.dimensions.get(config.longitudeDimension ?? '')
					),
				})),
			},
		],
		geo: {
			mode: config.mode ?? 'chart',
			variant: config.variant ?? 'scatter',
			geoJson: config.geoJson,
		},
	};
}
