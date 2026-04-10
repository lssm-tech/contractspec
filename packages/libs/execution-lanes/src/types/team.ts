import type { RoleWriteScope } from './roles';

export type TeamTaskStatus =
	| 'pending'
	| 'ready'
	| 'leased'
	| 'running'
	| 'blocked'
	| 'completed'
	| 'failed'
	| 'cancelled';

export type TeamWorkerStatus =
	| 'idle'
	| 'running'
	| 'paused'
	| 'offline'
	| 'failed'
	| 'completed';

export type TeamCleanupStatus =
	| 'not_requested'
	| 'in_progress'
	| 'completed'
	| 'partial'
	| 'failed';

export interface TeamWorkerSpec {
	workerId: string;
	roleProfile: string;
	concurrencyClass: 'single' | 'parallel';
	worktreeMode?: 'shared' | 'isolated';
}

export interface TeamBacklogTaskSpec {
	taskId: string;
	title: string;
	description: string;
	roleHint?: string;
	dependencies?: string[];
	writePaths?: string[];
}

export interface TeamWorkerLaunchSpec {
	runId: string;
	workerId: string;
	roleKey: string;
	writeScope: RoleWriteScope;
	worktreeMode?: TeamWorkerSpec['worktreeMode'];
	writePaths?: string[];
}

export interface TeamRunSpec {
	id: string;
	sourcePlanPackId?: string;
	objective: string;
	backendKey?: string;
	workers: TeamWorkerSpec[];
	backlog: TeamBacklogTaskSpec[];
	coordination: {
		mailbox: boolean;
		taskLeasing: boolean;
		heartbeats: boolean;
		rebalancing: boolean;
	};
	verificationLane: {
		required: boolean;
		ownerRole: string;
	};
	shutdownPolicy: {
		requireTerminalTasks: boolean;
		requireEvidenceGate: boolean;
	};
}

export interface TeamLeaseRecord {
	workerId: string;
	leasedAt: string;
	expiresAt: string;
	renewCount: number;
}

export interface TeamHeartbeatRecord {
	id: string;
	workerId: string;
	createdAt: string;
	currentTaskId?: string;
	health: 'healthy' | 'stale' | 'offline' | 'failed';
	progressSummary?: string;
}

export interface TeamTaskRecord {
	taskId: string;
	title: string;
	description: string;
	roleHint?: string;
	dependencies: string[];
	writePaths?: string[];
	status: TeamTaskStatus;
	claimedBy?: string;
	evidenceBundleIds: string[];
	retryHistory: string[];
	lease?: TeamLeaseRecord;
}

export interface TeamWorkerState {
	workerId: string;
	roleProfile: string;
	status: TeamWorkerStatus;
	currentTaskId?: string;
	lastHeartbeatAt?: string;
	progressSummary?: string;
}

export interface TeamMailboxMessage {
	id: string;
	from: string;
	to: string;
	scope: 'leader-worker' | 'worker-leader' | 'worker-worker' | 'system';
	createdAt: string;
	body: string;
}

export interface TeamCleanupState {
	status: TeamCleanupStatus;
	requestedAt?: string;
	completedAt?: string;
	reason?: string;
	failures: Array<{
		workerId: string;
		message: string;
	}>;
}

export interface TeamRunState {
	runId: string;
	spec: TeamRunSpec;
	status:
		| 'initialized'
		| 'running'
		| 'paused'
		| 'completed'
		| 'completed_with_followup_recommended'
		| 'blocked'
		| 'failed'
		| 'aborted';
	tasks: TeamTaskRecord[];
	workers: TeamWorkerState[];
	mailbox: TeamMailboxMessage[];
	heartbeatLog: TeamHeartbeatRecord[];
	cleanup: TeamCleanupState;
	evidenceBundleIds: string[];
	createdAt: string;
	updatedAt: string;
	terminalReason?: string;
	terminalStateArtifactId?: string;
}

export interface TeamCompletionSnapshot {
	runId: string;
	status: TeamRunState['status'];
	completedAt: string;
	evidenceBundleIds: string[];
	cleanupStatus: TeamCleanupStatus;
	taskStatuses: Array<{ taskId: string; status: TeamTaskStatus }>;
	followupRecommendation?: string;
}
