import { DEFAULT_LANES } from '../defaults';
import { createEvidenceGate } from '../evidence/gate';
import {
	canFinalizeTeamRun,
	hasRequiredTeamEvidence,
} from '../lanes/team/finalize';
import type {
	ExecutionLaneArtifactIdentifier,
	ExecutionLaneSpec,
	LaneArtifactRecord,
	LaneKey,
	LaneRuntimeSnapshot,
	TerminalReadiness,
} from '../types';
import { normalizeExecutionLaneArtifactType } from '../types';
import { validateClarificationArtifact } from '../validation/clarification-artifact';
import { validateExecutionPlanPack } from '../validation/plan-pack';

const gate = createEvidenceGate();

const DEFAULT_LANE_MAP = new Map<LaneKey, ExecutionLaneSpec>(
	DEFAULT_LANES.map((lane) => [lane.key, lane])
);

export interface LaneReadinessOptions {
	laneRegistry?: {
		get(key: LaneKey): ExecutionLaneSpec | undefined;
	};
	now?: () => Date;
}

export interface LaneReadinessEvaluation {
	missingArtifacts: string[];
	missingEvidence: string[];
	missingApprovals: string[];
	blockingRisks: string[];
	missingNextLane: boolean;
	terminalReadiness: TerminalReadiness;
}

export function evaluateLaneReadiness(
	snapshot: LaneRuntimeSnapshot,
	options: LaneReadinessOptions = {}
): LaneReadinessEvaluation {
	const now = options.now?.() ?? new Date();
	const spec =
		options.laneRegistry?.get(snapshot.run.lane) ??
		DEFAULT_LANE_MAP.get(snapshot.run.lane);
	const missingArtifacts = (spec?.requiredArtifacts ?? [])
		.filter(
			(requiredArtifact) => !hasArtifact(snapshot.artifacts, requiredArtifact)
		)
		.map((artifact) => String(artifact));
	const missingNextLane =
		(spec?.allowedTransitions.length ?? 0) > 0 &&
		!snapshot.run.recommendedNextLane;

	if (snapshot.completion) {
		const result =
			snapshot.completion.lastGateResult ??
			gate.evaluate({
				policy: snapshot.completion.spec.verificationPolicy,
				evidence: snapshot.evidence,
				approvals: snapshot.approvals,
				blockingRisks: snapshot.run.blockingRisks,
				now: () => now,
			});
		return {
			missingArtifacts,
			missingEvidence: [...result.missingEvidence, ...result.staleEvidence],
			missingApprovals: result.missingApprovals,
			blockingRisks: result.blockingRisks,
			missingNextLane,
			terminalReadiness: pickTerminalReadiness({
				missingArtifacts,
				missingEvidence: result.missingEvidence,
				missingApprovals: result.missingApprovals,
				blockingRisks: result.blockingRisks,
				hasStaleEvidence: result.staleEvidence.length > 0,
				missingNextLane,
			}),
		};
	}

	if (snapshot.team && spec && typeof spec.verificationPolicy !== 'string') {
		const result = gate.evaluate({
			policy: spec.verificationPolicy,
			evidence: snapshot.evidence,
			approvals: snapshot.approvals,
			blockingRisks: snapshot.run.blockingRisks,
			now: () => now,
		});
		const missingApprovals =
			result.missingApprovals.length > 0
				? result.missingApprovals
				: snapshot.run.pendingApprovalRoles.map((role) => `${role}:approve`);
		return {
			missingArtifacts,
			missingEvidence: [...result.missingEvidence, ...result.staleEvidence],
			missingApprovals,
			blockingRisks: result.blockingRisks,
			missingNextLane,
			terminalReadiness: pickTerminalReadiness({
				missingArtifacts,
				missingEvidence: result.missingEvidence,
				missingApprovals,
				blockingRisks: result.blockingRisks,
				hasStaleEvidence: result.staleEvidence.length > 0,
				missingNextLane,
				requiresCleanup: true,
				cleanupInProgress: snapshot.team.cleanup.status === 'in_progress',
				fullyReady:
					canFinalizeTeamRun(snapshot.team) &&
					hasRequiredTeamEvidence(snapshot.team) &&
					(snapshot.team.cleanup.status === 'completed' ||
						snapshot.team.cleanup.status === 'partial'),
			}),
		};
	}

	return {
		missingArtifacts,
		missingEvidence: [],
		missingApprovals: snapshot.run.pendingApprovalRoles.map(
			(role) => `${role}:approve`
		),
		blockingRisks: snapshot.run.blockingRisks,
		missingNextLane,
		terminalReadiness: pickTerminalReadiness({
			missingArtifacts,
			missingEvidence: [],
			missingApprovals: snapshot.run.pendingApprovalRoles.map(
				(role) => `${role}:approve`
			),
			blockingRisks: snapshot.run.blockingRisks,
			hasStaleEvidence: false,
			missingNextLane,
		}),
	};
}

function hasArtifact(
	artifacts: LaneArtifactRecord[],
	requiredArtifact: ExecutionLaneArtifactIdentifier
): boolean {
	return artifacts.some((artifact) => {
		if (
			normalizeExecutionLaneArtifactType(String(artifact.artifactType)) !==
			requiredArtifact
		) {
			return false;
		}
		return isValidArtifactBody(requiredArtifact, artifact.body);
	});
}

function isValidArtifactBody(
	requiredArtifact: ExecutionLaneArtifactIdentifier,
	body: unknown
): boolean {
	switch (requiredArtifact) {
		case 'clarification_artifact':
			return (
				typeof body === 'object' &&
				body !== null &&
				validateClarificationArtifact(body as never).length === 0
			);
		case 'plan_pack':
			return (
				typeof body === 'object' &&
				body !== null &&
				validateExecutionPlanPack(body as never).length === 0
			);
		case 'tradeoff_record':
		case 'progress_ledger':
			return Array.isArray(body);
		case 'architect_review':
		case 'critique_verdict':
		case 'completion_record':
		case 'signoff_record':
		case 'team_snapshot':
		case 'verification_lane_evidence':
			return typeof body === 'object' && body !== null;
		default:
			return true;
	}
}

function pickTerminalReadiness(input: {
	missingArtifacts: string[];
	missingEvidence: string[];
	missingApprovals: string[];
	blockingRisks: string[];
	hasStaleEvidence: boolean;
	missingNextLane: boolean;
	requiresCleanup?: boolean;
	cleanupInProgress?: boolean;
	fullyReady?: boolean;
}): TerminalReadiness {
	if (input.requiresCleanup && input.cleanupInProgress) {
		return 'cleanup_pending';
	}
	if (input.blockingRisks.length > 0) {
		return 'blocked';
	}
	if (input.missingArtifacts.length > 0) {
		return 'missing_artifact';
	}
	if (input.hasStaleEvidence) {
		return 'stale_evidence';
	}
	if (input.missingEvidence.length > 0) {
		return 'missing_evidence';
	}
	if (input.missingApprovals.length > 0) {
		return 'missing_approval';
	}
	if (input.missingNextLane) {
		return 'not_ready';
	}
	if (input.requiresCleanup && !input.fullyReady) {
		return 'not_ready';
	}
	return 'ready';
}
