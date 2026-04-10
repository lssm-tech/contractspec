import type { BuilderWorkspaceSnapshot } from '@contractspec/lib.builder-spec';

export interface ManagedBootstrapStatus {
	complete: boolean;
	label: string;
	missingPrerequisites: string[];
	defaultProviderProfileId?: string;
	runtimeCoverage: Record<'managed' | 'local' | 'hybrid', boolean>;
	providerCoverage: Record<
		'conversational' | 'coding' | 'stt' | 'localHelper',
		boolean
	>;
}

function hasRuntimeTarget(
	snapshot: BuilderWorkspaceSnapshot,
	runtimeMode: 'managed' | 'local' | 'hybrid'
) {
	return snapshot.runtimeTargets.some(
		(target) =>
			target.runtimeMode === runtimeMode &&
			target.registrationState === 'registered'
	);
}

export function summarizeManagedBootstrap(
	snapshot: BuilderWorkspaceSnapshot
): ManagedBootstrapStatus {
	const runtimeCoverage = {
		managed: hasRuntimeTarget(snapshot, 'managed'),
		local: hasRuntimeTarget(snapshot, 'local'),
		hybrid: hasRuntimeTarget(snapshot, 'hybrid'),
	};
	const providerCoverage = {
		conversational: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'conversational'
		),
		coding: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'coding'
		),
		stt: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'stt'
		),
		localHelper: snapshot.externalProviders.some(
			(provider) => provider.providerKind === 'routing_helper'
		),
	};
	const missingPrerequisites = [
		!runtimeCoverage.managed ? 'managed runtime target' : null,
		!providerCoverage.conversational ? 'conversational provider' : null,
		!providerCoverage.coding ? 'coding provider' : null,
		!providerCoverage.stt ? 'STT provider' : null,
		!snapshot.routingPolicy ? 'routing policy' : null,
	].filter((value): value is string => value !== null);
	const complete = missingPrerequisites.length === 0;

	return {
		complete,
		label: complete
			? 'managed bootstrap complete'
			: `managed bootstrap missing ${missingPrerequisites.join(', ')}`,
		missingPrerequisites,
		defaultProviderProfileId:
			snapshot.routingPolicy?.defaultProviderProfileId ??
			snapshot.workspace.preferredProviderProfileId,
		runtimeCoverage,
		providerCoverage,
	};
}
