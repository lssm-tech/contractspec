import type {
	AuthorityContextRefs,
	ExecutionScopeClass,
	LaneKey,
	LaneParallelism,
	LanePersistence,
	LaneRunStatus,
	RuntimeContextRefs,
} from './core';
import type { VerificationPolicySource } from './evidence';
import type { ExecutionLaneArtifactIdentifier } from './identifiers';

export interface ExecutionLaneSpec {
	key: LaneKey;
	description: string;
	entryCriteria: string[];
	exitCriteria: string[];
	allowedTransitions: LaneKey[];
	compatibleRoles: string[];
	requiredArtifacts: ExecutionLaneArtifactIdentifier[];
	verificationPolicy: VerificationPolicySource;
	capabilities: {
		parallelism: LaneParallelism;
		persistence: LanePersistence;
		approvals: boolean;
		mailbox: boolean;
		taskLeasing: boolean;
	};
}

export interface ClarificationArtifact {
	meta: {
		id: string;
		createdAt: string;
		sourceRequest: string;
		scopeClass: ExecutionScopeClass;
		ambiguityScore: number;
		recommendedNextLane: LaneKey;
	};
	objective: string;
	constraints: string[];
	assumptions: string[];
	openQuestions: string[];
	conflictSignals: string[];
	authorityContext: AuthorityContextRefs;
}

export interface LaneTransitionRecord {
	id: string;
	runId: string;
	from?: LaneKey;
	to: LaneKey;
	reason: string;
	createdAt: string;
	actorId?: string;
}

export interface LaneRunState {
	runId: string;
	lane: LaneKey;
	objective: string;
	sourceRequest: string;
	scopeClass: ExecutionScopeClass;
	status: LaneRunStatus;
	currentPhase: string;
	ownerRole: string;
	authorityContext: AuthorityContextRefs;
	verificationPolicyKey: string;
	blockingRisks: string[];
	pendingApprovalRoles: string[];
	evidenceBundleIds: string[];
	runtimeContext?: RuntimeContextRefs;
	createdAt: string;
	updatedAt: string;
	terminalReason?: string;
	recommendedNextLane?: LaneKey;
}
