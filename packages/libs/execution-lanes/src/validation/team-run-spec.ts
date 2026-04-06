import type { TeamRunSpec } from '../types';
import {
	assertValid,
	type ExecutionLanesValidationIssue,
	pushIssue,
} from './issues';

export function validateTeamRunSpec(
	spec: TeamRunSpec
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!spec.id.trim()) {
		pushIssue(issues, 'id', 'Team run id is required.');
	}
	if (!spec.objective.trim()) {
		pushIssue(issues, 'objective', 'Team run objective is required.');
	}
	if (spec.workers.length === 0) {
		pushIssue(issues, 'workers', 'Team run requires at least one worker.');
	}
	const workerIds = new Set<string>();
	for (const worker of spec.workers) {
		if (!worker.workerId.trim()) {
			pushIssue(issues, 'workers[].workerId', 'Worker id is required.');
		}
		if (workerIds.has(worker.workerId)) {
			pushIssue(
				issues,
				`workers.${worker.workerId}`,
				'Worker ids must be unique.'
			);
		}
		workerIds.add(worker.workerId);
		if (!worker.roleProfile.trim()) {
			pushIssue(
				issues,
				`workers.${worker.workerId}.roleProfile`,
				'Worker role profile is required.'
			);
		}
	}
	const taskIds = new Set(spec.backlog.map((task) => task.taskId));
	const availableRoles = new Set(
		spec.workers.map((worker) => worker.roleProfile)
	);
	for (const task of spec.backlog) {
		if (!task.taskId.trim()) {
			pushIssue(issues, 'backlog[].taskId', 'Task id is required.');
		}
		if (!task.title.trim()) {
			pushIssue(
				issues,
				`backlog.${task.taskId}.title`,
				'Task title is required.'
			);
		}
		if (task.roleHint && !availableRoles.has(task.roleHint)) {
			pushIssue(
				issues,
				`backlog.${task.taskId}.roleHint`,
				`No worker is available for role "${task.roleHint}".`
			);
		}
		for (const dependency of task.dependencies ?? []) {
			if (!taskIds.has(dependency)) {
				pushIssue(
					issues,
					`backlog.${task.taskId}.dependencies`,
					`Unknown dependency "${dependency}".`
				);
			}
		}
		if (
			task.writePaths &&
			task.writePaths.some((writePath) => !writePath.trim())
		) {
			pushIssue(
				issues,
				`backlog.${task.taskId}.writePaths`,
				'Write paths must be non-empty strings.'
			);
		}
	}
	if (
		spec.verificationLane.required &&
		!spec.verificationLane.ownerRole.trim()
	) {
		pushIssue(
			issues,
			'verificationLane.ownerRole',
			'Verification lane owner role is required.'
		);
	}
	return issues;
}

export function assertValidTeamRunSpec(spec: TeamRunSpec): TeamRunSpec {
	assertValid(validateTeamRunSpec(spec), `Invalid team run "${spec.id}"`);
	return spec;
}
