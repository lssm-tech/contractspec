import type {
	ComparisonMode,
	ExecutionTaskType,
	MobileSupportStatus,
	PatchProposalStatus,
	RiskLevel,
	RuntimeMode,
} from '@contractspec/lib.provider-spec';
import type {
	ApprovalStrength,
	BuilderChannelType,
	BuilderSourceType,
} from './enums';

export interface BuilderBlockingIssue {
	code: string;
	message: string;
	runtimeModes?: RuntimeMode[];
	channelTypes?: BuilderChannelType[];
	evidenceRefs?: string[];
}

export interface BuilderReadinessWarning {
	code: string;
	message: string;
	runtimeModes?: RuntimeMode[];
	channelTypes?: BuilderChannelType[];
	evidenceRefs?: string[];
}

export interface BuilderRequiredApproval {
	ticketId: string;
	reason: string;
	requiredStrength: ApprovalStrength;
}

export interface BuilderProviderSummary {
	runs: number;
	verifiedRuns: number;
	comparisonRuns: number;
	activeProviderIds: string[];
}

export interface BuilderRuntimeSummary {
	selectedDefault: RuntimeMode;
	registeredTargets: string[];
	healthyTargetIds: string[];
	lastIncident?: string;
}

export interface BuilderFeatureParity {
	featureKey: string;
	label: string;
	mobileSupport: MobileSupportStatus;
	channelSupport: BuilderChannelType[];
	mobileFallbackRef?: string;
	approvalStrengthRequired: ApprovalStrength;
	evidenceShape:
		| 'summary_only'
		| 'diff_with_provenance'
		| 'receipt_with_harness';
	statusNote?: string;
}

export interface BuilderRuntimeProfile {
	id: string;
	label: string;
	runtimeMode: RuntimeMode;
	targetRef?: string;
	status: 'candidate' | 'approved' | 'blocked';
	notes?: string;
}

export interface BuilderDecisionRecord {
	id: string;
	workspaceId: string;
	decisionType: 'accepted' | 'rejected' | 'unresolved';
	statement: string;
	status: 'accepted' | 'rejected' | 'unresolved';
	sourceRefs: string[];
	approvalTicketId?: string;
	supersedesDecisionId?: string;
	confidence: number;
	recordedAt: string;
}

export interface BuilderInferenceNote {
	id: string;
	workspaceId: string;
	statement: string;
	sourceRefs: string[];
	confidence: number;
	requiresConfirmation: boolean;
	recordedAt: string;
}

export interface BuilderDecisionLedger {
	decisions: BuilderDecisionRecord[];
	inferences: BuilderInferenceNote[];
}

export interface BuilderSourceTimelineEntry {
	id: string;
	workspaceId: string;
	sourceId: string;
	sourceType: BuilderSourceType;
	channelType?: BuilderChannelType;
	label: string;
	state:
		| 'explicit'
		| 'approved'
		| 'inferred'
		| 'proposed_by_provider'
		| 'conflicted'
		| 'stale';
	recordedAt: string;
}

export interface BuilderProviderProposalRegisterEntry {
	id: string;
	workspaceId: string;
	proposalId: string;
	providerId: string;
	status: PatchProposalStatus;
	changedAreas: string[];
	receiptId: string;
	recordedAt: string;
}

export interface BuilderMobileReviewCard {
	id: string;
	workspaceId: string;
	channelType: BuilderChannelType;
	subjectType:
		| 'patch_proposal'
		| 'comparison_run'
		| 'runtime_incident'
		| 'approval_ticket';
	subjectId: string;
	summary: string;
	riskLevel: RiskLevel;
	provider?: {
		id: string;
		runId?: string;
	};
	affectedAreas: string[];
	evidence: {
		sourceRefs: string[];
		receiptId?: string;
		harnessSummary: string;
	};
	actions: Array<{
		id: string;
		label: string;
		deepLinkHref?: string;
	}>;
	createdAt: string;
	updatedAt: string;
}

export interface BuilderProviderActivity {
	id: string;
	workspaceId: string;
	taskType: ExecutionTaskType;
	comparisonMode?: ComparisonMode;
	status: 'queued' | 'running' | 'completed' | 'failed';
	receiptId?: string;
	providerId?: string;
	reason?: string;
	recommendedAction?: 'retry' | 'fallback_or_escalate' | 'escalate' | 'block';
	fallbackProviderIds?: string[];
	recordedAt: string;
}
