import type { TeamWorkerState } from '../../types';
import { createId } from '../../utils/id';
import {
	assertTeamAuthority,
	persistTeamState,
	requireTeamState,
	type TeamRunDependencies,
} from './team-run-shared';

export async function pauseTeamRun(
	dependencies: TeamRunDependencies,
	runId: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'pause', runId, actorId);
	const state = await requireTeamState(dependencies.store, runId);
	const activeWorkers = state.workers.filter(
		(worker) => worker.status === 'running'
	);
	if (activeWorkers.length > 0 && !dependencies.adapter.pauseWorker) {
		throw unsupportedTeamBackendAction(state.spec.backendKey, 'pause');
	}

	for (const worker of activeWorkers) {
		await dependencies.adapter.pauseWorker?.(runId, worker.workerId);
		worker.status = 'paused';
	}
	state.status = 'paused';
	state.updatedAt = new Date().toISOString();
	await dependencies.store.appendEvent({
		id: createId('event'),
		runId,
		type: 'team.paused',
		createdAt: state.updatedAt,
		phase: state.status,
		message: 'Team run paused.',
	});
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function resumeTeamRun(
	dependencies: TeamRunDependencies,
	runId: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'resume', runId, actorId);
	const state = await requireTeamState(dependencies.store, runId);
	const pausedWorkers = state.workers.filter(
		(worker) => worker.status === 'paused'
	);
	if (pausedWorkers.length > 0 && !dependencies.adapter.resumeWorker) {
		throw unsupportedTeamBackendAction(state.spec.backendKey, 'resume');
	}

	for (const worker of pausedWorkers) {
		await dependencies.adapter.resumeWorker?.(runId, worker.workerId);
		worker.status = nextWorkerStatus(worker);
	}
	state.status = 'running';
	state.updatedAt = new Date().toISOString();
	await dependencies.store.appendEvent({
		id: createId('event'),
		runId,
		type: 'team.resumed',
		createdAt: state.updatedAt,
		phase: state.status,
		message: 'Team run resumed.',
	});
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function nudgeTeamWorker(
	dependencies: TeamRunDependencies,
	runId: string,
	workerId: string,
	message: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'nudge', runId, actorId, {
		reason: message,
		metadata: { workerId },
	});
	const state = await requireTeamState(dependencies.store, runId);
	const worker = state.workers.find((entry) => entry.workerId === workerId);
	if (!worker) {
		throw new Error(`Worker not found: ${workerId}`);
	}
	if (!state.spec.coordination.mailbox && !dependencies.adapter.nudgeWorker) {
		throw unsupportedTeamBackendAction(state.spec.backendKey, 'nudge');
	}

	const createdAt = new Date().toISOString();
	state.mailbox.push({
		id: createId('mail'),
		from: 'system',
		to: workerId,
		scope: 'system',
		createdAt,
		body: message,
	});
	await dependencies.adapter.nudgeWorker?.(runId, workerId, message);
	state.updatedAt = createdAt;
	await dependencies.store.appendEvent({
		id: createId('event'),
		runId,
		type: 'team.nudged',
		createdAt,
		phase: state.status,
		message,
		metadata: { workerId },
	});
	await persistTeamState(dependencies.store, state);
	return state.mailbox.at(-1)!;
}

function nextWorkerStatus(worker: TeamWorkerState): TeamWorkerState['status'] {
	return worker.currentTaskId ? 'running' : 'idle';
}

function unsupportedTeamBackendAction(
	backendKey: string | undefined,
	action: 'pause' | 'resume' | 'nudge'
) {
	const backend = backendKey ?? 'unknown';
	const verb =
		action === 'pause'
			? 'pausing'
			: action === 'resume'
				? 'resuming'
				: 'nudging';
	return new Error(
		`Team backend "${backend}" does not support ${verb} workers.`
	);
}
