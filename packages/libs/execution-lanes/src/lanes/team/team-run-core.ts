import type {
	TeamRunSpec,
	TeamRunState,
	TeamTaskRecord,
	TeamWorkerState,
} from '../../types';
import { assertValidTeamRunSpec } from '../../validation/team-run-spec';
import {
	assertTeamAuthority,
	assertTeamWorkerRole,
	persistTeamState,
	requireTeamState,
	type TeamRunDependencies,
} from './team-run-shared';
import {
	assertValidTeamWorkerScopes,
	createTeamWorkerLaunchSpec,
} from './worker-launch';

export async function createTeamRuntimeState(
	dependencies: TeamRunDependencies,
	spec: TeamRunSpec,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.create', spec.id, actorId, {
		metadata: {
			workerCount: spec.workers.length,
			taskCount: spec.backlog.length,
		},
	});
	assertValidTeamRunSpec(spec);
	assertValidTeamWorkerScopes(spec, (roleKey) =>
		dependencies.roleGuard.get(roleKey)
	);
	for (const worker of spec.workers) {
		assertTeamWorkerRole(dependencies.roleGuard, worker.roleProfile);
	}
	if (spec.verificationLane.ownerRole !== 'human') {
		dependencies.roleGuard.assert({
			roleKey: spec.verificationLane.ownerRole,
			lane: 'team.coordinated',
			requiredTools: ['review'],
		});
	}
	const now = new Date().toISOString();
	const state: TeamRunState = {
		runId: spec.id,
		spec,
		status: 'initialized',
		tasks: spec.backlog.map<TeamTaskRecord>((task) => ({
			taskId: task.taskId,
			title: task.title,
			description: task.description,
			roleHint: task.roleHint,
			dependencies: task.dependencies ?? [],
			writePaths: task.writePaths,
			status: (task.dependencies?.length ?? 0) > 0 ? 'pending' : 'ready',
			evidenceBundleIds: [],
			retryHistory: [],
		})),
		workers: spec.workers.map<TeamWorkerState>((worker) => ({
			workerId: worker.workerId,
			roleProfile: worker.roleProfile,
			status: 'idle',
		})),
		mailbox: [],
		heartbeatLog: [],
		cleanup: { status: 'not_requested', failures: [] },
		evidenceBundleIds: [],
		createdAt: now,
		updatedAt: now,
	};
	await dependencies.store.saveTeam(state);
	return state;
}

export async function startTeamRuntime(
	dependencies: TeamRunDependencies,
	runId: string,
	actorId?: string
) {
	await assertTeamAuthority(dependencies, 'team.start', runId, actorId);
	const state = await requireTeamState(dependencies.store, runId);
	for (const worker of state.workers) {
		const workerSpec = state.spec.workers.find(
			(entry) => entry.workerId === worker.workerId
		);
		if (!workerSpec) {
			throw new Error(`Worker spec not found: ${worker.workerId}`);
		}
		await dependencies.adapter.startWorker(
			createTeamWorkerLaunchSpec(
				runId,
				state.spec,
				workerSpec,
				dependencies.roleGuard.get(worker.roleProfile)
			)
		);
		worker.status = 'running';
	}
	state.status = 'running';
	await persistTeamState(dependencies.store, state);
	return state;
}

export async function buildTeamStatusViewFromState(
	dependencies: TeamRunDependencies,
	runId: string
) {
	const state = await requireTeamState(dependencies.store, runId);
	const now = new Date();
	const staleWorkerIds = state.workers
		.filter((worker) => {
			if (!worker.lastHeartbeatAt) {
				return false;
			}
			return (
				now.getTime() - new Date(worker.lastHeartbeatAt).getTime() >
				dependencies.heartbeatStaleMs
			);
		})
		.map((worker) => worker.workerId);
	return {
		runId,
		status: state.status,
		totalTasks: state.tasks.length,
		completedTasks: state.tasks.filter((task) => task.status === 'completed')
			.length,
		activeWorkers: state.workers.filter((worker) => worker.status === 'running')
			.length,
		staleWorkers: staleWorkerIds.length,
		staleLeaseCount: state.tasks.filter(
			(task) =>
				task.lease && new Date(task.lease.expiresAt).getTime() < now.getTime()
		).length,
		staleWorkerIds,
		pendingEvidence: state.tasks.filter(
			(task) => task.evidenceBundleIds.length === 0
		).length,
		queueSkew: Math.max(
			state.tasks.filter((task) => task.status === 'ready').length -
				state.workers.filter((worker) => worker.status === 'running').length,
			0
		),
		verificationReady:
			!state.spec.verificationLane.required ||
			state.evidenceBundleIds.length > 0,
		cleanupStatus: state.cleanup.status,
		updatedAt: state.updatedAt,
	};
}
