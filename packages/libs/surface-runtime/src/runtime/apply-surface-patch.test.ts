import { describe, expect, it } from 'bun:test';
import { applySurfacePatch } from './apply-surface-patch';
import type { ResolvedSurfacePlan } from './resolve-bundle';

const basePlan: ResolvedSurfacePlan = {
	bundleKey: 'x',
	surfaceId: 's',
	layoutId: 'l1',
	layoutRoot: { type: 'slot', slotId: 'primary' },
	nodes: [
		{ nodeId: 'n1', kind: 'entity-card', title: 'Card 1' },
		{ nodeId: 'n2', kind: 'data-view', title: 'View' },
	],
	actions: [],
	commands: [],
	bindings: {},
	adaptation: {
		appliedDimensions: {
			guidance: 'hints',
			density: 'standard',
			dataDepth: 'detailed',
			control: 'standard',
			media: 'text',
			pace: 'balanced',
			narrative: 'top-down',
		},
		notes: [],
	},
	overlays: [],
	ai: {},
	audit: {
		resolutionId: 'res_1',
		createdAt: new Date().toISOString(),
		reasons: [],
	},
};

describe('applySurfacePatch', () => {
	it('returns plan unchanged when ops empty', () => {
		const result = applySurfacePatch(basePlan, []);
		expect(result.plan).toEqual(basePlan);
		expect(result.inverseOps).toEqual([]);
	});

	it('applies insert-node and produces inverse', () => {
		const result = applySurfacePatch(basePlan, [
			{
				op: 'insert-node',
				slotId: 'primary',
				node: { nodeId: 'n3', kind: 'entity-field', title: 'Field' },
			},
		]);
		expect(result.plan.nodes).toHaveLength(3);
		expect(result.plan.nodes[2]?.nodeId).toBe('n3');
		expect(result.inverseOps).toEqual([{ op: 'remove-node', nodeId: 'n3' }]);
	});

	it('applies remove-node and produces inverse', () => {
		const result = applySurfacePatch(basePlan, [
			{ op: 'remove-node', nodeId: 'n2' },
		]);
		expect(result.plan.nodes).toHaveLength(1);
		expect(result.plan.nodes[0]?.nodeId).toBe('n1');
		expect(result.inverseOps).toHaveLength(1);
		expect(result.inverseOps[0]?.op).toBe('insert-node');
	});

	it('applies set-layout and produces inverse', () => {
		const result = applySurfacePatch(basePlan, [
			{ op: 'set-layout', layoutId: 'l2' },
		]);
		expect(result.plan.layoutId).toBe('l2');
		expect(result.inverseOps).toEqual([{ op: 'set-layout', layoutId: 'l1' }]);
	});

	it('applies reveal-field and produces inverse', () => {
		const result = applySurfacePatch(basePlan, [
			{ op: 'reveal-field', fieldId: 'f1' },
		]);
		expect(result.inverseOps).toEqual([{ op: 'hide-field', fieldId: 'f1' }]);
	});

	it('applies hide-field and produces inverse', () => {
		const result = applySurfacePatch(basePlan, [
			{ op: 'hide-field', fieldId: 'f1' },
		]);
		expect(result.inverseOps).toEqual([{ op: 'reveal-field', fieldId: 'f1' }]);
	});

	it('throws when remove-node references unknown nodeId', () => {
		expect(() =>
			applySurfacePatch(basePlan, [{ op: 'remove-node', nodeId: 'unknown' }])
		).toThrow(/unknown nodeId/);
	});
});
