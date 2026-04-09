export type LaneKey =
	| 'clarify'
	| 'plan.consensus'
	| 'complete.persistent'
	| 'team.coordinated';

export interface RoleProfile {
	key: string;
	description: string;
	routingRole: 'leader' | 'specialist' | 'executor' | 'reviewer';
	posture: 'orchestrator' | 'critic' | 'builder' | 'verifier' | 'researcher';
	allowedTools: Array<'read' | 'analyze' | 'execute' | 'network' | 'review'>;
	writeScope: 'none' | 'artifacts-only' | 'workspace' | 'scoped-worktree';
	laneCompatibility: LaneKey[];
	evidenceObligations: string[];
	escalationTriggers: string[];
	modelProfileHint?: string;
}

export interface ExecutionPlanPack {
	meta: {
		id: string;
		createdAt: string;
		sourceRequest: string;
		scopeClass: 'small' | 'medium' | 'large' | 'high-risk';
	};
	objective: string;
	constraints: string[];
	assumptions: string[];
	nonGoals: string[];
	tradeoffs: Array<{
		topic: string;
		tension: string;
		chosenDirection: string;
		rejectedAlternatives: string[];
	}>;
	staffing: {
		availableRoleProfiles: string[];
		recommendedLanes: Array<{ lane: LaneKey; why: string }>;
		handoffRecommendation: { nextLane: LaneKey; launchHints: string[] };
	};
	planSteps: Array<{
		id: string;
		title: string;
		description: string;
		acceptanceCriteria: string[];
		dependencies?: string[];
	}>;
	verification: {
		requiredEvidence: string[];
		requiredApprovals: string[];
		blockingRisks: string[];
	};
	authorityContext: {
		policyRefs: string[];
		ruleContextRefs: string[];
	};
}

export interface CompletionLoopSpec {
	id: string;
	ownerRole: string;
	sourcePlanPackId?: string;
	snapshotRef: string;
	iterationLimit?: number;
	delegateRoles: string[];
	progressLedgerRef: string;
	verificationPolicy: string;
	signoff: {
		verifierRole: string;
		requireArchitectReview: boolean;
		requireHumanApproval?: boolean;
	};
	terminalConditions: Array<'done' | 'blocked' | 'failed' | 'aborted'>;
}

export interface TeamRunSpec {
	id: string;
	sourcePlanPackId?: string;
	objective: string;
	workers: Array<{
		workerId: string;
		roleProfile: string;
		concurrencyClass: 'single' | 'parallel';
		worktreeMode?: 'shared' | 'isolated';
	}>;
	backlog: Array<{
		taskId: string;
		title: string;
		description: string;
		roleHint?: string;
		dependencies?: string[];
	}>;
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
