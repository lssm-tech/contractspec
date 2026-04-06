export const EXECUTION_LANE_ARTIFACT_TYPES = [
	'architect_review',
	'clarification_artifact',
	'completion_record',
	'context_snapshot',
	'critique_verdict',
	'evidence_bundle_ref',
	'evidence_gate_result',
	'loop_state',
	'operator_action',
	'plan_pack',
	'planner_draft',
	'planner_revision',
	'progress_ledger',
	'signoff_record',
	'signoff_request',
	'team_cleanup_state',
	'team_snapshot',
	'terminal_state',
	'tradeoff_record',
	'verification_lane_evidence',
] as const;

export type ExecutionLaneArtifactType =
	(typeof EXECUTION_LANE_ARTIFACT_TYPES)[number];

export type ExecutionLaneArtifactIdentifier =
	| ExecutionLaneArtifactType
	| (string & {});

export const EXECUTION_LANE_EVIDENCE_CLASSES = [
	'architect_review',
	'clarification_artifact',
	'completion_record',
	'critique_verdict',
	'plan_pack',
	'progress_ledger',
	'signoff_record',
	'team_snapshot',
	'tradeoff_record',
	'verification_lane_evidence',
	'verification_results',
] as const;

export type ExecutionLaneEvidenceClass =
	(typeof EXECUTION_LANE_EVIDENCE_CLASSES)[number];

export type ExecutionLaneEvidenceIdentifier =
	| ExecutionLaneEvidenceClass
	| (string & {});

const ARTIFACT_TYPE_ALIASES: Record<string, ExecutionLaneArtifactType> = {
	'architect-review': 'architect_review',
	'clarification-artifact': 'clarification_artifact',
	'completion-record': 'completion_record',
	'context-snapshot': 'context_snapshot',
	'critic-review': 'critique_verdict',
	'evidence-bundle-ref': 'evidence_bundle_ref',
	'evidence-gate-result': 'evidence_gate_result',
	'execution-plan-pack': 'plan_pack',
	'loop-state': 'loop_state',
	'operator-action': 'operator_action',
	'plan-pack': 'plan_pack',
	'planner-draft': 'planner_draft',
	'planner-revision': 'planner_revision',
	'progress-ledger': 'progress_ledger',
	'review-record': 'architect_review',
	'signoff-record': 'signoff_record',
	'signoff-request': 'signoff_request',
	'team-cleanup-state': 'team_cleanup_state',
	'team-completion-snapshot': 'team_snapshot',
	'team-snapshot': 'team_snapshot',
	'terminal-record': 'completion_record',
	'terminal-state': 'terminal_state',
	'tradeoff-record': 'tradeoff_record',
	'verification-lane-evidence': 'verification_lane_evidence',
};

const EVIDENCE_CLASS_ALIASES: Record<string, ExecutionLaneEvidenceClass> = {
	'architect-review': 'architect_review',
	'clarification-artifact': 'clarification_artifact',
	'completion-record': 'completion_record',
	'critic-review': 'critique_verdict',
	'execution-plan-pack': 'plan_pack',
	'plan-pack': 'plan_pack',
	'progress-ledger': 'progress_ledger',
	'signoff-record': 'signoff_record',
	'team-completion-snapshot': 'team_snapshot',
	'team-snapshot': 'team_snapshot',
	'terminal-record': 'completion_record',
	'tradeoff-record': 'tradeoff_record',
	'verification-lane-evidence': 'verification_lane_evidence',
	'verification-results': 'verification_results',
};

export function normalizeExecutionLaneArtifactType(
	value: string
): ExecutionLaneArtifactIdentifier {
	return ARTIFACT_TYPE_ALIASES[value] ?? value;
}

export function normalizeExecutionLaneEvidenceClass(
	value: string
): ExecutionLaneEvidenceIdentifier {
	return EVIDENCE_CLASS_ALIASES[value] ?? value;
}

export function normalizeExecutionLaneArtifactTypes(
	values: readonly string[]
): ExecutionLaneArtifactIdentifier[] {
	return values.map((value) => normalizeExecutionLaneArtifactType(value));
}

export function normalizeExecutionLaneEvidenceClasses(
	values: readonly string[]
): ExecutionLaneEvidenceIdentifier[] {
	return values.map((value) => normalizeExecutionLaneEvidenceClass(value));
}

export function isExecutionLaneArtifactType(
	value: string
): value is ExecutionLaneArtifactType {
	return EXECUTION_LANE_ARTIFACT_TYPES.includes(
		value as ExecutionLaneArtifactType
	);
}

export function isExecutionLaneEvidenceClass(
	value: string
): value is ExecutionLaneEvidenceClass {
	return EXECUTION_LANE_EVIDENCE_CLASSES.includes(
		value as ExecutionLaneEvidenceClass
	);
}
