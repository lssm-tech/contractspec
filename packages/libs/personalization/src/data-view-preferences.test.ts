import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DataViewSpec } from '@contractspec/lib.contracts-spec/data-views';
import { BehaviorAnalyzer } from './analyzer';
import {
	dataViewDensityToPreferencePatch,
	dataViewModeToPreferencePatch,
	preferenceDimensionsToDataViewDensity,
	resolveDataViewPreferences,
} from './data-view-preferences';
import { InMemoryBehaviorStore } from './store';
import { createBehaviorTracker } from './tracker';

const basePreferences = {
	guidance: 'hints',
	density: 'dense',
	dataDepth: 'detailed',
	control: 'standard',
	media: 'text',
	pace: 'balanced',
	narrative: 'adaptive',
} as const;

const accountsSpec = {
	meta: {
		key: 'accounts.list',
		version: '1.0.0',
		title: 'Accounts',
		description: 'Account list',
		domain: 'accounts',
		entity: 'account',
		stability: 'stable',
		owners: ['ops'],
		tags: ['accounts'],
	},
	source: {
		primary: { key: 'accounts.query', version: '1.0.0' },
	},
	view: {
		kind: 'list',
		fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
		collection: {
			viewModes: {
				defaultMode: 'grid',
				allowedModes: ['list', 'grid'],
			},
			pagination: { pageSize: 25 },
			density: 'comfortable',
			dataDepth: 'summary',
		},
	},
} satisfies DataViewSpec;

describe('data view personalization helpers', () => {
	test('maps global preference dimensions into renderer density', () => {
		expect(
			preferenceDimensionsToDataViewDensity({
				...basePreferences,
				density: 'minimal',
			})
		).toBe('compact');
		expect(
			preferenceDimensionsToDataViewDensity({
				...basePreferences,
				density: 'detailed',
			})
		).toBe('comfortable');
		expect(dataViewDensityToPreferencePatch('compact')).toEqual({
			density: 'compact',
		});
		expect(dataViewDensityToPreferencePatch('comfortable')).toEqual({
			density: 'standard',
		});
	});

	test('resolves stored data view preferences before insights and contract defaults', () => {
		const resolved = resolveDataViewPreferences({
			spec: accountsSpec,
			preferences: basePreferences,
			insights: {
				unusedFields: [],
				frequentlyUsedFields: [],
				suggestedHiddenFields: [],
				workflowBottlenecks: [],
				layoutPreference: 'table',
				dataViewPreferences: {
					'accounts.list': { preferredViewMode: 'list' },
				},
			},
			record: {
				dataViewKey: 'accounts.list',
				viewMode: 'grid',
				density: 'comfortable',
				dataDepth: 'exhaustive',
				pageSize: 50,
			},
		});

		expect(resolved.viewMode).toBe('grid');
		expect(resolved.density).toBe('comfortable');
		expect(resolved.dataDepth).toBe('exhaustive');
		expect(resolved.pageSize).toBe(50);
		expect(resolved.source).toMatchObject({
			viewMode: 'record',
			density: 'record',
			dataDepth: 'record',
			pageSize: 'record',
		});
	});

	test('ignores disallowed insight modes and falls back to contract defaults', () => {
		const resolved = resolveDataViewPreferences({
			spec: accountsSpec,
			preferences: basePreferences,
			insights: {
				unusedFields: [],
				frequentlyUsedFields: [],
				suggestedHiddenFields: [],
				workflowBottlenecks: [],
				layoutPreference: 'table',
			},
		});

		expect(resolved.viewMode).toBe('grid');
		expect(resolved.source.viewMode).toBe('contract');
		expect(resolved.density).toBe('compact');
		expect(resolved.dataDepth).toBe('detailed');
	});

	test('creates scoped view-mode preference patches', () => {
		expect(dataViewModeToPreferencePatch(accountsSpec, 'list')).toEqual({
			dataViewKey: 'accounts.list',
			dataViewVersion: '1.0.0',
			viewMode: 'list',
		});
	});

	test('does not import React or design-system code', () => {
		const source = readFileSync(
			join(import.meta.dir, 'data-view-preferences.ts'),
			'utf8'
		);

		expect(source).not.toContain('react');
		expect(source).not.toContain('design-system');
	});
});

describe('data view behavior events', () => {
	test('tracks, summarizes, and analyzes data view interactions', async () => {
		const store = new InMemoryBehaviorStore();
		const tracker = createBehaviorTracker({
			store,
			context: { tenantId: 'tenant-1', userId: 'user-1' },
			bufferSize: 10,
		});

		tracker.trackDataViewInteraction({
			dataViewKey: 'accounts.list',
			action: 'opened',
			viewMode: 'grid',
		});
		tracker.trackDataViewInteraction({
			dataViewKey: 'accounts.list',
			action: 'view_mode_changed',
			viewMode: 'grid',
		});
		tracker.trackDataViewInteraction({
			dataViewKey: 'accounts.list',
			action: 'view_mode_changed',
			viewMode: 'list',
		});
		await tracker.flush();

		const summary = await store.summarize({ tenantId: 'tenant-1' });
		expect(summary.dataViewInteractionCounts?.['accounts.list']).toMatchObject({
			opened: 1,
			view_mode_changed: 2,
		});
		expect(summary.dataViewViewModeCounts?.['accounts.list']).toMatchObject({
			grid: 2,
			list: 1,
		});

		const queried = await store.query({
			tenantId: 'tenant-1',
			dataViewKey: 'accounts.list',
			dataViewAction: 'opened',
		});
		expect(queried).toHaveLength(1);

		const analyzer = new BehaviorAnalyzer(store);
		const insights = await analyzer.analyze({ tenantId: 'tenant-1' });
		expect(
			insights.dataViewPreferences?.['accounts.list']?.preferredViewMode
		).toBe('grid');
	});

	test('analyzes legacy behavior summaries without data view maps', async () => {
		const analyzer = new BehaviorAnalyzer({
			record: () => void 0,
			bulkRecord: () => void 0,
			query: async () => [],
			summarize: async () => ({
				fieldCounts: {},
				featureCounts: {},
				workflowStepCounts: {},
				totalEvents: 0,
			}),
		});

		const insights = await analyzer.analyze({ tenantId: 'tenant-1' });

		expect(insights.dataViewPreferences).toBeUndefined();
		expect(insights.layoutPreference).toBeUndefined();
	});
});
