import type {
	BuilderBlueprint,
	BuilderLaneType,
} from '@contractspec/lib.builder-spec';
import type { LaneKey } from '@contractspec/lib.execution-lanes';

export const LANE_TO_EXECUTION_LANE: Record<BuilderLaneType, LaneKey> = {
	clarify: 'clarify',
	consensus_plan: 'plan.consensus',
	delegate_external: 'team.coordinated',
	verify_fix: 'complete.persistent',
	preview: 'complete.persistent',
	export: 'complete.persistent',
};

export function selectBuilderLane(input: {
	blueprint: BuilderBlueprint;
	patchProposalCount?: number;
}): BuilderLaneType {
	if (input.blueprint.coverageReport.missingCount > 0) {
		return 'clarify';
	}
	if (
		input.blueprint.openQuestions.length > 0 ||
		input.blueprint.policies.length > 0 ||
		input.blueprint.assumptions.some(
			(assumption) => assumption.severity === 'high'
		)
	) {
		return 'consensus_plan';
	}
	if ((input.patchProposalCount ?? 0) > 0) {
		return 'verify_fix';
	}
	if (input.blueprint.surfaces.length === 0) {
		return 'delegate_external';
	}
	return 'preview';
}
