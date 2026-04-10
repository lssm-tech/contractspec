export type LaneKey =
	| 'clarify'
	| 'plan.consensus'
	| 'complete.persistent'
	| 'team.coordinated';

export type ExecutionScopeClass = 'small' | 'medium' | 'large' | 'high-risk';

export type LaneParallelism = 'none' | 'bounded' | 'durable';

export type LanePersistence = 'ephemeral' | 'checkpointed' | 'durable';

export type LaneRunStatus =
	| 'initialized'
	| 'running'
	| 'waiting'
	| 'paused'
	| 'completed'
	| 'blocked'
	| 'failed'
	| 'aborted'
	| 'superseded';

export type LaneTerminalStatus = Extract<
	LaneRunStatus,
	'completed' | 'blocked' | 'failed' | 'aborted' | 'superseded'
>;

export type ApprovalVerdict = 'approve' | 'acknowledge';

export interface AuthorityContextRefs {
	policyRefs: string[];
	ruleContextRefs: string[];
	approvalRefs?: string[];
}

export interface RuntimeContextRefs {
	sessionId?: string;
	traceId?: string;
	workflowId?: string;
	checkpointId?: string;
	snapshotRef?: string;
}
