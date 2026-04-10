import { createId } from '../../utils/id';
import {
	canFinalizeTeamRun,
	createTeamCompletionSnapshot,
	hasRequiredTeamEvidence,
} from './finalize';
import {
	assertTeamAuthority,
	persistTeamState,
	releaseWorker,
	requireTeamState,
	type TeamRunDependencies,
} from './team-run-shared';

export async function rebalanceTeamRun(
	dependencies: TeamRunDependencies,
	runId: string,
	reason: string,
	now = new Date(),
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.rebalance', runId, actorId, {
		reason,
	});
	let state = await reclaimExpiredTeamLeases(dependencies, runId, now, actorId);
	state = await reconcileTeamWorkerLiveness(dependencies, runId, now, actorId);
	return state;
}

export async function reclaimExpiredTeamLeases(
	dependencies: TeamRunDependencies,
	runId: string,
	now = new Date(),
	actorId?: string
) {
	await assertTeamAuthority(
		dependencies,
		'team.reclaim_expired_leases',
		runId,
		actorId
	);
	const state = await requireTeamState(dependencies.store, runId);
	for (const task of state.tasks) {
		if (
			task.lease &&
			new Date(task.lease.expiresAt).getTime() < now.getTime()
		) {
			task.status = 'ready';
			task.lease = undefined;
			task.retryHistory.push('lease expired');
			releaseWorker(state, task.claimedBy);
		}
	}
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function reconcileTeamWorkerLiveness(
	dependencies: TeamRunDependencies,
	runId: string,
	now = new Date(),
	actorId?: string
) {
	await assertTeamAuthority(
		dependencies,
		'team.reconcile_worker_liveness',
		runId,
		actorId
	);
	const state = await requireTeamState(dependencies.store, runId);
	for (const worker of state.workers) {
		if (
			worker.lastHeartbeatAt &&
			now.getTime() - new Date(worker.lastHeartbeatAt).getTime() >
				dependencies.heartbeatStaleMs
		) {
			worker.status = 'offline';
			state.heartbeatLog.push({
				id: createId('heartbeat'),
				workerId: worker.workerId,
				createdAt: now.toISOString(),
				currentTaskId: worker.currentTaskId,
				health: 'stale',
				progressSummary: worker.progressSummary,
			});
			for (const task of state.tasks.filter(
				(entry) => entry.claimedBy === worker.workerId
			)) {
				task.status = 'ready';
				task.lease = undefined;
				task.retryHistory.push('worker heartbeat expired');
			}
			releaseWorker(state, worker.workerId, 'offline');
		}
	}
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function shutdownTeamRun(
	dependencies: TeamRunDependencies,
	runId: string,
	reason?: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.shutdown', runId, actorId, {
		reason,
	});
	const state = await requireTeamState(dependencies.store, runId);
	state.cleanup = {
		...state.cleanup,
		status: 'in_progress',
		requestedAt: new Date().toISOString(),
		reason,
		failures: [],
	};
	for (const worker of state.workers) {
		try {
			await dependencies.adapter.stopWorker(runId, worker.workerId);
			worker.status = 'completed';
		} catch (error) {
			worker.status = 'failed';
			state.cleanup.failures.push({
				workerId: worker.workerId,
				message:
					error instanceof Error ? error.message : 'Unknown cleanup failure',
			});
		}
	}
	state.cleanup.status =
		state.cleanup.failures.length === 0 ? 'completed' : 'partial';
	state.cleanup.completedAt = new Date().toISOString();
	state.status = state.status === 'running' ? 'paused' : state.status;
	state.terminalReason = reason;
	await dependencies.store.saveArtifact({
		id: createId('artifact'),
		runId,
		artifactType: 'team_cleanup_state',
		createdAt: state.cleanup.completedAt,
		body: state.cleanup,
		summary:
			state.cleanup.status === 'completed'
				? 'Team cleanup completed.'
				: 'Team cleanup completed with partial failures.',
	});
	await persistTeamState(dependencies.store, state);
	return state;
}

export { pauseTeamRun, resumeTeamRun } from './team-run-control';

export async function finalizeTeamRun(
	dependencies: TeamRunDependencies,
	runId: string,
	followupRecommendation?: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.finalize', runId, actorId, {
		reason: followupRecommendation,
	});
	const state = await requireTeamState(dependencies.store, runId);
	if (!['completed', 'partial'].includes(state.cleanup.status)) {
		throw new Error(`Team run ${runId} has not completed worker cleanup.`);
	}
	if (!canFinalizeTeamRun(state)) {
		throw new Error(`Team run ${runId} still has non-terminal tasks.`);
	}
	if (!hasRequiredTeamEvidence(state)) {
		throw new Error(`Team run ${runId} is missing required evidence.`);
	}
	const snapshot = createTeamCompletionSnapshot(state, followupRecommendation);
	state.status = snapshot.status;
	state.updatedAt = snapshot.completedAt;
	state.terminalStateArtifactId = createId('terminal');
	await dependencies.store.saveArtifact({
		id: createId('artifact'),
		runId,
		artifactType: 'team_snapshot',
		createdAt: snapshot.completedAt,
		body: snapshot,
		summary: followupRecommendation ?? 'Team run completed.',
	});
	await dependencies.store.saveArtifact({
		id: state.terminalStateArtifactId,
		runId,
		artifactType: 'terminal_state',
		createdAt: snapshot.completedAt,
		body: snapshot,
		summary: snapshot.status,
	});
	await persistTeamState(dependencies.store, state);
	return snapshot;
}
