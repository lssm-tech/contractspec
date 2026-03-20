/**
 * Surface planner tools for ai-chat.
 * Enables the model to propose surface patches when used in surface-runtime contexts.
 * Requires @contractspec/lib.surface-runtime (optional peer).
 */

import { buildSurfacePatchProposal } from '@contractspec/lib.surface-runtime/runtime/planner-tools';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type {
	BundleNodeKind,
	RegionNode,
	SurfacePatchOp,
	SurfacePatchProposal,
} from '@contractspec/lib.surface-runtime/spec/types';
import {
	type PatchProposalConstraints,
	validatePatchProposal,
} from '@contractspec/lib.surface-runtime/spec/validate-surface-patch';
import { type ToolSet, tool } from 'ai';
import { z } from 'zod';

const VALID_OPS: SurfacePatchOp['op'][] = [
	'insert-node',
	'replace-node',
	'remove-node',
	'move-node',
	'resize-panel',
	'set-layout',
	'reveal-field',
	'hide-field',
	'promote-action',
	'set-focus',
];

const DEFAULT_NODE_KINDS: BundleNodeKind[] = [
	'entity-section',
	'entity-card',
	'data-view',
	'assistant-panel',
	'chat-thread',
	'action-bar',
	'timeline',
	'table',
	'rich-doc',
	'form',
	'chart',
	'custom-widget',
];

function collectSlotIdsFromRegion(node: RegionNode): string[] {
	const ids: string[] = [];
	if (node.type === 'slot') {
		ids.push(node.slotId);
	}
	if (node.type === 'panel-group' || node.type === 'stack') {
		for (const child of node.children) {
			ids.push(...collectSlotIdsFromRegion(child));
		}
	}
	if (node.type === 'tabs') {
		for (const tab of node.tabs) {
			ids.push(...collectSlotIdsFromRegion(tab.child));
		}
	}
	if (node.type === 'floating') {
		ids.push(node.anchorSlotId);
		ids.push(...collectSlotIdsFromRegion(node.child));
	}
	return ids;
}

function deriveConstraints(
	plan: ResolvedSurfacePlan
): PatchProposalConstraints {
	const slotIds = collectSlotIdsFromRegion(plan.layoutRoot);
	const uniqueSlots = [...new Set(slotIds)];
	return {
		allowedOps: VALID_OPS,
		allowedSlots:
			uniqueSlots.length > 0 ? uniqueSlots : ['assistant', 'primary'],
		allowedNodeKinds: DEFAULT_NODE_KINDS,
	};
}

const ProposePatchInputSchema = z.object({
	proposalId: z.string().describe('Unique proposal identifier'),
	ops: z.array(
		z.object({
			op: z.enum([
				'insert-node',
				'replace-node',
				'remove-node',
				'move-node',
				'resize-panel',
				'set-layout',
				'reveal-field',
				'hide-field',
				'promote-action',
				'set-focus',
			]),
			slotId: z.string().optional(),
			nodeId: z.string().optional(),
			toSlotId: z.string().optional(),
			index: z.number().optional(),
			node: z
				.object({
					nodeId: z.string(),
					kind: z.string(),
					title: z.string().optional(),
					props: z.record(z.string(), z.unknown()).optional(),
					children: z.array(z.unknown()).optional(),
				})
				.optional(),
			persistKey: z.string().optional(),
			sizes: z.array(z.number()).optional(),
			layoutId: z.string().optional(),
			fieldId: z.string().optional(),
			actionId: z.string().optional(),
			placement: z
				.enum(['header', 'inline', 'context', 'assistant'])
				.optional(),
			targetId: z.string().optional(),
		})
	),
});

export interface SurfacePlannerToolsConfig {
	plan: ResolvedSurfacePlan;
	/** Optional; derived from plan layout when omitted */
	constraints?: PatchProposalConstraints;
	/** Called when a valid proposal is produced; host app stores in plan.ai.proposals */
	onPatchProposal?: (proposal: SurfacePatchProposal) => void;
}

/**
 * Create AI SDK tools for surface patch proposals.
 * Tool: propose-patch
 */
export function createSurfacePlannerTools(
	config: SurfacePlannerToolsConfig
): ToolSet {
	const { plan, constraints, onPatchProposal } = config;
	const resolvedConstraints = constraints ?? deriveConstraints(plan);

	const proposePatchTool = tool({
		description:
			'Propose surface patches (layout changes, node insertions, etc.) for user approval. ' +
			'Only use allowed ops, slots, and node kinds from the planner context.',
		inputSchema: ProposePatchInputSchema,
		execute: async (input: z.infer<typeof ProposePatchInputSchema>) => {
			const ops = input.ops as SurfacePatchOp[];
			try {
				validatePatchProposal(ops, resolvedConstraints);
				const proposal = buildSurfacePatchProposal(input.proposalId, ops);
				onPatchProposal?.(proposal);
				return {
					success: true,
					proposalId: proposal.proposalId,
					opsCount: proposal.ops.length,
					message: 'Patch proposal validated; awaiting user approval',
				};
			} catch (err) {
				return {
					success: false,
					error: err instanceof Error ? err.message : String(err),
					proposalId: input.proposalId,
				};
			}
		},
	});

	return {
		'propose-patch': proposePatchTool,
	} as ToolSet;
}

/** Build PlannerPromptInput from ResolvedSurfacePlan for system prompt. */
export function buildPlannerPromptInput(
	plan: ResolvedSurfacePlan
): import('@contractspec/lib.surface-runtime/runtime/planner-prompt').PlannerPromptInput {
	const constraints = deriveConstraints(plan);
	return {
		bundleMeta: {
			key: plan.bundleKey,
			version: '0.0.0',
			title: plan.bundleKey,
		},
		surfaceId: plan.surfaceId,
		allowedPatchOps:
			constraints.allowedOps as import('@contractspec/lib.surface-runtime/spec/types').SurfacePatchOp['op'][],
		allowedSlots: [...constraints.allowedSlots],
		allowedNodeKinds: [...constraints.allowedNodeKinds],
		actions: plan.actions.map((a) => ({
			actionId: a.actionId,
			title: a.title,
		})),
		preferences: {
			guidance: 'hints',
			density: 'standard',
			dataDepth: 'detailed',
			control: 'standard',
			media: 'text',
			pace: 'balanced',
			narrative: 'top-down',
		},
	};
}
