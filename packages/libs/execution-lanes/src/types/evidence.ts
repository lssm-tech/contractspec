import type { ApprovalVerdict } from './core';
import type {
	ExecutionLaneArtifactIdentifier,
	ExecutionLaneEvidenceIdentifier,
} from './identifiers';

export interface EvidenceBundleRef {
	id: string;
	runId: string;
	artifactIds: string[];
	classes: ExecutionLaneEvidenceIdentifier[];
	createdAt: string;
	freshUntil?: string;
	replayBundleUri?: string;
	summary?: string;
	metadata?: Record<string, unknown>;
}

export interface ApprovalRequirement {
	role: string;
	verdict: ApprovalVerdict;
}

export interface VerificationPolicy {
	key: string;
	requiredEvidence: ExecutionLaneEvidenceIdentifier[];
	minimumApprovals: ApprovalRequirement[];
	failOnMissingEvidence: boolean;
	allowConditionalCompletion: boolean;
	maxEvidenceAgeMinutes?: number;
}

export type VerificationPolicySource = string | VerificationPolicy;

export type ApprovalState =
	| 'requested'
	| 'approved'
	| 'rejected'
	| 'expired'
	| 'superseded';

export type TerminalReadiness =
	| 'ready'
	| 'missing_artifact'
	| 'missing_evidence'
	| 'missing_approval'
	| 'stale_evidence'
	| 'blocked'
	| 'cleanup_pending'
	| 'not_ready';

export interface ApprovalRecord {
	id: string;
	runId: string;
	role: string;
	verdict: ApprovalVerdict;
	state: ApprovalState;
	comment?: string;
	requestedAt: string;
	decidedAt?: string;
	decidedBy?: string;
}

export interface LaneArtifactRecord {
	id: string;
	runId: string;
	artifactType: ExecutionLaneArtifactIdentifier;
	createdAt: string;
	body: unknown;
	summary?: string;
}

export interface LaneEventRecord {
	id: string;
	runId: string;
	type: string;
	createdAt: string;
	phase?: string;
	message?: string;
	metadata?: Record<string, unknown>;
}

export interface EvidenceGateResult {
	passed: boolean;
	conditionallyPassed?: boolean;
	missingEvidence: string[];
	missingApprovals: string[];
	staleEvidence: string[];
	blockingRisks: string[];
}
