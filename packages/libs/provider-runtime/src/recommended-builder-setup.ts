import type {
	ProviderRoutingPolicy,
	RiskLevel,
} from '@contractspec/lib.provider-spec';

export interface ManagedBuilderRoutingPolicyOptions {
	conversationalProviderId: string;
	codingProviderId: string;
	codingFallbackProviderIds?: string[];
	sttProviderId: string;
	localHelperProviderId?: string;
	defaultProviderProfileId?: string;
	highRiskThreshold?: RiskLevel;
}

export function createManagedBuilderRoutingPolicyPayload(
	input: ManagedBuilderRoutingPolicyOptions
): Pick<
	ProviderRoutingPolicy,
	| 'taskRules'
	| 'riskRules'
	| 'runtimeModeRules'
	| 'comparisonRules'
	| 'fallbackRules'
	| 'defaultProviderProfileId'
> {
	const codingFallbackProviderIds = input.codingFallbackProviderIds ?? [];
	const conversationalFallbackProviders = input.localHelperProviderId
		? [input.localHelperProviderId]
		: [];
	const highRiskThreshold = input.highRiskThreshold ?? 'high';

	return {
		taskRules: [
			{
				taskType: 'clarify',
				preferredProviders: [input.conversationalProviderId],
				fallbackProviders: conversationalFallbackProviders,
			},
			{
				taskType: 'summarize_sources',
				preferredProviders: [input.conversationalProviderId],
				fallbackProviders: conversationalFallbackProviders,
			},
			{
				taskType: 'extract_structure',
				preferredProviders: [input.conversationalProviderId],
				fallbackProviders: conversationalFallbackProviders,
			},
			{
				taskType: 'draft_blueprint',
				preferredProviders: [input.conversationalProviderId],
				fallbackProviders: conversationalFallbackProviders,
			},
			{
				taskType: 'refine_blueprint',
				preferredProviders: [input.conversationalProviderId],
				fallbackProviders: conversationalFallbackProviders,
			},
			{
				taskType: 'generate_ui_artifacts',
				preferredProviders: [input.conversationalProviderId],
				fallbackProviders: codingFallbackProviderIds,
			},
			{
				taskType: 'propose_patch',
				preferredProviders: [input.codingProviderId],
				fallbackProviders: codingFallbackProviderIds,
			},
			{
				taskType: 'generate_tests',
				preferredProviders: [input.codingProviderId],
				fallbackProviders: codingFallbackProviderIds,
			},
			{
				taskType: 'verify_output',
				preferredProviders: [input.codingProviderId],
				fallbackProviders: codingFallbackProviderIds,
			},
			{
				taskType: 'explain_diff',
				preferredProviders: [input.codingProviderId],
				fallbackProviders: [
					input.conversationalProviderId,
					...codingFallbackProviderIds,
				],
			},
			{
				taskType: 'transcribe_audio',
				preferredProviders: [input.sttProviderId],
				fallbackProviders: [],
			},
		],
		riskRules: [
			{
				riskLevelAtOrAbove: highRiskThreshold,
				blockedProviderKinds: ['routing_helper'],
				requireComparison: true,
			},
			{
				riskLevelAtOrAbove: 'critical',
				blockedProviderKinds: ['routing_helper', 'conversational'],
				requiredProviderKinds: ['coding'],
				requireComparison: true,
			},
		],
		runtimeModeRules: [
			{
				runtimeMode: 'local',
				disallowManagedProvidersForSensitiveData: true,
			},
			{
				runtimeMode: 'hybrid',
				disallowManagedProvidersForSensitiveData: true,
			},
		],
		comparisonRules: [
			{
				taskType: 'propose_patch',
				riskLevelAtOrAbove: highRiskThreshold,
				comparisonMode: 'dual_provider',
			},
			{
				taskType: 'verify_output',
				riskLevelAtOrAbove: highRiskThreshold,
				comparisonMode: 'dual_provider',
			},
		],
		fallbackRules: [
			{
				onFailure: 'provider_failed',
				action: 'fallback_or_escalate',
			},
			{
				onFailure: 'receipt_integrity_failed',
				action: 'escalate',
			},
			{
				onFailure: 'policy_blocked',
				action: 'block',
			},
		],
		defaultProviderProfileId:
			input.defaultProviderProfileId ?? input.conversationalProviderId,
	};
}
