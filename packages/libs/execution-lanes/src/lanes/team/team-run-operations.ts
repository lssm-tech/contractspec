import type { TeamMailboxMessage } from '../../types';
import { createId } from '../../utils/id';
import {
	assertTeamAuthority,
	persistTeamState,
	releaseWorker,
	requireTask,
	requireTeamState,
	type TeamRunDependencies,
} from './team-run-shared';

export async function claimNextTeamTask(
	dependencies: TeamRunDependencies,
	runId: string,
	workerId: string,
	leaseMs = 60_000,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.claim_task', runId, actorId, {
		metadata: { workerId, leaseMs },
	});
	const state = await requireTeamState(dependencies.store, runId);
	const worker = state.workers.find((entry) => entry.workerId === workerId);
	const task =
		state.tasks.find(
			(entry) =>
				entry.status === 'ready' && entry.roleHint === worker?.roleProfile
		) ?? state.tasks.find((entry) => entry.status === 'ready');
	if (!task) {
		return undefined;
	}
	task.status = 'leased';
	task.claimedBy = workerId;
	task.lease = {
		workerId,
		leasedAt: new Date().toISOString(),
		expiresAt: new Date(Date.now() + leaseMs).toISOString(),
		renewCount: 0,
	};
	if (worker) {
		worker.status = 'running';
		worker.currentTaskId = task.taskId;
	}
	await persistTeamState(dependencies.store, state);
	return task;
}

export async function renewTeamTaskLease(
	dependencies: TeamRunDependencies,
	runId: string,
	taskId: string,
	leaseMs = 60_000,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.renew_lease', runId, actorId, {
		metadata: { taskId, leaseMs },
	});
	const state = await requireTeamState(dependencies.store, runId);
	const task = state.tasks.find((entry) => entry.taskId === taskId);
	if (!task?.lease) {
		throw new Error(`Task lease not found: ${taskId}`);
	}
	task.lease.expiresAt = new Date(Date.now() + leaseMs).toISOString();
	task.lease.renewCount += 1;
	await persistTeamState(dependencies.store, state);
	return task;
}

export async function completeTeamTask(
	dependencies: TeamRunDependencies,
	runId: string,
	taskId: string,
	actorId?: string
) {
	await assertTeamAuthority(
		dependencies,
		'team.complete_task',
		runId,
		actorId,
		{
			metadata: { taskId },
		}
	);
	const state = await requireTeamState(dependencies.store, runId);
	const task = requireTask(state, taskId);
	task.status = 'completed';
	task.lease = undefined;
	for (const dependent of state.tasks.filter((entry) =>
		entry.dependencies.includes(taskId)
	)) {
		if (
			dependent.dependencies.every((dependency) =>
				state.tasks.some(
					(entry) => entry.taskId === dependency && entry.status === 'completed'
				)
			)
		) {
			dependent.status = 'ready';
		}
	}
	releaseWorker(state, task.claimedBy);
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function attachTeamTaskEvidence(
	dependencies: TeamRunDependencies,
	runId: string,
	taskId: string,
	bundleId: string,
	actorId?: string
) {
	await assertTeamAuthority(
		dependencies,
		'team.attach_task_evidence',
		runId,
		actorId,
		{ metadata: { taskId, bundleId } }
	);
	const state = await requireTeamState(dependencies.store, runId);
	const task = requireTask(state, taskId);
	task.evidenceBundleIds = Array.from(
		new Set([...task.evidenceBundleIds, bundleId])
	);
	await persistTeamState(dependencies.store, state);
	return task;
}

export async function attachTeamRunEvidence(
	dependencies: TeamRunDependencies,
	runId: string,
	bundleId: string,
	actorId?: string
) {
	await assertTeamAuthority(
		dependencies,
		'team.attach_run_evidence',
		runId,
		actorId,
		{ metadata: { bundleId } }
	);
	const state = await requireTeamState(dependencies.store, runId);
	state.evidenceBundleIds = Array.from(
		new Set([...state.evidenceBundleIds, bundleId])
	);
	await dependencies.store.saveArtifact({
		id: createId('artifact'),
		runId,
		artifactType: 'verification_lane_evidence',
		createdAt: new Date().toISOString(),
		body: { bundleId },
		summary: `Attached verification evidence bundle ${bundleId}.`,
	});
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function failTeamTask(
	dependencies: TeamRunDependencies,
	runId: string,
	taskId: string,
	reason: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.fail_task', runId, actorId, {
		reason,
		metadata: { taskId },
	});
	const state = await requireTeamState(dependencies.store, runId);
	const task = requireTask(state, taskId);
	task.status = 'failed';
	task.retryHistory.push(reason);
	task.lease = undefined;
	releaseWorker(state, task.claimedBy);
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function recordTeamHeartbeat(
	dependencies: TeamRunDependencies,
	runId: string,
	workerId: string,
	progressSummary?: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.heartbeat', runId, actorId, {
		reason: progressSummary,
		metadata: { workerId },
	});
	const state = await requireTeamState(dependencies.store, runId);
	const worker = state.workers.find((entry) => entry.workerId === workerId);
	if (!worker) {
		throw new Error(`Worker not found: ${workerId}`);
	}
	worker.lastHeartbeatAt = new Date().toISOString();
	worker.progressSummary = progressSummary;
	state.heartbeatLog.push({
		id: createId('heartbeat'),
		workerId,
		createdAt: worker.lastHeartbeatAt,
		currentTaskId: worker.currentTaskId,
		health: 'healthy',
		progressSummary,
	});
	await persistTeamState(dependencies.store, state);
	return worker;
}

export async function sendTeamMessage(
	dependencies: TeamRunDependencies,
	runId: string,
	message: Omit<TeamMailboxMessage, 'id' | 'createdAt'>,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.send_message', runId, actorId, {
		reason: message.body,
		metadata: { from: message.from, to: message.to, scope: message.scope },
	});
	const state = await requireTeamState(dependencies.store, runId);
	state.mailbox.push({
		...message,
		id: createId('mail'),
		createdAt: new Date().toISOString(),
	});
	await persistTeamState(dependencies.store, state);
	return state.mailbox.at(-1)!;
}
