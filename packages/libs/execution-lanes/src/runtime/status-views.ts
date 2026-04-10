import type {
	CompletionStatusView,
	LaneRuntimeSnapshot,
	LaneStatusView,
	TeamRunState,
	TeamStatusView,
} from '../types';
import { evaluateLaneReadiness } from './readiness';

export const TEAM_STALE_HEARTBEAT_MS = 90_000;

export function buildLaneStatusView(
	snapshot: LaneRuntimeSnapshot,
	now = new Date()
): LaneStatusView {
	const derived = evaluateLaneReadiness(snapshot, { now: () => now });
	const evidenceCompleteness =
		snapshot.run.evidenceBundleIds.length === 0
			? 0
			: snapshot.evidence.length /
				Math.max(snapshot.run.evidenceBundleIds.length, 1);

	return {
		runId: snapshot.run.runId,
		lane: snapshot.run.lane,
		objective: snapshot.run.objective,
		status: snapshot.run.status,
		currentPhase: snapshot.run.currentPhase,
		ownerRole: snapshot.run.ownerRole,
		evidenceCompleteness: Math.min(1, evidenceCompleteness),
		missingArtifacts: derived.missingArtifacts,
		pendingApprovals: snapshot.run.pendingApprovalRoles,
		missingEvidence: derived.missingEvidence,
		missingApprovals: derived.missingApprovals,
		blockingRisks: derived.blockingRisks,
		terminalReadiness: derived.terminalReadiness,
		recommendedNextLane: snapshot.run.recommendedNextLane,
		updatedAt: snapshot.run.updatedAt,
	};
}

export function buildCompletionStatusView(
	snapshot: LaneRuntimeSnapshot,
	now = new Date()
): CompletionStatusView | undefined {
	const completion = snapshot.completion;
	if (!completion) {
		return undefined;
	}
	const derived = evaluateLaneReadiness(snapshot, { now: () => now });
	return {
		runId: completion.runId,
		phase: completion.phase,
		iteration: completion.iteration,
		retryCount: completion.retryCount,
		snapshotRef: completion.spec.snapshotRef,
		pendingApprovals: completion.pendingApprovalRoles,
		evidenceBundles: completion.evidenceBundleIds.length,
		lastFailureClass: completion.lastFailureClass,
		missingEvidence: derived.missingEvidence,
		terminalReadiness: derived.terminalReadiness,
		updatedAt: completion.updatedAt,
	};
}

export function buildTeamStatusView(
	snapshot: LaneRuntimeSnapshot,
	now = new Date()
): TeamStatusView | undefined {
	const team = snapshot.team;
	if (!team) {
		return undefined;
	}
	const activeWorkers = team.workers.filter(
		(worker) => worker.status === 'running'
	).length;
	const staleWorkerIds = getStaleWorkerIds(team, now);
	const staleLeaseCount = team.tasks.filter((task) =>
		isExpiredLease(task.lease?.expiresAt, now)
	).length;
	const readyTasks = team.tasks.filter(
		(task) => task.status === 'ready'
	).length;

	return {
		runId: team.runId,
		status: team.status,
		totalTasks: team.tasks.length,
		completedTasks: team.tasks.filter((task) => task.status === 'completed')
			.length,
		activeWorkers,
		staleWorkers: staleWorkerIds.length,
		staleLeaseCount,
		staleWorkerIds,
		pendingEvidence: team.tasks.filter(
			(task) => task.evidenceBundleIds.length === 0
		).length,
		queueSkew: Math.max(readyTasks - activeWorkers, 0),
		verificationReady: isTeamVerificationReady(team),
		cleanupStatus: team.cleanup.status,
		updatedAt: team.updatedAt,
	};
}

function isTeamVerificationReady(team: TeamRunState): boolean {
	if (!team.spec.verificationLane.required) {
		return true;
	}
	return team.evidenceBundleIds.length > 0;
}

function getStaleWorkerIds(team: TeamRunState, now: Date): string[] {
	return team.workers
		.filter((worker) => {
			if (!worker.lastHeartbeatAt) {
				return false;
			}
			return (
				now.getTime() - new Date(worker.lastHeartbeatAt).getTime() >
				TEAM_STALE_HEARTBEAT_MS
			);
		})
		.map((worker) => worker.workerId);
}

function isExpiredLease(expiresAt: string | undefined, now: Date): boolean {
	if (!expiresAt) {
		return false;
	}
	return new Date(expiresAt).getTime() < now.getTime();
}
