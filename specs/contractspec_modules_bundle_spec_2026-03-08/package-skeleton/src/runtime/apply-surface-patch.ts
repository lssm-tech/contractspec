import type { SurfacePatchOp } from '../spec/types';
import type { ResolvedSurfacePlan } from './resolve-bundle';

export function applySurfacePatch(
	plan: ResolvedSurfacePlan,
	ops: SurfacePatchOp[]
): ResolvedSurfacePlan {
	// Intentionally minimal. The real implementation should:
	// - validate node kinds and slot mutability
	// - produce inverse ops for undo
	// - emit audit metadata
	// - handle panel persistence
	// - reject invalid cross-slot moves
	void ops;
	return plan;
}
