import { describe, expect, it } from 'bun:test';
import type { VisualizationRef, VisualizationSpec } from './spec';
import { defineVisualization } from './spec';

describe('VisualizationSpec', () => {
	const createVisualizationSpec = (
		overrides?: Partial<VisualizationSpec>
	): VisualizationSpec => ({
		meta: {
			key: 'analytics.revenue.trend',
			version: '1.0.0',
			title: 'Revenue Trend',
			description: 'Revenue over time',
			goal: 'Track revenue movement',
			context: 'Executive analytics dashboard',
			stability: 'stable',
			owners: ['platform.analytics'],
			tags: ['analytics', 'revenue'],
			entity: 'dashboard',
		},
		source: {
			primary: { key: 'analytics.query.execute', version: '1.0.0' },
			resultPath: 'data',
		},
		visualization: {
			kind: 'cartesian',
			variant: 'line',
			dimensions: [
				{
					key: 'day',
					label: 'Day',
					dataPath: 'day',
					type: 'time',
				},
			],
			measures: [
				{
					key: 'revenue',
					label: 'Revenue',
					dataPath: 'revenue',
					format: 'currency',
				},
			],
			xDimension: 'day',
			yMeasures: ['revenue'],
		},
		...overrides,
	});

	it('defines a visualization spec', () => {
		const spec = createVisualizationSpec();

		expect(spec.meta.goal).toBe('Track revenue movement');
		expect(spec.visualization.kind).toBe('cartesian');
		expect(spec.source.primary.key).toBe('analytics.query.execute');
	});

	it('supports optional states and policy', () => {
		const spec = createVisualizationSpec({
			states: {
				empty: { key: 'analytics.empty', version: '1.0.0' },
			},
			policy: {
				flags: ['analytics.enabled'],
			},
		});

		expect(spec.states?.empty?.key).toBe('analytics.empty');
		expect(spec.policy?.flags).toContain('analytics.enabled');
	});
});

describe('VisualizationRef', () => {
	it('defines a reference to a visualization', () => {
		const ref: VisualizationRef = {
			key: 'analytics.revenue.trend',
			version: '1.0.0',
		};

		expect(ref.key).toBe('analytics.revenue.trend');
	});
});

describe('defineVisualization', () => {
	it('returns the spec unchanged', () => {
		const spec = createSpec();

		expect(defineVisualization(spec)).toBe(spec);
	});
});

function createSpec(): VisualizationSpec {
	return {
		meta: {
			key: 'analytics.metric.mrr',
			version: '1.0.0',
			title: 'MRR',
			description: 'Monthly recurring revenue',
			goal: 'Highlight current MRR',
			context: 'Top-level KPI',
			stability: 'beta',
			owners: ['platform.analytics'],
			tags: ['analytics', 'metric'],
		},
		source: {
			primary: { key: 'analytics.query.execute', version: '1.0.0' },
		},
		visualization: {
			kind: 'metric',
			measures: [
				{
					key: 'mrr',
					label: 'MRR',
					dataPath: 'mrr',
					format: 'currency',
				},
			],
			measure: 'mrr',
		},
	};
}
