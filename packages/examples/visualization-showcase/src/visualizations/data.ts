import { visualizationRefKey } from './registry';
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

export const VisualizationShowcaseSampleData: Record<string, unknown> = {
	[visualizationRefKey(ShowcaseMetricVisualization.meta)]: {
		data: [
			{ month: '2025-11-01', value: 118000, priorValue: 103000 },
			{ month: '2025-12-01', value: 124500, priorValue: 118000 },
			{ month: '2026-01-01', value: 132000, priorValue: 124500 },
			{ month: '2026-02-01', value: 139500, priorValue: 132000 },
			{ month: '2026-03-01', value: 148200, priorValue: 139500 },
		],
	},
	[visualizationRefKey(ShowcaseLineVisualization.meta)]: {
		data: [
			{ week: 'W1', throughput: 38 },
			{ week: 'W2', throughput: 42 },
			{ week: 'W3', throughput: 45 },
			{ week: 'W4', throughput: 51 },
			{ week: 'W5', throughput: 49 },
		],
	},
	[visualizationRefKey(ShowcaseBarVisualization.meta)]: {
		data: [
			{ segment: 'Enterprise', revenue: 210000 },
			{ segment: 'Mid-Market', revenue: 164000 },
			{ segment: 'SMB', revenue: 92000 },
		],
	},
	[visualizationRefKey(ShowcaseAreaVisualization.meta)]: {
		data: [
			{ week: 'Week 1', retention: 0.76 },
			{ week: 'Week 2', retention: 0.69 },
			{ week: 'Week 3', retention: 0.64 },
			{ week: 'Week 4', retention: 0.59 },
			{ week: 'Week 5', retention: 0.55 },
		],
	},
	[visualizationRefKey(ShowcaseScatterVisualization.meta)]: {
		data: [
			{ latencyMs: 190, accuracy: 0.94, requests: 1800 },
			{ latencyMs: 240, accuracy: 0.97, requests: 900 },
			{ latencyMs: 160, accuracy: 0.88, requests: 2400 },
			{ latencyMs: 320, accuracy: 0.99, requests: 420 },
		],
	},
	[visualizationRefKey(ShowcasePieVisualization.meta)]: {
		data: [
			{ channel: 'Direct', sessions: 4800 },
			{ channel: 'Organic', sessions: 3600 },
			{ channel: 'Partner', sessions: 1400 },
			{ channel: 'Paid', sessions: 2300 },
		],
	},
	[visualizationRefKey(ShowcaseHeatmapVisualization.meta)]: {
		data: [
			{ weekday: 'Mon', hour: '09:00', score: 66 },
			{ weekday: 'Mon', hour: '13:00', score: 84 },
			{ weekday: 'Tue', hour: '09:00', score: 72 },
			{ weekday: 'Tue', hour: '13:00', score: 89 },
			{ weekday: 'Wed', hour: '09:00', score: 75 },
			{ weekday: 'Wed', hour: '13:00', score: 92 },
			{ weekday: 'Thu', hour: '09:00', score: 70 },
			{ weekday: 'Thu', hour: '13:00', score: 87 },
			{ weekday: 'Fri', hour: '09:00', score: 61 },
			{ weekday: 'Fri', hour: '13:00', score: 76 },
		],
	},
	[visualizationRefKey(ShowcaseFunnelVisualization.meta)]: {
		data: [
			{ stage: 'Qualified', count: 1200 },
			{ stage: 'Demo', count: 680 },
			{ stage: 'Proposal', count: 340 },
			{ stage: 'Negotiation', count: 180 },
			{ stage: 'Closed Won', count: 96 },
		],
	},
	[visualizationRefKey(ShowcaseGeoVisualization.meta)]: {
		data: [
			{ city: 'Paris', latitude: 48.8566, longitude: 2.3522, accounts: 42 },
			{ city: 'London', latitude: 51.5072, longitude: -0.1276, accounts: 57 },
			{ city: 'Berlin', latitude: 52.52, longitude: 13.405, accounts: 33 },
			{ city: 'New York', latitude: 40.7128, longitude: -74.006, accounts: 64 },
		],
	},
};
