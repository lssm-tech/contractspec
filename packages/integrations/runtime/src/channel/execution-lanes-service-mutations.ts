import type { TeamRunState } from '@contractspec/lib.execution-lanes';
import {
	applyWorkerLifecycleAction,
	assertAction,
	type ExecutionLaneOperatorDependencies,
	getTeamBackend,
	mutateRun,
	type NudgeExecutionLaneInput,
	now,
	recordOperatorAction,
	syncCompletionState,
	syncTeamState,
	terminateTeamWorkers,
} from './execution-lanes-service-shared';

export async function pauseLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	actorId?: string
) {
	await assertAction(dependencies, runId, 'pause', actorId);
	await mutateRun(dependencies, runId, 'paused', 'paused');
	const team = await dependencies.store.getTeam(runId);
	if (team) {
		await applyWorkerLifecycleAction(
			team,
			getTeamBackend(dependencies, team),
			'pauseWorker'
		);
		await syncTeamState(dependencies, {
			...team,
			status: 'paused',
			updatedAt: now(dependencies),
		});
	}
	await recordOperatorAction(dependencies, runId, 'pause', {
		actorId,
		summary: 'Lane paused by operator.',
	});
	return dependencies.store.getSnapshot(runId);
}

export async function resumeLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	actorId?: string
) {
	await assertAction(dependencies, runId, 'resume', actorId);
	await mutateRun(dependencies, runId, 'running', 'running');
	const team = await dependencies.store.getTeam(runId);
	if (team && team.status === 'paused') {
		await applyWorkerLifecycleAction(
			team,
			getTeamBackend(dependencies, team),
			'resumeWorker'
		);
		await syncTeamState(dependencies, {
			...team,
			status: 'running',
			updatedAt: now(dependencies),
		});
	}
	await recordOperatorAction(dependencies, runId, 'resume', {
		actorId,
		summary: 'Lane resumed by operator.',
	});
	return dependencies.store.getSnapshot(runId);
}

export async function retryLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	actorId?: string
) {
	await assertAction(dependencies, runId, 'retry', actorId);
	await mutateRun(dependencies, runId, 'running', 'retrying');
	const completion = await dependencies.store.getCompletion(runId);
	if (completion) {
		await syncCompletionState(dependencies, {
			...completion,
			phase: 'remediating',
			updatedAt: now(dependencies),
		});
	}
	await recordOperatorAction(dependencies, runId, 'retry', {
		actorId,
		summary: 'Lane retry requested by operator.',
	});
	return dependencies.store.getSnapshot(runId);
}

export async function abortLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	reason?: string,
	actorId?: string
) {
	await assertAction(dependencies, runId, 'abort', actorId, reason);
	await dependencies.store.updateRun(runId, (current) => ({
		...current,
		status: 'aborted',
		currentPhase: 'aborted',
		terminalReason: reason,
		updatedAt: now(dependencies),
	}));
	const completion = await dependencies.store.getCompletion(runId);
	if (completion) {
		await syncCompletionState(dependencies, {
			...completion,
			phase: 'aborted',
			updatedAt: now(dependencies),
		});
	}
	const team = await dependencies.store.getTeam(runId);
	if (team) {
		await syncTeamState(
			dependencies,
			await terminateTeamWorkers(dependencies, team, reason, 'aborted')
		);
	}
	await recordOperatorAction(dependencies, runId, 'abort', {
		actorId,
		reason,
		summary: reason ? `Lane aborted: ${reason}` : 'Lane aborted by operator.',
	});
	return dependencies.store.getSnapshot(runId);
}

export async function shutdownLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	reason?: string,
	actorId?: string
) {
	await assertAction(dependencies, runId, 'shutdown', actorId, reason);
	const team = await dependencies.store.getTeam(runId);
	if (team) {
		await syncTeamState(
			dependencies,
			await terminateTeamWorkers(
				dependencies,
				team,
				reason,
				team.status === 'running' ? 'paused' : team.status
			)
		);
	} else {
		await dependencies.store.updateRun(runId, (current) => ({
			...current,
			currentPhase: 'shutdown',
			terminalReason: reason ?? current.terminalReason,
			updatedAt: now(dependencies),
		}));
	}
	await recordOperatorAction(dependencies, runId, 'shutdown', {
		actorId,
		reason,
		summary: reason
			? `Team shutdown requested: ${reason}`
			: 'Lane shutdown requested by operator.',
	});
	return dependencies.store.getSnapshot(runId);
}

export async function nudgeLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	input: NudgeExecutionLaneInput
) {
	await assertAction(
		dependencies,
		runId,
		'nudge',
		input.actorId,
		input.message,
		{ workerId: input.workerId }
	);
	const team = await dependencies.store.getTeam(runId);
	if (!team) {
		throw new Error(
			`Execution lane run ${runId} has no team backend to nudge.`
		);
	}
	const workerIds = input.workerId
		? [input.workerId]
		: team.workers.map((worker) => worker.workerId);
	const backend = getTeamBackend(dependencies, team);
	for (const workerId of workerIds) {
		await backend?.nudgeWorker?.(runId, workerId, input.message);
	}
	const next: TeamRunState = {
		...team,
		mailbox: [
			...team.mailbox,
			...workerIds.map((workerId) => ({
				id: `mail-${Date.now()}-${workerId}`,
				from: input.actorId ?? 'local:operator',
				to: workerId,
				scope: 'leader-worker' as const,
				createdAt: now(dependencies),
				body: input.message,
			})),
		],
		updatedAt: now(dependencies),
	};
	await syncTeamState(dependencies, next);
	await recordOperatorAction(dependencies, runId, 'nudge', {
		actorId: input.actorId,
		metadata: { workerIds, message: input.message },
		summary:
			workerIds.length === 1
				? `Worker ${workerIds[0]} nudged.`
				: `Nudged ${workerIds.length} team workers.`,
	});
	return dependencies.store.getSnapshot(runId);
}
