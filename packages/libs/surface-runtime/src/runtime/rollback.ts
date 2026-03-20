/**
 * Rollback API for surface patches.
 * Reverts last N approved patches by applying their inverse ops.
 */

import type { OverlayApprovalMeta, SurfacePatchOp } from '../spec/types';
import { applySurfacePatch } from './apply-surface-patch';
import type { ResolvedSurfacePlan } from './resolve-bundle';

export interface RollbackResult {
	plan: ResolvedSurfacePlan;
	revertedCount: number;
	remainingStack: OverlayApprovalMeta[];
}

/**
 * Reverts the last N approved patches by applying their inverse ops in order.
 * Each OverlayApprovalMeta must have inverseOps; forward ops are ignored.
 *
 * @param plan - Current resolved plan (after patches were applied)
 * @param approvalStack - Stack of approval metadata (most recent last)
 * @param count - Number of patches to revert (default 1)
 * @returns Updated plan, reverted count, and remaining stack
 */
export function rollbackSurfacePatches(
	plan: ResolvedSurfacePlan,
	approvalStack: OverlayApprovalMeta[],
	count = 1
): RollbackResult {
	if (count <= 0 || approvalStack.length === 0) {
		return { plan, revertedCount: 0, remainingStack: approvalStack };
	}

	const toRevert = approvalStack.slice(-count);
	const remaining = approvalStack.slice(0, -count);

	const currentPlan = plan;
	const allInverseOps: SurfacePatchOp[] = [];

	for (const meta of toRevert) {
		if (meta.inverseOps.length > 0) {
			allInverseOps.push(...meta.inverseOps);
		}
	}

	if (allInverseOps.length === 0) {
		return { plan, revertedCount: 0, remainingStack: approvalStack };
	}

	const result = applySurfacePatch(currentPlan, allInverseOps);

	return {
		plan: result.plan,
		revertedCount: toRevert.length,
		remainingStack: remaining,
	};
}
