import { defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const QUERY_REF = { key: 'analytics.query.execute', version: '1.0.0' } as const;
const META = {
	version: '1.0.0',
	domain: 'analytics',
	stability: 'experimental' as const,
	owners: ['@example.analytics-dashboard'],
	tags: ['analytics', 'dashboard', 'visualization'],
};

export const ChannelMixVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.channel-mix',
		title: 'Channel Mix',
		description: 'Session distribution across acquisition channels.',
		goal: 'Explain which channels currently drive the largest share of traffic.',
		context: 'Marketing attribution dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'channel',
		valueMeasure: 'sessions',
		dimensions: [
			{
				key: 'channel',
				label: 'Channel',
				dataPath: 'channel',
				type: 'category',
			},
		],
		measures: [{ key: 'sessions', label: 'Sessions', dataPath: 'sessions' }],
		table: { caption: 'Sessions by acquisition channel.' },
	},
});

export const EngagementHeatmapVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.engagement-heatmap',
		title: 'Engagement Heatmap',
		description: 'Average engagement score by weekday and time band.',
		goal: 'Reveal the highest-engagement time windows for product activity.',
		context: 'Usage analytics dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'heatmap',
		xDimension: 'timeBand',
		yDimension: 'weekday',
		valueMeasure: 'engagementScore',
		dimensions: [
			{
				key: 'timeBand',
				label: 'Time Band',
				dataPath: 'timeBand',
				type: 'category',
			},
			{
				key: 'weekday',
				label: 'Weekday',
				dataPath: 'weekday',
				type: 'category',
			},
		],
		measures: [
			{
				key: 'engagementScore',
				label: 'Engagement',
				dataPath: 'engagementScore',
			},
		],
		table: { caption: 'Engagement score by weekday and time band.' },
	},
});

export const ConversionFunnelVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.conversion-funnel',
		title: 'Conversion Funnel',
		description: 'Progression through the main acquisition funnel.',
		goal: 'Show where the product is losing the largest share of prospects.',
		context: 'Growth dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'funnel',
		nameDimension: 'stage',
		valueMeasure: 'users',
		sort: 'descending',
		dimensions: [
			{ key: 'stage', label: 'Stage', dataPath: 'stage', type: 'category' },
		],
		measures: [{ key: 'users', label: 'Users', dataPath: 'users' }],
		table: { caption: 'Users per conversion stage.' },
	},
});

export const AccountCoverageGeoVisualization = defineVisualization({
	meta: {
		...META,
		key: 'analytics.visualization.account-coverage-geo',
		title: 'Account Coverage',
		description: 'High-value accounts plotted on a slippy-map surface.',
		goal: 'Locate where active commercial concentration is strongest.',
		context: 'Territory coverage dashboard.',
	},
	source: { primary: QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'geo',
		mode: 'slippy-map',
		variant: 'scatter',
		nameDimension: 'city',
		latitudeDimension: 'latitude',
		longitudeDimension: 'longitude',
		valueMeasure: 'accounts',
		dimensions: [
			{ key: 'city', label: 'City', dataPath: 'city', type: 'category' },
			{
				key: 'latitude',
				label: 'Latitude',
				dataPath: 'latitude',
				type: 'latitude',
			},
			{
				key: 'longitude',
				label: 'Longitude',
				dataPath: 'longitude',
				type: 'longitude',
			},
		],
		measures: [{ key: 'accounts', label: 'Accounts', dataPath: 'accounts' }],
		table: { caption: 'Account concentration by city.' },
	},
});
