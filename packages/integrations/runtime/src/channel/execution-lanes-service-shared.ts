import type {
	CompletionLoopState,
	LaneAuthorityHooks,
	LanePersistenceBundle,
	LaneRuntimeSnapshot,
	LaneRuntimeStore,
	TeamBackendAdapter,
	TeamRunState,
} from '@contractspec/lib.execution-lanes';
import {
	assertLaneAuthority,
	createLanePersistenceBundle,
	syncLaneApprovalState,
	syncLaneRunFromCompletion,
	syncLaneRunFromTeam,
} from '@contractspec/lib.execution-lanes';

export interface ListExecutionLaneRunsInput {
	lane?: string;
	status?: string;
	limit?: number;
}

export interface RequestExecutionLaneApprovalInput {
	role: string;
	verdict?: 'approve' | 'acknowledge';
	actorId?: string;
	comment?: string;
}

export interface EscalateExecutionLaneInput {
	actorId?: string;
	target?: string;
	reason: string;
}

export interface NudgeExecutionLaneInput {
	actorId?: string;
	workerId?: string;
	message: string;
}

export interface ExecutionLaneOperatorServiceOptions {
	hooks?: LaneAuthorityHooks;
	now?: () => Date;
	teamBackends?: Record<string, TeamBackendAdapter>;
	resolveTeamBackend?(team: TeamRunState): TeamBackendAdapter | undefined;
}

export interface ExecutionLaneOperatorDependencies {
	store: LaneRuntimeStore;
	options: ExecutionLaneOperatorServiceOptions;
}

export async function mutateRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	status: string,
	phase: string
) {
	await dependencies.store.updateRun(runId, (current) => ({
		...current,
		status: status as typeof current.status,
		currentPhase: phase,
		updatedAt: now(dependencies),
	}));
}

export function getTeamBackend(
	dependencies: ExecutionLaneOperatorDependencies,
	team: TeamRunState
) {
	if (dependencies.options.resolveTeamBackend) {
		return dependencies.options.resolveTeamBackend(team);
	}
	if (!team.spec.backendKey) {
		return undefined;
	}
	return dependencies.options.teamBackends?.[team.spec.backendKey];
}

export async function applyWorkerLifecycleAction(
	team: TeamRunState,
	backend: TeamBackendAdapter | undefined,
	action: 'pauseWorker' | 'resumeWorker'
) {
	const method = backend?.[action];
	if (!method) {
		return;
	}
	for (const worker of team.workers) {
		await method.call(backend, team.runId, worker.workerId);
	}
}

export async function terminateTeamWorkers(
	dependencies: ExecutionLaneOperatorDependencies,
	team: TeamRunState,
	reason: string | undefined,
	status: TeamRunState['status']
): Promise<TeamRunState> {
	const backend = getTeamBackend(dependencies, team);
	const failures: TeamRunState['cleanup']['failures'] = [];
	for (const worker of team.workers) {
		try {
			await backend?.stopWorker(team.runId, worker.workerId);
			worker.status = 'completed';
			worker.currentTaskId = undefined;
		} catch (error) {
			worker.status = 'failed';
			failures.push({
				workerId: worker.workerId,
				message:
					error instanceof Error
						? error.message
						: 'Unknown worker shutdown failure',
			});
		}
	}
	return {
		...team,
		status,
		cleanup: {
			...team.cleanup,
			status: failures.length === 0 ? 'completed' : 'partial',
			requestedAt: team.cleanup.requestedAt ?? now(dependencies),
			completedAt: now(dependencies),
			reason,
			failures,
		},
		terminalReason: reason,
		updatedAt: now(dependencies),
	};
}

export async function recordOperatorAction(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	action: Parameters<typeof assertLaneAuthority>[1]['action'],
	input: {
		actorId?: string;
		reason?: string;
		metadata?: Record<string, unknown>;
		summary: string;
	}
) {
	const createdAt = now(dependencies);
	await dependencies.store.saveArtifact({
		id: `operator-action-${Date.now()}-${action}`,
		runId,
		artifactType: 'operator_action',
		createdAt,
		body: {
			action,
			actorId: input.actorId,
			reason: input.reason,
			metadata: input.metadata,
		},
		summary: input.summary,
	});
	await dependencies.store.appendEvent({
		id: `event-${Date.now()}-${action}`,
		runId,
		type: `execution.${action}`,
		createdAt,
		message: input.summary,
		metadata: {
			actorId: input.actorId ?? 'local:operator',
			reason: input.reason ?? '',
			...(input.metadata ?? {}),
		},
	});
}

export async function assertAction(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	action: Parameters<typeof assertLaneAuthority>[1]['action'],
	actorId?: string,
	reason?: string,
	metadata?: Record<string, unknown>
) {
	const run = await dependencies.store.getRun(runId);
	await assertLaneAuthority(dependencies.options.hooks, {
		action,
		runId,
		lane: run?.lane,
		actorId,
		reason,
		metadata,
	});
}

export async function requireSnapshot(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string
) {
	const snapshot = await dependencies.store.getSnapshot(runId);
	if (!snapshot) {
		throw new Error(`Execution lane run ${runId} was not found.`);
	}
	return snapshot;
}

export function exportPersistenceBundle(
	snapshot: LaneRuntimeSnapshot
): LanePersistenceBundle {
	return createLanePersistenceBundle(snapshot);
}

export async function syncCompletionState(
	dependencies: ExecutionLaneOperatorDependencies,
	state: CompletionLoopState
) {
	await dependencies.store.saveCompletion(state);
	await syncLaneRunFromCompletion(dependencies.store, state);
}

export async function syncTeamState(
	dependencies: ExecutionLaneOperatorDependencies,
	state: TeamRunState
) {
	await dependencies.store.saveTeam(state);
	await syncLaneRunFromTeam(dependencies.store, state);
}

export async function saveApproval(
	dependencies: ExecutionLaneOperatorDependencies,
	approval: Parameters<LaneRuntimeStore['saveApproval']>[0]
) {
	await dependencies.store.saveApproval(approval);
	await syncLaneApprovalState(dependencies.store, approval);
}

export function now(dependencies: ExecutionLaneOperatorDependencies): string {
	return (dependencies.options.now?.() ?? new Date()).toISOString();
}
