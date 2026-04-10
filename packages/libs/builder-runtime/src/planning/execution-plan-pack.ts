import type {
	BuilderBlueprint,
	BuilderLaneType,
	BuilderWorkspace,
} from '@contractspec/lib.builder-spec';
import type { ExecutionPlanPack } from '@contractspec/lib.execution-lanes';
import { createBuilderId } from '../utils/id';
import { LANE_TO_EXECUTION_LANE } from './lane-selection';

export function compileExecutionPlanPack(input: {
	workspace: BuilderWorkspace;
	blueprint: BuilderBlueprint;
	lane: BuilderLaneType;
}) {
	const createdAt = new Date().toISOString();
	const executionLaneKey = LANE_TO_EXECUTION_LANE[input.lane];
	return {
		meta: {
			id: createBuilderId('plan_pack'),
			createdAt,
			sourceRequest: input.blueprint.appBrief,
			scopeClass: input.blueprint.policies.length > 0 ? 'high-risk' : 'medium',
		},
		objective: `Advance ${input.workspace.name} through the Builder ${input.lane} lane.`,
		constraints: [
			'Preserve source provenance and approval requirements.',
			'Keep runtime mode and provider choice explicit to operators.',
		],
		assumptions: input.blueprint.assumptions.map(
			(assumption) => assumption.statement
		),
		nonGoals: ['Unreviewed provider mutation outside Builder control.'],
		tradeoffs: [
			{
				topic: 'runtime posture',
				tension: 'managed convenience vs local and hybrid trust boundaries',
				chosenDirection:
					'Carry one stable blueprint and vary runtime-target selection explicitly.',
				rejectedAlternatives: [
					'Implicitly switching runtime mode based on provider availability',
				],
			},
		],
		staffing: {
			availableRoleProfiles: [
				'interviewer',
				'planner',
				'architect',
				'critic',
				'provider-router',
				'executor',
				'verifier',
				'publisher',
			],
			recommendedLanes: [
				{
					lane: executionLaneKey,
					why: `Mapped from Builder lane ${input.lane}.`,
				},
			],
			handoffRecommendation: {
				nextLane: executionLaneKey,
				launchHints: [
					'Inspect runtime target fit',
					'Review provider receipts',
					'Re-run readiness',
				],
			},
		},
		planSteps: [
			{
				id: 'review_sources',
				title: 'Review source evidence and open questions',
				description: 'Confirm coverage and resolve outstanding ambiguity.',
				acceptanceCriteria: ['Coverage gaps and assumptions are explicit'],
			},
			{
				id: 'provider_route',
				title: 'Lock runtime mode and provider route',
				description:
					'Choose runtime mode, runtime target, and provider selections.',
				acceptanceCriteria: [
					'Provider routing policy is reflected in the plan',
				],
				dependencies: ['review_sources'],
			},
			{
				id: 'preview_verify',
				title: 'Preview and verify',
				description: 'Generate preview artifacts and run readiness suites.',
				acceptanceCriteria: ['Readiness evidence bundle exists'],
				dependencies: ['provider_route'],
			},
			{
				id: 'export_gate',
				title: 'Prepare export gate',
				description: 'Collect approvals and package export metadata.',
				acceptanceCriteria: ['Export gate artifacts are recorded'],
				dependencies: ['preview_verify'],
			},
		],
		verification: {
			requiredEvidence: [
				'source_coverage',
				'readiness_report',
				'replay_bundle',
				'decision_receipts',
			],
			requiredApprovals: ['builder.export.approve'],
			blockingRisks: ['provider_receipt_integrity', 'runtime_mode_mismatch'],
		},
		authorityContext: {
			policyRefs: ['builder.default-policy.v1'],
			ruleContextRefs: ['builder.control-plane'],
		},
	} satisfies ExecutionPlanPack;
}
