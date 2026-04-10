export type RuntimeMode = 'managed' | 'local' | 'hybrid';
export type ProviderKind =
	| 'conversational'
	| 'coding'
	| 'stt'
	| 'vision'
	| 'evaluation'
	| 'routing_helper';
export type ExecutionTaskType =
	| 'clarify'
	| 'summarize_sources'
	| 'extract_structure'
	| 'draft_blueprint'
	| 'refine_blueprint'
	| 'propose_patch'
	| 'generate_tests'
	| 'generate_ui_artifacts'
	| 'verify_output'
	| 'explain_diff'
	| 'transcribe_audio';
export type PatchProposalStatus =
	| 'proposed'
	| 'accepted_for_preview'
	| 'rejected'
	| 'superseded'
	| 'merged_into_blueprint';
export type RuntimeTargetType =
	| 'managed_workspace'
	| 'local_daemon'
	| 'local_appliance'
	| 'hybrid_bridge';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ComparisonMode =
	| 'single_provider'
	| 'dual_provider'
	| 'multi_provider';
export type MobileSupportStatus = 'full' | 'partial' | 'blocked';
export type DataLocality = 'managed' | 'local' | 'mixed';
export type RuntimeRegistrationState =
	| 'pending'
	| 'registered'
	| 'degraded'
	| 'quarantined'
	| 'offline';
export type ExternalExecutionRunStatus =
	| 'queued'
	| 'running'
	| 'succeeded'
	| 'failed'
	| 'cancelled'
	| 'partial';

export interface RuntimeCapabilityProfile {
	supportsPreview: boolean;
	supportsExport: boolean;
	supportsMobileInspection: boolean;
	supportsLocalExecution: boolean;
	availableProviders: string[];
	dataLocality: DataLocality;
	artifactSizeLimitMb?: number;
	storageProfile?: string;
	networkReachability?: 'online' | 'restricted' | 'offline';
	supportedChannels?: string[];
}

export interface RuntimeCapabilityHandshake {
	id: string;
	workspaceId: string;
	runtimeTargetId: string;
	supportedModes: RuntimeMode[];
	availableProviders: string[];
	storageProfile: string;
	networkReachability: 'online' | 'restricted' | 'offline';
	artifactSizeLimitMb: number;
	localUiSupport: boolean;
	capturedAt: string;
}

export interface RuntimeTrustProfile {
	controller: 'builder_managed' | 'tenant_local' | 'shared' | 'unknown';
	secretsLocation: 'managed_vault' | 'local_only' | 'mixed' | 'unknown';
	outboundNetworkAllowed: boolean;
	managedRelayAllowed: boolean;
	evidenceEgressPolicy: 'full' | 'summaries_only' | 'blocked';
	lastReviewedAt?: string;
}

export interface RuntimeLease {
	id: string;
	workspaceId: string;
	runtimeTargetId: string;
	grantedTo: string;
	allowedScopes: string[];
	expiresAt: string;
	status: 'active' | 'expired' | 'revoked';
}

export interface RuntimeTarget {
	id: string;
	workspaceId: string;
	type: RuntimeTargetType;
	runtimeMode: RuntimeMode;
	displayName: string;
	registrationState: RuntimeRegistrationState;
	capabilityProfile: RuntimeCapabilityProfile;
	networkPolicy: string;
	dataLocality: DataLocality;
	secretHandlingMode: 'managed' | 'local' | 'mixed';
	capabilityHandshake?: RuntimeCapabilityHandshake;
	trustProfile?: RuntimeTrustProfile;
	lease?: RuntimeLease;
	lastSeenAt?: string;
	lastHealthSummary?: string;
	blockedReasons?: string[];
	createdAt: string;
	updatedAt: string;
}

export interface ProviderCapabilityProfile {
	providerId: string;
	supportsRepoScopedPatch: boolean;
	supportsStructuredDiff: boolean;
	supportsLongContext: boolean;
	supportsFunctionCalling: boolean;
	supportsSTT: boolean;
	supportsVision: boolean;
	supportsStreaming: boolean;
	supportsLocalExecution: boolean;
	supportedArtifactTypes: string[];
	knownConstraints: string[];
}

export interface ExternalExecutionProvider {
	id: string;
	workspaceId: string;
	providerKind: ProviderKind;
	displayName: string;
	integrationPackage: string;
	authMode: 'managed' | 'byok' | 'local' | 'ephemeral' | 'none';
	capabilityProfile: ProviderCapabilityProfile;
	supportedRuntimeModes: RuntimeMode[];
	supportedTaskTypes: ExecutionTaskType[];
	defaultRiskPolicy: Record<string, RiskLevel>;
	status: 'active' | 'degraded' | 'disabled' | 'preview';
	availability?: 'available' | 'limited' | 'offline';
	createdAt: string;
	updatedAt: string;
}

