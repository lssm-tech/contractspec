import type {
	EvidenceBundleRef,
	ExecutionPlanPack,
	LaneKey,
} from '@contractspec/lib.execution-lanes';
import type {
	ExecutionComparisonRun,
	ExternalExecutionContextBundle,
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	MobileSupportStatus,
	ProviderRoutingPolicy,
	ProviderSelection,
	RuntimeMode,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';
import type {
	BuilderBlockingIssue,
	BuilderFeatureParity,
	BuilderMobileReviewCard,
	BuilderProviderActivity,
	BuilderProviderProposalRegisterEntry,
	BuilderProviderSummary,
	BuilderReadinessWarning,
	BuilderRequiredApproval,
	BuilderRuntimeProfile,
	BuilderRuntimeSummary,
	BuilderSourceTimelineEntry,
} from '../control-plane';
import type {
	ApprovalStrength,
	BuilderApprovalRequestChannel,
	BuilderApprovalStatus,
	BuilderChannelType,
	BuilderExportTargetType,
	BuilderLaneType,
	BuilderPreviewBuildStatus,
	BuilderPreviewDataMode,
	BuilderReadinessStatus,
} from '../enums';
import type {
	BuilderAssumption,
	BuilderConflict,
	BuilderCoverageReport,
	BuilderDecisionReceipt,
} from './fusion';
import type {
	BuilderChannelMessage,
	BuilderDirectiveCandidate,
	BuilderTranscriptSegment,
	EvidenceReference,
	ExtractedAssetPart,
	RawAsset,
} from './source';
import type {
	BuilderConversation,
	BuilderParticipantBinding,
	BuilderWorkspace,
} from './workspace';

export interface BuilderBlueprint {
	id: string;
	workspaceId: string;
	appBrief: string;
	personas: Array<{ id: string; name: string; goals: string[] }>;
	domainObjects: Array<{ id: string; name: string; fields: string[] }>;
	workflows: Array<{ id: string; name: string; steps: string[] }>;
	surfaces: Array<{ id: string; name: string; summary: string }>;
	integrations: Array<{ provider: string; mode: BuilderPreviewDataMode }>;
	policies: string[];
	runtimeProfiles: BuilderRuntimeProfile[];
	channelSurfaces: Array<{
		channel: BuilderChannelType;
		purpose: 'builder_control' | 'generated_app_candidate';
		enabled: boolean;
	}>;
	featureParity: BuilderFeatureParity[];
	assumptions: BuilderAssumption[];
	openQuestions: string[];
	coverageReport: BuilderCoverageReport;
	version: number;
	lockedFieldPaths: string[];
	createdAt: string;
	updatedAt: string;
}

export interface BuilderPlan {
	id: string;
	workspaceId: string;
	laneType: BuilderLaneType;
	executionLaneKey?: LaneKey;
	runtimeMode: RuntimeMode;
	steps: string[];
	providerSelections: ProviderSelection[];
	policyVerdicts: string[];
	openQuestions: string[];
	blockingIssues: BuilderBlockingIssue[];
	nextPermittedActions: string[];
	requiresApproval: boolean;
	traceId: string;
	executionPlanPack?: ExecutionPlanPack;
	status:
		| 'draft'
		| 'approved'
		| 'running'
		| 'paused'
		| 'cancelled'
		| 'completed';
	createdAt: string;
	updatedAt: string;
}

export interface BuilderApprovalTicket {
	id: string;
	workspaceId: string;
	conversationId?: string;
	reason: string;
	riskLevel: import('@contractspec/lib.provider-spec').RiskLevel;
	requestedVia: BuilderApprovalRequestChannel;
	requiredStrength: ApprovalStrength;
	status: BuilderApprovalStatus;
	approvedBy?: string;
	approvedAt?: string;
	expiresAt?: string;
	resolutionChannelType?: BuilderChannelType;
	requiresTwoStepConfirmation?: boolean;
	decisionReceiptId?: string;
}

export interface BuilderPreview {
	id: string;
	workspaceId: string;
	previewUrl?: string;
	generatedWorkspaceRef: string;
	dataMode: BuilderPreviewDataMode;
	runtimeMode: RuntimeMode;
	runtimeTargetId?: string;
	buildStatus: BuilderPreviewBuildStatus;
	readinessSummary: string;
	providerActivitySummary?: string;
	diffSummary?: string;
	comparisonRunIds: string[];
	mobileReviewCardIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface BuilderReadinessReport {
	id: string;
	workspaceId: string;
	overallStatus: BuilderReadinessStatus;
	score: number;
	supportedRuntimeModes: RuntimeMode[];
	managedReady: boolean;
	localReady: boolean;
	hybridReady: boolean;
	mobileParityStatus: MobileSupportStatus;
	blockingIssues: BuilderBlockingIssue[];
	warnings: BuilderReadinessWarning[];
	sourceCoverage: BuilderCoverageReport;
	policySummary: string[];
	channelSummary: Array<{
		channel: BuilderChannelType;
		ready: boolean;
		blockers: string[];
	}>;
	providerSummary: BuilderProviderSummary;
	runtimeSummary: BuilderRuntimeSummary;
	requiredApprovals: BuilderRequiredApproval[];
	harnessRunRefs: EvidenceBundleRef[];
	evidenceBundleRef: EvidenceBundleRef;
	recommendedNextAction: string;
	assumptionsSummary?: string;
}

export interface BuilderExportBundle {
	id: string;
	workspaceId: string;
	targetType: BuilderExportTargetType;
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	artifactRefs: string[];
	verificationRef: string;
	receiptIds: string[];
	auditPackageRefs: string[];
	approvedAt?: string;
	exportedAt?: string;
}

export interface BuilderStableMemoryState {
	approvedDecisionIds: string[];
	lockedFieldPaths: string[];
	approvedSnapshotSourceIds: string[];
	exportBundleIds: string[];
}

export interface BuilderWorkingMemoryState {
	messageIds: string[];
	directiveIds: string[];
	assumptionIds: string[];
	conflictIds: string[];
	pendingApprovalIds: string[];
}

export interface BuilderWorkspaceSnapshot {
	workspace: BuilderWorkspace;
	participantBindings: BuilderParticipantBinding[];
	conversations: BuilderConversation[];
	sources: import('./source').BuilderSourceRecord[];
	rawAssets: RawAsset[];
	extractedParts: ExtractedAssetPart[];
	evidenceReferences: EvidenceReference[];
	messages: BuilderChannelMessage[];
	transcripts: BuilderTranscriptSegment[];
	directives: BuilderDirectiveCandidate[];
	assumptions: BuilderAssumption[];
	conflicts: BuilderConflict[];
	decisionReceipts: BuilderDecisionReceipt[];
	fusionGraphEdges: import('./fusion').BuilderFusionGraphEdge[];
	blueprint?: BuilderBlueprint | null;
	plan?: BuilderPlan | null;
	approvalTickets: BuilderApprovalTicket[];
	preview?: BuilderPreview | null;
	readinessReport?: BuilderReadinessReport | null;
	exportBundle?: BuilderExportBundle | null;
	runtimeTargets: RuntimeTarget[];
	externalProviders: ExternalExecutionProvider[];
	routingPolicy?: ProviderRoutingPolicy | null;
	executionContextBundles: ExternalExecutionContextBundle[];
	executionReceipts: ExternalExecutionReceipt[];
	patchProposals: ExternalPatchProposal[];
	comparisonRuns: ExecutionComparisonRun[];
	mobileReviewCards: BuilderMobileReviewCard[];
	decisionLedger: import('../control-plane').BuilderDecisionLedger;
	sourceTimeline: BuilderSourceTimelineEntry[];
	providerProposalRegister: BuilderProviderProposalRegisterEntry[];
	providerActivity: BuilderProviderActivity[];
	stableMemory: BuilderStableMemoryState;
	workingMemory: BuilderWorkingMemoryState;
}
