/**
 * Verification snapshot coverage for pilot surfaces (14_verification_matrix.md).
 * Snapshots issue-workbench at key preference points: density, guidance, narrative.
 */

import { describe, expect, it } from 'bun:test';
import { buildContext } from '../runtime/build-context';
import type { ResolvedSurfacePlan } from '../runtime/resolve-bundle';
import { resolveBundle } from '../runtime/resolve-bundle';
import { defineModuleBundle } from './define-module-bundle';
import type { RegionNode } from './types';
import type { VerificationSnapshotSummary } from './verification-snapshot-types';

const PILOT_BUNDLE = defineModuleBundle({
	meta: {
		key: 'pm.workbench',
		version: '0.1.0',
		title: 'PM Workbench',
		stability: 'experimental',
	},
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
					accepts: ['entity-section', 'table', 'rich-doc'],
					cardinality: 'many',
					mutableByAi: true,
					mutableByUser: true,
				},
				{
					slotId: 'secondary',
					role: 'secondary',
					accepts: ['entity-section', 'entity-field'],
					cardinality: 'one',
				},
			],
			layouts: [
				{
					layoutId: 'minimal',
					when: (ctx) => ctx.preferences.density === 'minimal',
					root: { type: 'slot', slotId: 'primary' },
				},
				{
					layoutId: 'compact',
					when: (ctx) => ctx.preferences.density === 'compact',
					root: { type: 'slot', slotId: 'primary' },
				},
				{
					layoutId: 'balanced-three-pane',
					when: (ctx) =>
						ctx.preferences.density === 'standard' ||
						ctx.preferences.density === 'detailed',
					root: {
						type: 'panel-group',
						direction: 'horizontal',
						persistKey: 'pm.issue.balanced',
						children: [
							{ type: 'slot', slotId: 'primary' },
							{
								type: 'panel-group',
								direction: 'vertical',
								children: [{ type: 'slot', slotId: 'secondary' }],
							},
						],
					},
				},
				{
					layoutId: 'dense',
					when: (ctx) => ctx.preferences.density === 'dense',
					root: {
						type: 'panel-group',
						direction: 'horizontal',
						children: [
							{ type: 'slot', slotId: 'primary' },
							{ type: 'slot', slotId: 'secondary' },
						],
					},
				},
			],
			data: [
				{
					recipeId: 'issue-core',
					source: { kind: 'entity', entityType: 'pm.issue' },
					requestedDepth: 'detailed',
					hydrateInto: 'issue',
				},
			],
			verification: {
				dimensions: {
					guidance:
						'Inline hints or walkthrough rail when walkthrough enabled.',
					density:
						'Compact to dense 3-pane layouts on desktop; minimal single-pane.',
					dataDepth:
						'Summary through detailed relation hydration per preference.',
					control: 'Advanced commands and raw config gated by capability.',
					media: 'Text summary, visual relation graph, hybrid assistant.',
					pace: 'Motion tokens and confirmation depth map from pace.',
					narrative: 'Summary-first or evidence-first reorder.',
				},
			},
		},
	},
});

function countSlots(root: RegionNode): number {
	if (root.type === 'slot') return 1;
	if ('children' in root) {
		return root.children.reduce((sum, c) => sum + countSlots(c), 0);
	}
	if ('tabs' in root) {
		return root.tabs.reduce((sum, t) => sum + countSlots(t.child), 0);
	}
	if ('child' in root) return countSlots(root.child);
	return 0;
}

function getRootType(root: RegionNode): string {
	return root.type;
}

function toSnapshotSummary(
	plan: ResolvedSurfacePlan
): VerificationSnapshotSummary {
	return {
		bundleKey: plan.bundleKey,
		surfaceId: plan.surfaceId,
		layoutId: plan.layoutId,
		layoutRootType: getRootType(plan.layoutRoot),
		preferences: plan.adaptation.appliedDimensions,
		slotCount: countSlots(plan.layoutRoot),
	};
}

describe('verification snapshots', () => {
	const ROUTE = '/operate/pm/issues/123';

	it('snapshots density variants at key preference points', async () => {
		const snapshots: VerificationSnapshotSummary[] = [];

		for (const density of [
			'minimal',
			'compact',
			'standard',
			'dense',
		] as const) {
			const ctx = buildContext({
				route: ROUTE,
				params: { issueId: '123' },
				preferences: { density },
			});
			const plan = await resolveBundle(PILOT_BUNDLE, ctx);
			snapshots.push(toSnapshotSummary(plan));
		}

		expect(snapshots).toMatchSnapshot();
	});

	it('snapshots guidance variants', async () => {
		const snapshots: VerificationSnapshotSummary[] = [];

		for (const guidance of ['none', 'hints', 'wizard'] as const) {
			const ctx = buildContext({
				route: ROUTE,
				params: { issueId: '123' },
				preferences: { guidance },
			});
			const plan = await resolveBundle(PILOT_BUNDLE, ctx);
			snapshots.push(toSnapshotSummary(plan));
		}

		expect(snapshots).toMatchSnapshot();
	});

	it('snapshots narrative variants', async () => {
		const snapshots: VerificationSnapshotSummary[] = [];

		for (const narrative of ['top-down', 'bottom-up'] as const) {
			const ctx = buildContext({
				route: ROUTE,
				params: { issueId: '123' },
				preferences: { narrative },
			});
			const plan = await resolveBundle(PILOT_BUNDLE, ctx);
			snapshots.push(toSnapshotSummary(plan));
		}

		expect(snapshots).toMatchSnapshot();
	});
});
