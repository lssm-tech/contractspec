import { describe, expect, it } from 'bun:test';
import { compilePlannerPrompt } from './planner-prompt';

describe('compilePlannerPrompt', () => {
	it('includes bundle metadata and surface', () => {
		const prompt = compilePlannerPrompt({
			bundleMeta: {
				key: 'pm.workbench',
				version: '0.1.0',
				title: 'PM Workbench',
			},
			surfaceId: 'issue-workbench',
			allowedPatchOps: ['insert-node', 'set-layout'],
			allowedSlots: ['primary', 'assistant'],
			allowedNodeKinds: ['entity-card', 'data-view'],
			actions: [],
			preferences: {
				guidance: 'hints',
				density: 'standard',
				dataDepth: 'detailed',
				control: 'standard',
				media: 'text',
				pace: 'balanced',
				narrative: 'top-down',
			},
		});
		expect(prompt).toContain('PM Workbench');
		expect(prompt).toContain('pm.workbench');
		expect(prompt).toContain('issue-workbench');
	});

	it('includes allowed ops, slots, and node kinds', () => {
		const prompt = compilePlannerPrompt({
			bundleMeta: { key: 'x', version: '1', title: 'X' },
			surfaceId: 's',
			allowedPatchOps: ['insert-node', 'remove-node'],
			allowedSlots: ['primary', 'assistant'],
			allowedNodeKinds: ['entity-card'],
			actions: [],
			preferences: {
				guidance: 'none',
				density: 'minimal',
				dataDepth: 'summary',
				control: 'restricted',
				media: 'text',
				pace: 'rapid',
				narrative: 'top-down',
			},
		});
		expect(prompt).toContain('insert-node');
		expect(prompt).toContain('remove-node');
		expect(prompt).toContain('primary');
		expect(prompt).toContain('assistant');
		expect(prompt).toContain('entity-card');
	});

	it('includes safety instructions', () => {
		const prompt = compilePlannerPrompt({
			bundleMeta: { key: 'x', version: '1', title: 'X' },
			surfaceId: 's',
			allowedPatchOps: [],
			allowedSlots: [],
			allowedNodeKinds: [],
			actions: [],
			preferences: {
				guidance: 'none',
				density: 'minimal',
				dataDepth: 'summary',
				control: 'restricted',
				media: 'text',
				pace: 'rapid',
				narrative: 'top-down',
			},
		});
		expect(prompt).toContain('Do NOT emit JSX');
		expect(prompt).toContain('Do NOT invent node kinds');
	});

	it('includes base prompt and entity when provided', () => {
		const prompt = compilePlannerPrompt({
			bundleMeta: { key: 'x', version: '1', title: 'X' },
			surfaceId: 's',
			allowedPatchOps: [],
			allowedSlots: [],
			allowedNodeKinds: [],
			actions: [{ actionId: 'save', title: 'Save' }],
			preferences: {
				guidance: 'none',
				density: 'minimal',
				dataDepth: 'summary',
				control: 'restricted',
				media: 'text',
				pace: 'rapid',
				narrative: 'top-down',
			},
			basePrompt: 'Custom instructions here.',
			planSummary: '3 nodes, 2 panels',
			entity: { type: 'issue', id: 'ISS-42' },
		});
		expect(prompt).toContain('Custom instructions here.');
		expect(prompt).toContain('3 nodes, 2 panels');
		expect(prompt).toContain('issue: ISS-42');
		expect(prompt).toContain('save: Save');
	});
});
