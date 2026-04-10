import type {
	ExecutionTaskType,
	ExternalExecutionProvider,
	ProviderRoutingPolicy,
	ProviderSelection,
	RuntimeMode,
} from '@contractspec/lib.provider-spec';
import { comparisonProviderLimit, riskMeetsThreshold } from './helpers';

export function selectProvider(input: {
	taskType: ExecutionTaskType;
	runtimeMode: RuntimeMode;
	routingPolicy: ProviderRoutingPolicy | null | undefined;
	providers: ExternalExecutionProvider[];
	hasSensitiveSourceData: boolean;
}): ProviderSelection | null {
	const taskRule = input.routingPolicy?.taskRules.find(
		(rule) => rule.taskType === input.taskType
	);
	const runtimeModeRule = input.routingPolicy?.runtimeModeRules.find(
		(rule) => rule.runtimeMode === input.runtimeMode
	);
	const compatibleProviders = input.providers.filter((provider) => {
		if (provider.status === 'disabled' || provider.availability === 'offline') {
			return false;
		}
		if (
			!provider.supportedRuntimeModes.includes(input.runtimeMode) ||
			!provider.supportedTaskTypes.includes(input.taskType)
		) {
			return false;
		}
		if (
			runtimeModeRule?.requiredProviderKinds?.length &&
			!runtimeModeRule.requiredProviderKinds.includes(provider.providerKind)
		) {
			return false;
		}
		if (
			runtimeModeRule?.disallowManagedProvidersForSensitiveData &&
			input.hasSensitiveSourceData &&
			provider.authMode === 'managed' &&
			!provider.capabilityProfile.supportsLocalExecution
		) {
			return false;
		}
		const providerRisk = provider.defaultRiskPolicy[input.taskType] ?? 'medium';
		const applicableRiskRules =
			input.routingPolicy?.riskRules.filter((rule) =>
				riskMeetsThreshold(providerRisk, rule.riskLevelAtOrAbove)
			) ?? [];
		if (
			applicableRiskRules.some(
				(rule) =>
					rule.blockedProviderIds?.includes(provider.id) ||
					rule.blockedProviderKinds?.includes(provider.providerKind)
			)
		) {
			return false;
		}
		if (
			applicableRiskRules.some(
				(rule) =>
					rule.requiredProviderKinds?.length &&
					!rule.requiredProviderKinds.includes(provider.providerKind)
			)
		) {
			return false;
		}
		return true;
	});
	const rankedProviders = compatibleProviders
		.map((provider, index) => {
			const providerRisk =
				provider.defaultRiskPolicy[input.taskType] ?? 'medium';
			const applicableRiskRules =
				input.routingPolicy?.riskRules.filter((rule) =>
					riskMeetsThreshold(providerRisk, rule.riskLevelAtOrAbove)
				) ?? [];
			const taskPreferredRank =
				taskRule?.preferredProviders.indexOf(provider.id) ?? -1;
			const taskFallbackRank =
				taskRule?.fallbackProviders.indexOf(provider.id) ?? -1;
			const riskPreferredRank = applicableRiskRules
				.flatMap((rule) => rule.preferredProviders ?? [])
				.indexOf(provider.id);
			const rank =
				taskPreferredRank >= 0
					? taskPreferredRank
					: riskPreferredRank >= 0
						? 100 + riskPreferredRank
						: taskFallbackRank >= 0
							? 200 + taskFallbackRank
							: 1000 + index;
			return { provider, rank };
		})
		.sort((left, right) => left.rank - right.rank)
		.map((entry) => entry.provider);
	const selected = rankedProviders[0];
	if (!selected) {
		return null;
	}
	const selectedRisk = selected.defaultRiskPolicy[input.taskType] ?? 'medium';
	const applicableRiskRules =
		input.routingPolicy?.riskRules.filter((rule) =>
			riskMeetsThreshold(selectedRisk, rule.riskLevelAtOrAbove)
		) ?? [];
	const comparisonMode =
		taskRule?.comparisonMode ??
		input.routingPolicy?.comparisonRules.find(
			(rule) =>
				rule.taskType === input.taskType &&
				riskMeetsThreshold(selectedRisk, rule.riskLevelAtOrAbove)
		)?.comparisonMode ??
		(applicableRiskRules.some((rule) => rule.requireComparison)
			? 'dual_provider'
			: undefined);
	return {
		taskType: input.taskType,
		selectedProviderId: selected.id,
		reason: taskRule
			? `Matched routing policy for ${input.taskType}.`
			: `Selected first compatible ${selected.providerKind} provider.`,
		runtimeMode: input.runtimeMode,
		riskLevel: selectedRisk,
		comparisonProviderIds:
			comparisonMode &&
			comparisonProviderLimit(comparisonMode) > 0 &&
			rankedProviders.length > 1
				? rankedProviders
						.filter(
							(provider) =>
								provider.id !== selected.id &&
								provider.supportedTaskTypes.includes(input.taskType)
						)
						.slice(0, comparisonProviderLimit(comparisonMode))
						.map((provider) => provider.id)
				: undefined,
	};
}
