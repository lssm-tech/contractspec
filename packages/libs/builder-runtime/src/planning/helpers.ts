import type {
	BuilderLaneType,
	BuilderPolicyClassification,
} from '@contractspec/lib.builder-spec';
import type {
	ComparisonMode,
	ExecutionTaskType,
	ProviderSelection,
	RuntimeMode,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';

const RISK_LEVEL_ORDER: Record<
	NonNullable<ProviderSelection['riskLevel']>,
	number
> = {
	low: 0,
	medium: 1,
	high: 2,
	critical: 3,
};

export function riskMeetsThreshold(
	actual: ProviderSelection['riskLevel'],
	threshold: ProviderSelection['riskLevel']
) {
	return RISK_LEVEL_ORDER[actual] >= RISK_LEVEL_ORDER[threshold];
}

export function classifySensitiveSourceData(
	classifications: BuilderPolicyClassification[] | undefined
) {
	return (classifications ?? []).some(
		(classification) =>
			classification === 'confidential' || classification === 'restricted'
	);
}

export function taskTypesForLane(lane: BuilderLaneType): ExecutionTaskType[] {
	switch (lane) {
		case 'clarify':
			return ['clarify', 'summarize_sources'];
		case 'consensus_plan':
			return ['draft_blueprint', 'extract_structure'];
		case 'delegate_external':
			return ['propose_patch', 'generate_tests'];
		case 'verify_fix':
			return ['verify_output', 'explain_diff'];
		case 'export':
			return ['generate_ui_artifacts', 'explain_diff'];
		default:
			return ['generate_ui_artifacts'];
	}
}

export function runtimeHasModeTarget(
	runtimeTargets: RuntimeTarget[],
	runtimeMode: RuntimeMode
): boolean {
	if (runtimeMode === 'managed') {
		return true;
	}
	return runtimeTargets.some(
		(target) =>
			target.runtimeMode === runtimeMode &&
			target.registrationState === 'registered' &&
			target.capabilityProfile.supportsExport
	);
}

export function comparisonProviderLimit(mode: ComparisonMode) {
	if (mode === 'single_provider') {
		return 0;
	}
	return mode === 'multi_provider' ? 2 : 1;
}
