import { describe, expect, it } from 'bun:test';
import { defineModuleBundle } from '../spec/define-module-bundle';
import goldenContexts from './__fixtures__/pm-workbench-golden.json';
import { runGoldenResolve } from './golden-harness';

const pmWorkbench = defineModuleBundle({
	meta: { key: 'pm.workbench', version: '0.1.0', title: 'PM Workbench' },
	routes: [
		{
			routeId: 'pm-issue',
			path: '/operate/pm/issues/:issueId',
			defaultSurface: 'issue-workbench',
		},
	],
	surfaces: {
		'issue-workbench': {
			surfaceId: 'issue-workbench',
			kind: 'workbench',
			title: 'Issue Workbench',
			slots: [
				{
					slotId: 'primary',
					role: 'primary',
					accepts: ['entity-section', 'table'],
					cardinality: 'many',
				},
			],
			layouts: [
				{
					layoutId: 'balanced',
					root: { type: 'slot', slotId: 'primary' },
				},
				{
					layoutId: 'dense',
					when: (ctx) => ctx.preferences.density === 'dense',
					root: { type: 'slot', slotId: 'primary' },
				},
			],
			data: [],
			verification: {
				dimensions: {
					guidance: 'Hints available on hover or focus.',
					density: 'Layouts adapt from compact to dense.',
					dataDepth: 'Depth controls relation hydration.',
					control: 'Controls visible per capability.',
					media: 'Media supports text and visual modes.',
					pace: 'Pace maps to motion tokens.',
					narrative: 'Narrative order summary vs evidence.',
				},
			},
		},
	},
});

describe('golden harness', () => {
	interface GoldenCtxItem {
		route: string;
		params?: Record<string, string>;
		preferences?: Record<string, string>;
		device?: 'desktop' | 'tablet' | 'mobile';
		description?: string;
	}
	const contexts = (
		goldenContexts as { version: number; contexts: GoldenCtxItem[] }
	).contexts;

	for (const ctx of contexts) {
		it(`snapshots pilot route: ${ctx.description ?? ctx.route}`, async () => {
			const snapshot = await runGoldenResolve(
				pmWorkbench,
				ctx as import('./golden-context').GoldenContext
			);
			expect(snapshot.bundleKey).toBe('pm.workbench');
			expect(snapshot.surfaceId).toBe('issue-workbench');
			expect(snapshot.layoutRoot).toBeDefined();
			expect(snapshot.reasons).toContain('surface=issue-workbench');
			if (ctx.preferences?.density === 'dense') {
				expect(snapshot.layoutId).toBe('dense');
			} else {
				expect(snapshot.layoutId).toBe('balanced');
			}
			expect(snapshot).toMatchSnapshot();
		});
	}

	it('resolver completes within performance budget (<100ms p95 server)', async () => {
		const BUDGET_MS = 100;
		const iterations = 20;
		const durations: number[] = [];
		const firstCtx = contexts[0] as import('./golden-context').GoldenContext;
		for (let i = 0; i < iterations; i++) {
			const start = performance.now();
			await runGoldenResolve(pmWorkbench, firstCtx);
			durations.push(performance.now() - start);
		}
		durations.sort((a, b) => a - b);
		const p95Index = Math.floor(iterations * 0.95);
		const p95 = durations[p95Index] ?? durations[durations.length - 1] ?? 0;
		expect(p95).toBeLessThan(BUDGET_MS);
	});
});
