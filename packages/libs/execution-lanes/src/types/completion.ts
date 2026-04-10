import type {
	EvidenceGateResult,
	VerificationPolicy,
	VerificationPolicySource,
} from './evidence';
import type {
	ExecutionLaneFailureClass,
	ExecutionLaneFailureClassInput,
} from './failures';

export type CompletionLoopPhase =
	| 'initialized'
	| 'working'
	| 'waiting_for_evidence'
	| 'remediating'
	| 'awaiting_signoff'
	| 'completed'
	| 'blocked'
	| 'failed'
	| 'aborted';

export type CompletionFailureClass = ExecutionLaneFailureClass;

export type CompletionFailureClassInput = ExecutionLaneFailureClassInput;

export interface CompletionLoopSpec {
	id: string;
	ownerRole: string;
	sourcePlanPackId?: string;
	snapshotRef: string;
	iterationLimit?: number;
	delegateRoles: string[];
	progressLedgerRef: string;
	verificationPolicy: VerificationPolicySource;
	signoff: {
		verifierRole: string;
		requireArchitectReview: boolean;
		requireHumanApproval?: boolean;
	};
	terminalConditions: Array<'done' | 'blocked' | 'failed' | 'aborted'>;
}

export interface CompletionLedgerEntry {
	id: string;
	iteration: number;
	createdAt: string;
	message: string;
	classification?: CompletionFailureClass;
	metadata?: Record<string, unknown>;
}

export interface CompletionLoopState {
	runId: string;
	spec: Omit<CompletionLoopSpec, 'verificationPolicy'> & {
		verificationPolicy: VerificationPolicy;
	};
	phase: CompletionLoopPhase;
	iteration: number;
	retryCount: number;
	progressLedger: CompletionLedgerEntry[];
	evidenceBundleIds: string[];
	pendingApprovalRoles: string[];
	contextSnapshotArtifactId?: string;
	progressLedgerArtifactId?: string;
	loopStateArtifactId?: string;
	signoffArtifactId?: string;
	terminalRecordArtifactId?: string;
	lastGateResult?: EvidenceGateResult;
	lastFailureClass?: CompletionFailureClass;
	createdAt: string;
	updatedAt: string;
}

export interface CompletionRecord {
	runId: string;
	status: Extract<
		CompletionLoopPhase,
		'completed' | 'blocked' | 'failed' | 'aborted'
	>;
	completedAt: string;
	iterationCount: number;
	evidenceBundleIds: string[];
	approvalIds: string[];
	unresolvedRisks: string[];
	terminalReason?: string;
}
