import type { BuilderWorkspace } from '@contractspec/lib.builder-spec';
import type { ProviderRoutingPolicy } from '@contractspec/lib.provider-spec';

export function createBuilderRoutingPolicyRecord(input: {
	workspace: BuilderWorkspace;
	payload?: Record<string, unknown>;
	existing?: ProviderRoutingPolicy | null;
	nowIso: string;
	id: string;
}) {
	const payload = input.payload ?? {};
	const existing = input.existing;
	return {
		id: input.id,
		workspaceId: input.workspace.id,
		taskRules:
			Array.isArray(payload.taskRules) && payload.taskRules.length > 0
				? (payload.taskRules as ProviderRoutingPolicy['taskRules'])
				: (existing?.taskRules ?? []),
		riskRules: Array.isArray(payload.riskRules)
			? (payload.riskRules as ProviderRoutingPolicy['riskRules'])
			: (existing?.riskRules ?? []),
		runtimeModeRules: Array.isArray(payload.runtimeModeRules)
			? (payload.runtimeModeRules as ProviderRoutingPolicy['runtimeModeRules'])
			: (existing?.runtimeModeRules ?? []),
		comparisonRules: Array.isArray(payload.comparisonRules)
			? (payload.comparisonRules as ProviderRoutingPolicy['comparisonRules'])
			: (existing?.comparisonRules ?? []),
		fallbackRules: Array.isArray(payload.fallbackRules)
			? (payload.fallbackRules as ProviderRoutingPolicy['fallbackRules'])
			: (existing?.fallbackRules ?? []),
		defaultProviderProfileId:
			typeof payload.defaultProviderProfileId === 'string'
				? payload.defaultProviderProfileId
				: (existing?.defaultProviderProfileId ??
					input.workspace.preferredProviderProfileId),
		updatedAt: input.nowIso,
	} satisfies ProviderRoutingPolicy;
}
