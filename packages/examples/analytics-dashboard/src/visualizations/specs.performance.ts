import { defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const QUERY_REF = { key: 'analytics.query.execute', version: '1.0.0' } as const;
const META = {
	version: '1.0.0',
	domain: 'analytics',
	stability: 'experimental' as const,
	owners: ['@example.analytics-dashboard'],
	tags: ['analytics', 'dashboard', 'visualization'],
};

export const RevenueMetricVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.revenue-metric',
		title: 'Revenue Snapshot',
		description: 'Current recurring revenue with prior-period comparison.',
		goal: 'Highlight the headline commercial metric for the dashboard.',
		context: 'Executive revenue overview.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'totalRevenue',
		comparisonMeasure: 'priorRevenue',
		dimensions: [
			{ key: 'period', label: 'Period', dataPath: 'period', type: 'time' },
		],
		measures: [
			{
				key: 'totalRevenue',
				label: 'Revenue',
				dataPath: 'totalRevenue',
				format: 'currency',
			},
			{
				key: 'priorRevenue',
				label: 'Prior Revenue',
				dataPath: 'priorRevenue',
				format: 'currency',
			},
		],
		sparkline: { dimension: 'period', measure: 'totalRevenue' },
		table: { caption: 'Revenue trend and prior period values.' },
	},
});

export const RevenueTrendVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.revenue-trend',
		title: 'Revenue Trend',
		description: 'Monthly revenue progression for the current quarter.',
		goal: 'Track whether revenue growth is accelerating or stalling.',
		context: 'Quarterly commercial dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'line',
		xDimension: 'date',
		yMeasures: ['revenue'],
		dimensions: [
			{ key: 'date', label: 'Month', dataPath: 'date', type: 'time' },
		],
		measures: [
			{
				key: 'revenue',
				label: 'Revenue',
				dataPath: 'revenue',
				format: 'currency',
				color: '#0f766e',
			},
		],
		thresholds: [
			{ key: 'target', value: 140000, label: 'Target', color: '#dc2626' },
		],
		table: { caption: 'Monthly revenue values.' },
	},
});

export const RegionalRevenueVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.regional-revenue',
		title: 'Regional Revenue',
		description: 'Revenue split by sales territory.',
		goal: 'Compare the strongest and weakest performing territories.',
		context: 'Territory planning and commercial comparison.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'bar',
		xDimension: 'region',
		yMeasures: ['revenue'],
		dimensions: [
			{ key: 'region', label: 'Region', dataPath: 'region', type: 'category' },
		],
		measures: [
			{
				key: 'revenue',
				label: 'Revenue',
				dataPath: 'revenue',
				format: 'currency',
				color: '#1d4ed8',
			},
		],
		table: { caption: 'Revenue by region.' },
	},
});

export const RetentionAreaVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.retention-area',
		title: 'Retention Curve',
		description: 'Weekly retention progression across the active cohort.',
		goal: 'Show whether user retention remains above the desired floor.',
		context: 'Product health dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'area',
		xDimension: 'week',
		yMeasures: ['retentionRate'],
		dimensions: [
			{ key: 'week', label: 'Week', dataPath: 'week', type: 'category' },
		],
		measures: [
			{
				key: 'retentionRate',
				label: 'Retention',
				dataPath: 'retentionRate',
				format: 'percentage',
				color: '#16a34a',
			},
		],
		thresholds: [
			{ key: 'floor', value: 0.5, label: 'Floor', color: '#f59e0b' },
		],
		table: { caption: 'Weekly retention rate.' },
	},
});

export const PipelineScatterVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.pipeline-scatter',
		title: 'Pipeline Velocity',
		description: 'Deal-cycle length against win rate for active accounts.',
		goal: 'Spot outliers where the sales cycle is long but conversion remains weak.',
		context: 'Commercial operations dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'scatter',
		xDimension: 'cycleDays',
		yMeasures: ['winRate'],
		dimensions: [
			{
				key: 'cycleDays',
				label: 'Cycle Days',
				dataPath: 'cycleDays',
				type: 'number',
			},
		],
		measures: [
			{
				key: 'winRate',
				label: 'Win Rate',
				dataPath: 'winRate',
				format: 'percentage',
				color: '#7c3aed',
			},
			{
				key: 'arr',
				label: 'ARR',
				dataPath: 'arr',
				format: 'currency',
			},
		],
		series: [
			{
				key: 'pipeline',
				label: 'Accounts',
				measure: 'winRate',
				type: 'scatter',
				color: '#7c3aed',
			},
		],
		table: { caption: 'Sales cycle and win rate per account.' },
	},
});
