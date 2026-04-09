export interface BuilderStatusReport {
	workspaceId: string;
	bootstrapMode: 'managed' | 'local' | 'hybrid';
	bootstrapComplete: boolean;
	managedBootstrapComplete: boolean;
	missingPrerequisites: string[];
	defaultProviderProfileId?: string;
	runtimeCoverage: Record<'managed' | 'local' | 'hybrid', boolean>;
	providerCoverage: Record<
		'conversational' | 'coding' | 'stt' | 'localHelper',
		boolean
	>;
	routingPolicyPresent: boolean;
	previewState: string;
	readinessState: string;
	mobileReviewAvailable: boolean;
	exportState: string;
	comparisonHighRiskEnabled: boolean;
	mobileParityStatus?: string;
}

export interface BuilderMobileStatusReport {
	workspaceId: string;
	mobileParityStatus: string;
	channelNativeFeatures: string[];
	deepLinkFeatures: string[];
	blockedFeatures: string[];
	channelNativeActionCount: number;
	deepLinkActionCount: number;
}

export interface BuilderLocalRuntimeStatusReport {
	workspaceId: string;
	runtimeTargetId?: string;
	registrationState: string;
	networkReachability?: string;
	storageProfile?: string;
	evidenceEgressPolicy?: string;
	grantedTo?: string;
	expiresAt?: string;
}

export interface BuilderComparisonStatusReport {
	workspaceId: string;
	highRiskComparisonEnabled: boolean;
	comparisonRuleCount: number;
	comparisonRunCount: number;
	lastVerdictSummary?: string;
}
