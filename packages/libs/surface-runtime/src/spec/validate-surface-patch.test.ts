import { describe, expect, it } from 'bun:test';
import {
	validatePatchProposal,
	validateSurfacePatch,
	validateSurfacePatchOp,
} from './validate-surface-patch';

describe('validateSurfacePatch', () => {
	it('accepts valid insert-node op', () => {
		expect(() =>
			validateSurfacePatch([
				{
					op: 'insert-node',
					slotId: 'primary',
					node: { nodeId: 'n1', kind: 'entity-section' },
				},
			])
		).not.toThrow();
	});

	it('accepts valid remove-node op', () => {
		expect(() =>
			validateSurfacePatch([{ op: 'remove-node', nodeId: 'n1' }])
		).not.toThrow();
	});

	it('accepts valid reveal-field and hide-field ops', () => {
		expect(() =>
			validateSurfacePatch([
				{ op: 'reveal-field', fieldId: 'description' },
				{ op: 'hide-field', fieldId: 'metadata' },
			])
		).not.toThrow();
	});

	it('accepts valid promote-action op', () => {
		expect(() =>
			validateSurfacePatch([
				{
					op: 'promote-action',
					actionId: 'update-status',
					placement: 'header',
				},
			])
		).not.toThrow();
	});

	it('throws when ops is not an array', () => {
		expect(() => validateSurfacePatch(null as never)).toThrow(
			'Patch ops must be an array'
		);
	});

	it('throws when insert-node lacks node', () => {
		expect(() =>
			validateSurfacePatch([{ op: 'insert-node', slotId: 'primary' } as never])
		).toThrow('insert-node requires node');
	});

	it('throws when node has invalid kind', () => {
		expect(() =>
			validateSurfacePatch([
				{
					op: 'insert-node',
					slotId: 'primary',
					node: { nodeId: 'n1', kind: 'invalid-kind' as never },
				},
			])
		).toThrow('kind must be one of');
	});

	it('throws when reveal-field lacks fieldId', () => {
		expect(() =>
			validateSurfacePatch([{ op: 'reveal-field' } as never])
		).toThrow('reveal-field requires fieldId string');
	});
});

describe('validateSurfacePatchOp', () => {
	it('throws when op is unknown', () => {
		expect(() =>
			validateSurfacePatchOp({ op: 'unknown-op' } as never, 0)
		).toThrow(/unknown|must be one of/);
	});
});

const defaultConstraints = {
	allowedOps: ['insert-node', 'remove-node', 'set-layout'] as const,
	allowedSlots: ['primary', 'assistant'],
	allowedNodeKinds: ['entity-card', 'entity-section', 'data-view'] as const,
};

describe('validatePatchProposal', () => {
	it('accepts valid insert-node within constraints', () => {
		expect(() =>
			validatePatchProposal(
				[
					{
						op: 'insert-node',
						slotId: 'primary',
						node: { nodeId: 'n1', kind: 'entity-card', title: 'Card' },
					},
				],
				defaultConstraints
			)
		).not.toThrow();
	});

	it('throws when op not in allowedOps', () => {
		expect(() =>
			validatePatchProposal(
				[{ op: 'promote-action', actionId: 'x', placement: 'header' }],
				defaultConstraints
			)
		).toThrow(/not in allowed list/);
	});

	it('throws when slotId not in allowedSlots', () => {
		expect(() =>
			validatePatchProposal(
				[
					{
						op: 'insert-node',
						slotId: 'footer',
						node: { nodeId: 'n1', kind: 'entity-card' },
					},
				],
				defaultConstraints
			)
		).toThrow(/not in allowed slots/);
	});

	it('throws when node kind not in allowedNodeKinds', () => {
		expect(() =>
			validatePatchProposal(
				[
					{
						op: 'insert-node',
						slotId: 'primary',
						node: { nodeId: 'n1', kind: 'chart' },
					},
				],
				defaultConstraints
			)
		).toThrow(/not in allowed list/);
	});

	it('throws when move-node toSlotId not in allowedSlots', () => {
		const constraintsWithMove = {
			...defaultConstraints,
			allowedOps: ['move-node'] as const,
		};
		expect(() =>
			validatePatchProposal(
				[
					{
						op: 'move-node',
						nodeId: 'n1',
						toSlotId: 'footer',
					},
				],
				constraintsWithMove
			)
		).toThrow(/not in allowed slots/);
	});
});
