import {
	ShowcaseFunnelVisualization,
	ShowcaseGeoVisualization,
	ShowcaseHeatmapVisualization,
	ShowcasePieVisualization,
} from './specs.breakdown';
import {
	ShowcaseAreaVisualization,
	ShowcaseBarVisualization,
	ShowcaseLineVisualization,
	ShowcaseScatterVisualization,
} from './specs.cartesian';
import { ShowcaseMetricVisualization } from './specs.metric';
import { VisualizationShowcaseSampleData } from './data';
import { visualizationRefKey } from './registry';

function sampleDataFor(ref: { key: string; version: string }) {
	return VisualizationShowcaseSampleData[visualizationRefKey(ref)];
}

export function createVisualizationShowcaseGridItems() {
	return [
		{
			key: 'metric',
			spec: ShowcaseMetricVisualization,
			data: sampleDataFor(ShowcaseMetricVisualization.meta),
			title: 'Metric',
			description: 'Metric primitive with comparison and sparkline support.',
			height: 220,
		},
		{
			key: 'line',
			spec: ShowcaseLineVisualization,
			data: sampleDataFor(ShowcaseLineVisualization.meta),
			title: 'Line',
		},
		{
			key: 'bar',
			spec: ShowcaseBarVisualization,
			data: sampleDataFor(ShowcaseBarVisualization.meta),
			title: 'Bar',
		},
		{
			key: 'area',
			spec: ShowcaseAreaVisualization,
			data: sampleDataFor(ShowcaseAreaVisualization.meta),
			title: 'Area',
		},
		{
			key: 'scatter',
			spec: ShowcaseScatterVisualization,
			data: sampleDataFor(ShowcaseScatterVisualization.meta),
			title: 'Scatter',
		},
		{
			key: 'pie',
			spec: ShowcasePieVisualization,
			data: sampleDataFor(ShowcasePieVisualization.meta),
			title: 'Pie',
		},
		{
			key: 'heatmap',
			spec: ShowcaseHeatmapVisualization,
			data: sampleDataFor(ShowcaseHeatmapVisualization.meta),
			title: 'Heatmap',
			height: 320,
		},
		{
			key: 'funnel',
			spec: ShowcaseFunnelVisualization,
			data: sampleDataFor(ShowcaseFunnelVisualization.meta),
			title: 'Funnel',
		},
		{
			key: 'geo',
			spec: ShowcaseGeoVisualization,
			data: sampleDataFor(ShowcaseGeoVisualization.meta),
			title: 'Geo',
			height: 320,
		},
	];
}

export function createVisualizationShowcaseComparisonItems() {
	return [
		{
			key: 'comparison-bar',
			spec: ShowcaseBarVisualization,
			data: sampleDataFor(ShowcaseBarVisualization.meta),
			title: 'Segment Revenue',
			height: 240,
		},
		{
			key: 'comparison-pie',
			spec: ShowcasePieVisualization,
			data: sampleDataFor(ShowcasePieVisualization.meta),
			title: 'Channel Mix',
			height: 240,
		},
		{
			key: 'comparison-funnel',
			spec: ShowcaseFunnelVisualization,
			data: sampleDataFor(ShowcaseFunnelVisualization.meta),
			title: 'Pipeline Funnel',
			height: 240,
		},
	];
}

export function createVisualizationShowcaseTimelineItems() {
	return [
		{
			key: 'timeline-line',
			spec: ShowcaseLineVisualization,
			data: sampleDataFor(ShowcaseLineVisualization.meta),
			title: 'Throughput',
			height: 220,
		},
		{
			key: 'timeline-area',
			spec: ShowcaseAreaVisualization,
			data: sampleDataFor(ShowcaseAreaVisualization.meta),
			title: 'Retention',
			height: 220,
		},
	];
}
