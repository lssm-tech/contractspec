import type { TeamBackendAdapter } from '../../adapters/types';
import { DEFAULT_ROLE_PROFILES } from '../../defaults';
import { RoleProfileRegistry } from '../../registry/role-profile-registry';
import {
	assertLaneAuthority,
	type LaneAuthorityAction,
	type LaneAuthorityHooks,
} from '../../runtime/authority-hooks';
import { createRoleGuard } from '../../runtime/role-guard';
import { syncLaneRunFromTeam } from '../../runtime/state-sync';
import type { LaneRuntimeStore } from '../../runtime/store';
import type {
	TeamRunState,
	TeamTaskRecord,
	TeamWorkerState,
} from '../../types';

export interface TeamRunDependencies {
	store: LaneRuntimeStore;
	adapter: TeamBackendAdapter;
	hooks?: LaneAuthorityHooks;
	roleGuard: ReturnType<typeof createRoleGuard>;
	heartbeatStaleMs: number;
}

export async function assertTeamAuthority(
	dependencies: TeamRunDependencies,
	action: LaneAuthorityAction,
	runId: string,
	actorId?: string,
	input?: { reason?: string; metadata?: Record<string, unknown> }
) {
	await assertLaneAuthority(dependencies.hooks, {
		action,
		runId,
		lane: 'team.coordinated',
		actorId,
		reason: input?.reason,
		metadata: input?.metadata,
	});
}

export async function requireTeamState(store: LaneRuntimeStore, runId: string) {
	const state = await store.getTeam(runId);
	if (!state) {
		throw new Error(`Team run not found: ${runId}`);
	}
	return state;
}

export async function persistTeamState(
	store: LaneRuntimeStore,
	state: TeamRunState
) {
	state.updatedAt = new Date().toISOString();
	await store.saveTeam(state);
	await syncLaneRunFromTeam(store, state);
}

export function releaseWorker(
	state: TeamRunState,
	workerId?: string,
	status: TeamWorkerState['status'] = 'idle'
) {
	if (!workerId) {
		return;
	}
	const worker = state.workers.find((entry) => entry.workerId === workerId);
	if (worker) {
		worker.status = status;
		worker.currentTaskId = undefined;
	}
}

export function requireTask(
	state: TeamRunState,
	taskId: string
): TeamTaskRecord {
	const task = state.tasks.find((entry) => entry.taskId === taskId);
	if (!task) {
		throw new Error(`Task not found: ${taskId}`);
	}
	return task;
}

export function assertTeamWorkerRole(
	roleGuard: ReturnType<typeof createRoleGuard>,
	roleKey: string
) {
	const profile = roleGuard.get(roleKey);
	roleGuard.assert({
		roleKey,
		lane: 'team.coordinated',
		requiredTools:
			profile.routingRole === 'executor' || profile.posture === 'builder'
				? ['execute']
				: profile.key === 'planner'
					? ['read', 'analyze', 'review']
					: ['review'],
	});
}

export function createDefaultRoleRegistry() {
	const registry = new RoleProfileRegistry();
	for (const profile of DEFAULT_ROLE_PROFILES) {
		registry.register(profile);
	}
	return registry;
}
