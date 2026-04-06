import type {
	ApprovalRecord,
	CompletionLoopState,
	LaneRunStatus,
	TeamRunState,
} from '../types';
import type { LaneRuntimeStore } from './store';

export async function syncLaneRunFromCompletion(
	store: LaneRuntimeStore,
	state: CompletionLoopState,
	terminalReason?: string
) {
	const run = await store.getRun(state.runId);
	if (!run) {
		return undefined;
	}
	return store.updateRun(state.runId, (current) => ({
		...current,
		status: mapCompletionPhaseToLaneStatus(state.phase),
		currentPhase: state.phase,
		pendingApprovalRoles: [...state.pendingApprovalRoles],
		evidenceBundleIds: [...state.evidenceBundleIds],
		blockingRisks: state.lastGateResult?.blockingRisks ?? current.blockingRisks,
		terminalReason: terminalReason ?? current.terminalReason,
		updatedAt: state.updatedAt,
	}));
}

export async function syncLaneRunFromTeam(
	store: LaneRuntimeStore,
	state: TeamRunState
) {
	const run = await store.getRun(state.runId);
	if (!run) {
		return undefined;
	}
	return store.updateRun(state.runId, (current) => ({
		...current,
		status: mapTeamStatusToLaneStatus(state.status),
		currentPhase:
			state.cleanup.status === 'in_progress' ? 'shutdown' : state.status,
		evidenceBundleIds: [...state.evidenceBundleIds],
		recommendedNextLane:
			state.status === 'completed_with_followup_recommended'
				? 'complete.persistent'
				: current.recommendedNextLane,
		terminalReason: state.terminalReason ?? current.terminalReason,
		updatedAt: state.updatedAt,
	}));
}

export async function syncLaneApprovalState(
	store: LaneRuntimeStore,
	approval: ApprovalRecord
) {
	const run = await store.getRun(approval.runId);
	if (!run) {
		return undefined;
	}
	return store.updateRun(approval.runId, (current) => {
		const pendingApprovalRoles =
			approval.state === 'requested'
				? Array.from(new Set([...current.pendingApprovalRoles, approval.role]))
				: current.pendingApprovalRoles.filter((role) => role !== approval.role);
		return {
			...current,
			pendingApprovalRoles,
			updatedAt: approval.decidedAt ?? approval.requestedAt,
		};
	});
}

function mapCompletionPhaseToLaneStatus(
	phase: CompletionLoopState['phase']
): LaneRunStatus {
	switch (phase) {
		case 'initialized':
			return 'initialized';
		case 'working':
		case 'remediating':
			return 'running';
		case 'waiting_for_evidence':
		case 'awaiting_signoff':
			return 'waiting';
		case 'completed':
			return 'completed';
		case 'blocked':
			return 'blocked';
		case 'failed':
			return 'failed';
		case 'aborted':
			return 'aborted';
	}
}

function mapTeamStatusToLaneStatus(
	status: TeamRunState['status']
): LaneRunStatus {
	switch (status) {
		case 'initialized':
			return 'initialized';
		case 'running':
			return 'running';
		case 'paused':
			return 'paused';
		case 'completed':
		case 'completed_with_followup_recommended':
			return 'completed';
		case 'blocked':
			return 'blocked';
		case 'failed':
			return 'failed';
		case 'aborted':
			return 'aborted';
	}
}
