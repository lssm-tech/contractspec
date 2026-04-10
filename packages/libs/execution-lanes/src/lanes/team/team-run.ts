import type { TeamBackendAdapter } from '../../adapters/types';
import { RoleProfileRegistry } from '../../registry/role-profile-registry';
import { createRoleGuard } from '../../runtime/role-guard';
import { TEAM_STALE_HEARTBEAT_MS } from '../../runtime/status-views';
import type { LaneRuntimeStore } from '../../runtime/store';
import type { TeamMailboxMessage, TeamRunSpec } from '../../types';
import { nudgeTeamWorker } from './team-run-control';
import {
	buildTeamStatusViewFromState,
	createTeamRuntimeState,
	startTeamRuntime,
} from './team-run-core';
import {
	finalizeTeamRun,
	pauseTeamRun,
	rebalanceTeamRun,
	reclaimExpiredTeamLeases,
	reconcileTeamWorkerLiveness,
	resumeTeamRun,
	shutdownTeamRun,
} from './team-run-lifecycle';
import {
	attachTeamRunEvidence,
	attachTeamTaskEvidence,
	claimNextTeamTask,
	completeTeamTask,
	failTeamTask,
	recordTeamHeartbeat,
	renewTeamTaskLease,
	sendTeamMessage,
} from './team-run-operations';
import {
	createDefaultRoleRegistry,
	persistTeamState,
	releaseWorker,
	requireTask,
	requireTeamState,
	type TeamRunDependencies,
} from './team-run-shared';

export function createTeamRun(
	store: LaneRuntimeStore,
	adapter: TeamBackendAdapter,
	input?: {
		roleRegistry?: RoleProfileRegistry;
		heartbeatStaleMs?: number;
		hooks?: TeamRunDependencies['hooks'];
	}
) {
	const dependencies: TeamRunDependencies = {
		store,
		adapter,
		hooks: input?.hooks,
		roleGuard: createRoleGuard(
			input?.roleRegistry ?? createDefaultRoleRegistry()
		),
		heartbeatStaleMs: input?.heartbeatStaleMs ?? TEAM_STALE_HEARTBEAT_MS,
	};

	return {
		create(spec: TeamRunSpec, actorId?: string) {
			return createTeamRuntimeState(dependencies, spec, actorId);
		},
		start(runId: string, actorId?: string) {
			return startTeamRuntime(dependencies, runId, actorId);
		},
		claimNextTask(
			runId: string,
			workerId: string,
			leaseMs = 60_000,
			actorId?: string
		) {
			return claimNextTeamTask(dependencies, runId, workerId, leaseMs, actorId);
		},
		renewLease(
			runId: string,
			taskId: string,
			leaseMs = 60_000,
			actorId?: string
		) {
			return renewTeamTaskLease(dependencies, runId, taskId, leaseMs, actorId);
		},
		completeTask(runId: string, taskId: string, actorId?: string) {
			return completeTeamTask(dependencies, runId, taskId, actorId);
		},
		attachTaskEvidence(
			runId: string,
			taskId: string,
			bundleId: string,
			actorId?: string
		) {
			return attachTeamTaskEvidence(
				dependencies,
				runId,
				taskId,
				bundleId,
				actorId
			);
		},
		attachRunEvidence(runId: string, bundleId: string, actorId?: string) {
			return attachTeamRunEvidence(dependencies, runId, bundleId, actorId);
		},
		failTask(runId: string, taskId: string, reason: string, actorId?: string) {
			return failTeamTask(dependencies, runId, taskId, reason, actorId);
		},
		heartbeat(
			runId: string,
			workerId: string,
			progressSummary?: string,
			actorId?: string
		) {
			return recordTeamHeartbeat(
				dependencies,
				runId,
				workerId,
				progressSummary,
				actorId
			);
		},
		sendMessage(
			runId: string,
			message: Omit<TeamMailboxMessage, 'id' | 'createdAt'>,
			actorId?: string
		) {
			return sendTeamMessage(dependencies, runId, message, actorId);
		},
		async rebalance(
			runId: string,
			reason: string,
			now = new Date(),
			actorId?: string
		) {
			const state = await rebalanceTeamRun(
				dependencies,
				runId,
				reason,
				now,
				actorId
			);
			await sendTeamMessage(
				dependencies,
				runId,
				{
					from: 'system',
					to: 'leader',
					scope: 'system',
					body: `Rebalance requested: ${reason}`,
				},
				actorId
			);
			return state;
		},
		reclaimExpiredLeases(runId: string, now = new Date(), actorId?: string) {
			return reclaimExpiredTeamLeases(dependencies, runId, now, actorId);
		},
		reconcileWorkerLiveness(runId: string, now = new Date(), actorId?: string) {
			return reconcileTeamWorkerLiveness(dependencies, runId, now, actorId);
		},
		pause(runId: string, actorId?: string) {
			return pauseTeamRun(dependencies, runId, actorId);
		},
		resume(runId: string, actorId?: string) {
			return resumeTeamRun(dependencies, runId, actorId);
		},
		nudge(runId: string, workerId: string, message: string, actorId?: string) {
			return nudgeTeamWorker(dependencies, runId, workerId, message, actorId);
		},
		shutdown(runId: string, reason?: string, actorId?: string) {
			return shutdownTeamRun(dependencies, runId, reason, actorId);
		},
		finalize(runId: string, followupRecommendation?: string, actorId?: string) {
			return finalizeTeamRun(
				dependencies,
				runId,
				followupRecommendation,
				actorId
			);
		},
		getStatusView(runId: string) {
			return buildTeamStatusViewFromState(dependencies, runId);
		},
		require(runId: string) {
			return requireTeamState(store, runId);
		},
		persist(state: Awaited<ReturnType<typeof requireTeamState>>) {
			return persistTeamState(store, state);
		},
		releaseWorker,
		requireTask,
	};
}
