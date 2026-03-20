import { defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const SHOWCASE_QUERY_REF = {
	key: 'visualization-showcase.data.snapshot',
	version: '1.0.0',
} as const;

const META = {
	version: '1.0.0',
	domain: 'ui',
	stability: 'experimental' as const,
	owners: ['@example.visualization-showcase'],
	tags: ['visualization', 'showcase'],
};

export const ShowcasePieVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.pie.channel-mix',
		title: 'Channel Mix',
		description: 'Pie chart for acquisition channel share.',
		goal: 'Show a pie chart primitive.',
		context: 'Marketing overview.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'channel',
		valueMeasure: 'sessions',
		donut: true,
		dimensions: [{ key: 'channel', label: 'Channel', dataPath: 'channel', type: 'category' }],
		measures: [{ key: 'sessions', label: 'Sessions', dataPath: 'sessions', format: 'number' }],
		table: { caption: 'Sessions by channel.' },
	},
});

export const ShowcaseHeatmapVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.heatmap.engagement',
		title: 'Engagement Heatmap',
		description: 'Heatmap of weekday and hour engagement.',
		goal: 'Show a heatmap primitive.',
		context: 'Usage intensity overview.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'heatmap',
		xDimension: 'weekday',
		yDimension: 'hour',
		valueMeasure: 'score',
		dimensions: [
			{ key: 'weekday', label: 'Weekday', dataPath: 'weekday', type: 'category' },
			{ key: 'hour', label: 'Hour', dataPath: 'hour', type: 'category' },
		],
		measures: [{ key: 'score', label: 'Score', dataPath: 'score', format: 'number' }],
		table: { caption: 'Engagement score by weekday and hour.' },
	},
});

export const ShowcaseFunnelVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.funnel.pipeline',
		title: 'Pipeline Funnel',
		description: 'Funnel chart for commercial conversion stages.',
		goal: 'Show a funnel primitive.',
		context: 'Pipeline progression view.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'funnel',
		nameDimension: 'stage',
		valueMeasure: 'count',
		dimensions: [{ key: 'stage', label: 'Stage', dataPath: 'stage', type: 'category' }],
		measures: [{ key: 'count', label: 'Count', dataPath: 'count', format: 'number' }],
		table: { caption: 'Counts by funnel stage.' },
	},
});

export const ShowcaseGeoVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.geo.coverage',
		title: 'Account Coverage',
		description: 'Geo chart for account coverage by city.',
		goal: 'Show a geo visualization primitive.',
		context: 'Territory distribution view.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'geo',
		mode: 'chart',
		variant: 'scatter',
		nameDimension: 'city',
		longitudeDimension: 'longitude',
		latitudeDimension: 'latitude',
		valueMeasure: 'accounts',
		dimensions: [
			{ key: 'city', label: 'City', dataPath: 'city', type: 'geo' },
			{ key: 'longitude', label: 'Longitude', dataPath: 'longitude', type: 'longitude' },
			{ key: 'latitude', label: 'Latitude', dataPath: 'latitude', type: 'latitude' },
		],
		measures: [{ key: 'accounts', label: 'Accounts', dataPath: 'accounts', format: 'number' }],
		table: { caption: 'Accounts by city location.' },
	},
});