export interface ProviderRoutingTaskRule {
	taskType: ExecutionTaskType;
	preferredProviders: string[];
	fallbackProviders: string[];
	comparisonMode?: ComparisonMode;
	riskLevelAtOrAbove?: RiskLevel;
}

export interface ProviderRoutingRiskRule {
	riskLevelAtOrAbove: RiskLevel;
	preferredProviders?: string[];
	blockedProviderIds?: string[];
	requiredProviderKinds?: ProviderKind[];
	blockedProviderKinds?: ProviderKind[];
	requireComparison?: boolean;
}

export interface ProviderRoutingPolicy {
	id: string;
	workspaceId: string;
	taskRules: ProviderRoutingTaskRule[];
	riskRules: ProviderRoutingRiskRule[];
	runtimeModeRules: Array<{
		runtimeMode: RuntimeMode;
		disallowManagedProvidersForSensitiveData?: boolean;
		requiredProviderKinds?: ProviderKind[];
	}>;
	comparisonRules: Array<{
		taskType: ExecutionTaskType;
		riskLevelAtOrAbove: RiskLevel;
		comparisonMode: ComparisonMode;
	}>;
	fallbackRules: Array<{
		onFailure: string;
		action: 'retry' | 'fallback_or_escalate' | 'escalate' | 'block';
	}>;
	defaultProviderProfileId?: string;
	updatedAt: string;
}

export interface ProviderSelection {
	taskType: ExecutionTaskType;
	selectedProviderId: string;
	reason: string;
	runtimeMode: RuntimeMode;
	riskLevel: RiskLevel;
	comparisonProviderIds?: string[];
}

export interface ExternalExecutionContextBundle {
	id: string;
	workspaceId: string;
	taskType: ExecutionTaskType;
	problemStatement: string;
	blueprintRef: string;
	sourceRefs: string[];
	policyRefs: string[];
	allowedWriteScopes: string[];
	runtimeTargetRef?: string;
	acceptanceCriteria: string[];
	requiredOutputFormat?: string;
	requiredReceiptFields: string[];
	hash: string;
	createdAt: string;
}

export interface ExternalExecutionRun {
	id: string;
	workspaceId: string;
	providerId: string;
	taskType: ExecutionTaskType;
	runtimeMode: RuntimeMode;
	runtimeTargetId?: string;
	contextBundleId: string;
	requestedModel?: string;
	status: ExternalExecutionRunStatus;
	startedAt: string;
	finishedAt?: string;
	costEstimate?: number;
	tokenUsage?: {
		inputTokens?: number;
		outputTokens?: number;
	};
	artifactRefs: string[];
	patchProposalIds: string[];
	receiptId: string;
}

export interface ExternalArtifactIntegrityCheck {
	name: string;
	status: 'passed' | 'failed' | 'skipped';
	message: string;
}

export interface ExternalArtifactReceipt {
	id: string;
	runId: string;
	providerId: string;
	providerRunRef?: string;
	inputContextHash: string;
	outputArtifactHashes: string[];
	modelVersion?: string;
	runtimeMode: RuntimeMode;
	runtimeTargetId?: string;
	generatedAt: string;
	integrityChecks: ExternalArtifactIntegrityCheck[];
}

export interface ExternalExecutionReceipt {
	id: string;
	workspaceId: string;
	runId: string;
	providerId: string;
	providerKind: ProviderKind;
	modelId?: string;
	taskType: ExecutionTaskType;
	runtimeMode: RuntimeMode;
	runtimeTargetRef?: string;
	contextBundleId: string;
	contextHash: string;
	outputArtifactHashes: string[];
	costMetrics?: {
		tokensIn?: number;
		tokensOut?: number;
		latencyMs?: number;
		estimatedCostUsd?: number;
	};
	status: 'succeeded' | 'failed' | 'cancelled' | 'partial';
	startedAt: string;
	completedAt?: string;
	verificationRefs: string[];
}

export interface ExternalPatchProposal {
	id: string;
	workspaceId: string;
	receiptId: string;
	runId: string;
	summary: string;
	changedAreas: string[];
	diffHash: string;
	outputArtifactRefs: string[];
	allowedWriteScopes: string[];
	riskLevel: RiskLevel;
	verificationRequirements: string[];
	status: PatchProposalStatus;
	createdAt: string;
	updatedAt: string;
}

export interface ComparisonVerdict {
	recommendedProviderId?: string;
	summary: string;
	evidenceRefs: string[];
	confidence: number;
}

export interface ExecutionComparisonRun {
	id: string;
	workspaceId: string;
	taskType: ExecutionTaskType;
	riskLevel: RiskLevel;
	mode: ComparisonMode;
	providerIds: string[];
	receiptIds: string[];
	verdict?: ComparisonVerdict;
	status: 'pending' | 'completed' | 'failed';
	createdAt: string;
	updatedAt: string;
}
