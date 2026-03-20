import { describe, expect, test } from 'bun:test';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import {
	buildPlannerPromptInput,
	createSurfacePlannerTools,
} from './surface-planner-tools';

const mockPlan: ResolvedSurfacePlan = {
	bundleKey: 'pm.workbench',
	surfaceId: 'issue-workbench',
	layoutId: 'balanced-three-pane',
	layoutRoot: {
		type: 'panel-group',
		direction: 'horizontal',
		children: [
			{ type: 'slot', slotId: 'primary' },
			{
				type: 'panel-group',
				direction: 'vertical',
				children: [
					{ type: 'slot', slotId: 'secondary' },
					{ type: 'slot', slotId: 'assistant' },
				],
			},
			{ type: 'slot', slotId: 'inspector' },
		],
	},
	nodes: [],
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
		resolutionId: 'test-1',
		createdAt: new Date().toISOString(),
		reasons: [],
	},
};

describe('surface-planner-tools', () => {
	describe('createSurfacePlannerTools', () => {
		test('returns propose-patch tool', () => {
			const tools = createSurfacePlannerTools({ plan: mockPlan });
			expect(tools).toHaveProperty('propose-patch');
		});

		test('propose-patch validates and returns success for valid ops', async () => {
			const proposals: unknown[] = [];
			const tools = createSurfacePlannerTools({
				plan: mockPlan,
				onPatchProposal: (p) => proposals.push(p),
			});
			const tool = tools['propose-patch'] as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				proposalId: 'prop-1',
				ops: [
					{
						op: 'insert-node',
						slotId: 'assistant',
						node: {
							nodeId: 'new-node-1',
							kind: 'assistant-panel',
							title: 'New Panel',
						},
					},
				],
			});
			expect(result).toMatchObject({
				success: true,
				proposalId: 'prop-1',
				opsCount: 1,
			});
			expect(proposals).toHaveLength(1);
			expect((proposals[0] as { proposalId: string }).proposalId).toBe(
				'prop-1'
			);
		});

		test('propose-patch returns error for invalid slot', async () => {
			const tools = createSurfacePlannerTools({ plan: mockPlan });
			const tool = tools['propose-patch'] as unknown as {
				execute: (input: Record<string, unknown>) => Promise<unknown>;
			};
			const result = await tool.execute({
				proposalId: 'prop-2',
				ops: [
					{
						op: 'insert-node',
						slotId: 'nonexistent-slot',
						node: {
							nodeId: 'n1',
							kind: 'assistant-panel',
							title: 'X',
						},
					},
				],
			});
			expect(result).toMatchObject({
				success: false,
				error: expect.stringMatching(/slot|allowed/),
			});
		});
	});

	describe('buildPlannerPromptInput', () => {
		test('returns valid PlannerPromptInput with slots from layout', () => {
			const input = buildPlannerPromptInput(mockPlan);
			expect(input.bundleMeta.key).toBe('pm.workbench');
			expect(input.surfaceId).toBe('issue-workbench');
			expect(input.allowedSlots).toContain('primary');
			expect(input.allowedSlots).toContain('assistant');
			expect(input.allowedPatchOps.length).toBeGreaterThan(0);
		});
	});
});
