import type {
	RoleProfile,
	RoleWriteScope,
	TeamRunSpec,
	TeamWorkerLaunchSpec,
	TeamWorkerSpec,
} from '../../types';

const WRITING_SCOPES: RoleWriteScope[] = ['workspace', 'scoped-worktree'];

export function assertValidTeamWorkerScopes(
	spec: TeamRunSpec,
	resolveRole: (roleKey: string) => RoleProfile
) {
	for (const worker of spec.workers) {
		const profile = resolveRole(worker.roleProfile);
		if (
			profile.writeScope === 'scoped-worktree' &&
			worker.worktreeMode !== 'isolated'
		) {
			throw new Error(
				`Worker "${worker.workerId}" requires isolated worktree mode for scoped-worktree writes.`
			);
		}
	}
	for (const task of spec.backlog) {
		if (!task.writePaths || task.writePaths.length === 0) {
			continue;
		}
		if (!task.roleHint) {
			throw new Error(
				`Task "${task.taskId}" declares write paths and must declare a roleHint.`
			);
		}
		const profile = resolveRole(task.roleHint);
		if (!WRITING_SCOPES.includes(profile.writeScope)) {
			throw new Error(
				`Role "${task.roleHint}" cannot own write paths for task "${task.taskId}".`
			);
		}
	}
}

export function createTeamWorkerLaunchSpec(
	runId: string,
	spec: TeamRunSpec,
	worker: TeamWorkerSpec,
	profile: RoleProfile
): TeamWorkerLaunchSpec {
	const writePaths = Array.from(
		new Set(
			spec.backlog
				.filter(
					(task) =>
						task.roleHint === worker.roleProfile &&
						task.writePaths &&
						task.writePaths.length > 0
				)
				.flatMap((task) => task.writePaths ?? [])
		)
	);

	return {
		runId,
		workerId: worker.workerId,
		roleKey: worker.roleProfile,
		writeScope: profile.writeScope,
		worktreeMode: worker.worktreeMode,
		writePaths: writePaths.length > 0 ? writePaths : undefined,
	};
}
