import type {
	TeamCompletionSnapshot,
	TeamRunState,
	TeamTaskStatus,
} from '../../types';

const TERMINAL_TASK_STATUSES: TeamTaskStatus[] = [
	'completed',
	'failed',
	'blocked',
	'cancelled',
];

export function canFinalizeTeamRun(state: TeamRunState): boolean {
	if (!state.spec.shutdownPolicy.requireTerminalTasks) {
		return true;
	}
	return state.tasks.every((task) =>
		TERMINAL_TASK_STATUSES.includes(task.status)
	);
}

export function hasRequiredTeamEvidence(state: TeamRunState): boolean {
	if (!state.spec.shutdownPolicy.requireEvidenceGate) {
		return true;
	}
	if (state.spec.verificationLane.required) {
		return state.evidenceBundleIds.length > 0;
	}
	return (
		state.evidenceBundleIds.length > 0 ||
		state.tasks.some((task) => task.evidenceBundleIds.length > 0)
	);
}

export function createTeamCompletionSnapshot(
	state: TeamRunState,
	followupRecommendation?: string
): TeamCompletionSnapshot {
	return {
		runId: state.runId,
		status: followupRecommendation
			? 'completed_with_followup_recommended'
			: 'completed',
		completedAt: new Date().toISOString(),
		evidenceBundleIds: state.evidenceBundleIds,
		cleanupStatus: state.cleanup.status,
		taskStatuses: state.tasks.map((task) => ({
			taskId: task.taskId,
			status: task.status,
		})),
		followupRecommendation,
	};
}
