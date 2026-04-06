import type { ExecutionPlanPack, LaneKey } from '../types';

export interface LaneSelectionInput {
	preferredLane?: LaneKey;
	hasPlanPack?: boolean;
	ambiguityScore?: number;
	parallelizableTaskCount?: number;
	requiresDurableClosure?: boolean;
	planPack?: ExecutionPlanPack;
}

export function createLaneSelector() {
	return {
		select(input: LaneSelectionInput): LaneKey {
			if (input.preferredLane) {
				return input.preferredLane;
			}
			if (input.planPack) {
				return pickExecutionLane(input.planPack, input.parallelizableTaskCount);
			}
			if ((input.ambiguityScore ?? 0) >= 0.45) {
				return 'clarify';
			}
			if (input.hasPlanPack) {
				if (
					input.parallelizableTaskCount &&
					input.parallelizableTaskCount > 2
				) {
					return 'team.coordinated';
				}
				return 'complete.persistent';
			}
			return 'plan.consensus';
		},
	};
}

function pickExecutionLane(
	planPack: ExecutionPlanPack,
	parallelizableTaskCount?: number
): LaneKey {
	const recommended = planPack.staffing.handoffRecommendation.nextLane;
	if (recommended) {
		return recommended;
	}
	if ((parallelizableTaskCount ?? planPack.planSteps.length) > 3) {
		return 'team.coordinated';
	}
	return 'complete.persistent';
}
