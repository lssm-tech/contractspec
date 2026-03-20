import { Logger } from '@contractspec/lib.observability';
import type { SurfaceNode, SurfacePatchOp } from '../spec/types';
import type { ResolvedSurfacePlan } from './resolve-bundle';

const logger = new Logger('@contractspec/lib.surface-runtime');

import { validateSurfacePatch } from '../spec/validate-surface-patch';

export interface ApplySurfacePatchResult {
	plan: ResolvedSurfacePlan;
	inverseOps: SurfacePatchOp[];
}

function findNode(
	nodes: SurfaceNode[],
	nodeId: string
): SurfaceNode | undefined {
	for (const n of nodes) {
		if (n.nodeId === nodeId) return n;
		if (n.children) {
			const found = findNode(n.children, nodeId);
			if (found) return found;
		}
	}
	return undefined;
}

function collectNodeIds(nodes: SurfaceNode[]): Set<string> {
	const ids = new Set<string>();
	for (const n of nodes) {
		ids.add(n.nodeId);
		if (n.children) collectNodeIds(n.children).forEach((id) => ids.add(id));
	}
	return ids;
}

function validateOp(op: SurfacePatchOp, nodeIds: Set<string>): void {
	if (
		op.op === 'remove-node' ||
		op.op === 'replace-node' ||
		op.op === 'move-node'
	) {
		if (!nodeIds.has(op.nodeId)) {
			throw new Error(`Patch op references unknown nodeId: ${op.nodeId}`);
		}
	}
	if (op.op === 'insert-node' && !op.node?.nodeId) {
		throw new Error('insert-node requires node with nodeId');
	}
}

function produceInverse(
	op: SurfacePatchOp,
	plan: ResolvedSurfacePlan
): SurfacePatchOp | null {
	switch (op.op) {
		case 'insert-node':
			return op.node ? { op: 'remove-node', nodeId: op.node.nodeId } : null;
		case 'remove-node': {
			const node = findNode(plan.nodes, op.nodeId);
			return node ? { op: 'insert-node', slotId: 'primary', node } : null;
		}
		case 'replace-node': {
			const prev = findNode(plan.nodes, op.nodeId);
			return prev
				? { op: 'replace-node', nodeId: op.nodeId, node: prev }
				: null;
		}
		case 'set-layout':
			return { op: 'set-layout', layoutId: plan.layoutId };
		case 'reveal-field':
			return { op: 'hide-field', fieldId: op.fieldId };
		case 'hide-field':
			return { op: 'reveal-field', fieldId: op.fieldId };
		case 'move-node':
		case 'resize-panel':
		case 'set-focus':
		case 'promote-action':
			return null;
		default:
			return null;
	}
}

/**
 * Applies surface patch operations to a resolved plan.
 * Returns a new plan and inverse ops for undo; does not mutate the input.
 *
 * @param plan - The current resolved surface plan
 * @param ops - Patch operations to apply
 * @returns Updated plan and inverse ops for undo
 */
export function applySurfacePatch(
	plan: ResolvedSurfacePlan,
	ops: SurfacePatchOp[]
): ApplySurfacePatchResult {
	if (ops.length === 0) return { plan, inverseOps: [] };

	validateSurfacePatch(ops);

	const nodeIds = collectNodeIds(plan.nodes);
	for (const op of ops) {
		validateOp(op, nodeIds);
	}

	let nextNodes = [...plan.nodes];
	let nextLayoutId = plan.layoutId;
	const inverseOps: SurfacePatchOp[] = [];

	for (const op of ops) {
		const inv = produceInverse(op, {
			...plan,
			nodes: nextNodes,
			layoutId: nextLayoutId,
		});
		if (inv) inverseOps.unshift(inv);

		switch (op.op) {
			case 'insert-node':
				if (op.node) nextNodes = [...nextNodes, op.node];
				break;
			case 'remove-node':
				nextNodes = nextNodes.filter((n) => n.nodeId !== op.nodeId);
				break;
			case 'replace-node': {
				const replace = (nodes: SurfaceNode[]): SurfaceNode[] =>
					nodes.map((n) =>
						n.nodeId === op.nodeId
							? op.node
							: { ...n, children: n.children ? replace(n.children) : undefined }
					);
				nextNodes = replace(nextNodes);
				break;
			}
			case 'set-layout':
				nextLayoutId = op.layoutId;
				break;
			case 'move-node':
			case 'resize-panel':
			case 'set-focus':
			case 'reveal-field':
			case 'hide-field':
			case 'promote-action':
				break;
		}
	}

	const result = {
		plan: { ...plan, nodes: nextNodes, layoutId: nextLayoutId },
		inverseOps,
	};

	logger.info('bundle.surface.patch.applied', {
		bundleKey: plan.bundleKey,
		surfaceId: plan.surfaceId,
		opCount: ops.length,
		opTypes: [...new Set(ops.map((o) => o.op))],
	});

	return result;
}
