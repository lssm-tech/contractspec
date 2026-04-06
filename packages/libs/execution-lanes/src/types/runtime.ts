import type { CompletionLoopState } from './completion';
import type { LaneKey, LaneRunStatus } from './core';
import type {
	ApprovalRecord,
	EvidenceBundleRef,
	LaneArtifactRecord,
	LaneEventRecord,
	TerminalReadiness,
} from './evidence';
import type { LaneRunState, LaneTransitionRecord } from './lanes';
import type {
	TeamCleanupStatus,
	TeamHeartbeatRecord,
	TeamLeaseRecord,
	TeamMailboxMessage,
	TeamRunState,
	TeamTaskRecord,
	TeamWorkerState,
} from './team';

export interface LaneRuntimeSnapshot {
	run: LaneRunState;
	events: LaneEventRecord[];
	transitions: LaneTransitionRecord[];
	artifacts: LaneArtifactRecord[];
	evidence: EvidenceBundleRef[];
	approvals: ApprovalRecord[];
	completion?: CompletionLoopState;
	team?: TeamRunState;
}

export interface LanePersistenceBundle {
	exportedAt: string;
	run: LaneRunState;
	state: {
		completion?: CompletionLoopState;
		team?: TeamRunState;
	};
	events: LaneEventRecord[];
	transitions: LaneTransitionRecord[];
	artifacts: LaneArtifactRecord[];
	evidence: EvidenceBundleRef[];
	approvals: ApprovalRecord[];
}

export interface TeamPersistenceStateSlice {
	runId: TeamRunState['runId'];
	spec: TeamRunState['spec'];
	status: TeamRunState['status'];
	cleanup: TeamRunState['cleanup'];
	evidenceBundleIds: TeamRunState['evidenceBundleIds'];
	createdAt: TeamRunState['createdAt'];
	updatedAt: TeamRunState['updatedAt'];
	terminalReason?: TeamRunState['terminalReason'];
	terminalStateArtifactId?: TeamRunState['terminalStateArtifactId'];
}

export interface LanePersistenceStateFile {
	completion?: CompletionLoopState;
	team?: TeamPersistenceStateSlice;
}

export interface TeamTaskLeaseFileRecord {
	taskId: TeamTaskRecord['taskId'];
	lease: TeamLeaseRecord;
}

export type TeamTaskFileRecord = Omit<TeamTaskRecord, 'lease'>;

export interface LanePersistenceFiles {
	'laneRun.json': string;
	'state.json': string;
	'events.ndjson': string;
	'artifacts.json': string;
	'evidence.json': string;
	'approvals.json': string;
	'transitions.json': string;
	'workers.json'?: string;
	'tasks.json'?: string;
	'leases.json'?: string;
	'mailbox.ndjson'?: string;
	'heartbeats.ndjson'?: string;
	'terminal-state.json'?: string;
}

export interface LanePersistenceHydrationPayload {
	run: LaneRunState;
	state: LanePersistenceStateFile;
	events: LaneEventRecord[];
	transitions: LaneTransitionRecord[];
	artifacts: LaneArtifactRecord[];
	evidence: EvidenceBundleRef[];
	approvals: ApprovalRecord[];
	workers: TeamWorkerState[];
	tasks: TeamTaskFileRecord[];
	leases: TeamTaskLeaseFileRecord[];
	mailbox: TeamMailboxMessage[];
	heartbeats: TeamHeartbeatRecord[];
	terminalState: unknown;
}

export interface LaneStatusView {
	runId: string;
	lane: LaneKey;
	objective: string;
	status: LaneRunStatus;
	currentPhase: string;
	ownerRole: string;
	evidenceCompleteness: number;
	missingArtifacts: string[];
	pendingApprovals: string[];
	missingEvidence: string[];
	missingApprovals: string[];
	blockingRisks: string[];
	terminalReadiness: TerminalReadiness;
	recommendedNextLane?: LaneKey;
	updatedAt: string;
}

export interface TeamStatusView {
	runId: string;
	status: TeamRunState['status'];
	totalTasks: number;
	completedTasks: number;
	activeWorkers: number;
	staleWorkers: number;
	staleLeaseCount: number;
	staleWorkerIds: string[];
	pendingEvidence: number;
	queueSkew: number;
	verificationReady: boolean;
	cleanupStatus: TeamCleanupStatus;
	updatedAt: string;
}

export interface CompletionStatusView {
	runId: string;
	phase: CompletionLoopState['phase'];
	iteration: number;
	retryCount: number;
	snapshotRef: string;
	pendingApprovals: string[];
	evidenceBundles: number;
	lastFailureClass?: CompletionLoopState['lastFailureClass'];
	missingEvidence: string[];
	terminalReadiness: TerminalReadiness;
	updatedAt: string;
}
