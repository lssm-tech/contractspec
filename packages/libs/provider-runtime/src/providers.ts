import type { ExternalExecutionProvider } from '@contractspec/lib.provider-spec';
import { isRecord, readRuntimeMode, readStringArray } from './shared';

export function createBuilderExternalProviderRecord(input: {
	commandKey: string;
	workspaceId: string;
	entityId: string;
	payload?: Record<string, unknown>;
	existing?: ExternalExecutionProvider | null;
	nowIso: string;
}) {
	const payload = input.payload ?? {};
	const existing = input.existing;
	return {
		id: input.entityId,
		workspaceId: input.workspaceId,
		providerKind:
			(payload.providerKind as ExternalExecutionProvider['providerKind']) ??
			existing?.providerKind ??
			'coding',
		displayName: String(
			payload.displayName ?? existing?.displayName ?? 'External Provider'
		),
		integrationPackage: String(
			payload.integrationPackage ??
				existing?.integrationPackage ??
				'@contractspec/integration.provider.unspecified'
		),
		authMode:
			(payload.authMode as ExternalExecutionProvider['authMode']) ??
			existing?.authMode ??
			'managed',
		capabilityProfile: {
			providerId: String(
				input.entityId ?? existing?.capabilityProfile.providerId ?? 'provider'
			),
			supportsRepoScopedPatch: Boolean(
				payload.supportsRepoScopedPatch ??
					existing?.capabilityProfile.supportsRepoScopedPatch
			),
			supportsStructuredDiff: Boolean(
				payload.supportsStructuredDiff ??
					existing?.capabilityProfile.supportsStructuredDiff
			),
			supportsLongContext: Boolean(
				payload.supportsLongContext ??
					existing?.capabilityProfile.supportsLongContext
			),
			supportsFunctionCalling: Boolean(
				payload.supportsFunctionCalling ??
					existing?.capabilityProfile.supportsFunctionCalling
			),
			supportsSTT: Boolean(
				payload.supportsSTT ?? existing?.capabilityProfile.supportsSTT
			),
			supportsVision: Boolean(
				payload.supportsVision ?? existing?.capabilityProfile.supportsVision
			),
			supportsStreaming: Boolean(
				payload.supportsStreaming ??
					existing?.capabilityProfile.supportsStreaming
			),
			supportsLocalExecution: Boolean(
				payload.supportsLocalExecution ??
					existing?.capabilityProfile.supportsLocalExecution
			),
			supportedArtifactTypes:
				readStringArray(payload.supportedArtifactTypes).length > 0
					? readStringArray(payload.supportedArtifactTypes)
					: (existing?.capabilityProfile.supportedArtifactTypes ?? []),
			knownConstraints:
				readStringArray(payload.knownConstraints).length > 0
					? readStringArray(payload.knownConstraints)
					: (existing?.capabilityProfile.knownConstraints ?? []),
		},
		supportedRuntimeModes:
			Array.isArray(payload.supportedRuntimeModes) &&
			payload.supportedRuntimeModes.length > 0
				? payload.supportedRuntimeModes.map((mode) => readRuntimeMode(mode))
				: (existing?.supportedRuntimeModes ?? ['managed']),
		supportedTaskTypes:
			readStringArray(payload.supportedTaskTypes).length > 0
				? (readStringArray(
						payload.supportedTaskTypes
					) as ExternalExecutionProvider['supportedTaskTypes'])
				: (existing?.supportedTaskTypes ?? ['clarify']),
		defaultRiskPolicy: isRecord(payload.defaultRiskPolicy)
			? Object.fromEntries(
					Object.entries(payload.defaultRiskPolicy).map(([key, value]) => [
						key,
						value === 'low' ||
						value === 'medium' ||
						value === 'high' ||
						value === 'critical'
							? value
							: 'medium',
					])
				)
			: (existing?.defaultRiskPolicy ?? {}),
		status:
			input.commandKey === 'builder.provider.update'
				? ((payload.status as ExternalExecutionProvider['status']) ??
					existing?.status ??
					'active')
				: 'active',
		availability:
			(payload.availability as ExternalExecutionProvider['availability']) ??
			existing?.availability ??
			'available',
		createdAt: existing?.createdAt ?? input.nowIso,
		updatedAt: input.nowIso,
	} satisfies ExternalExecutionProvider;
}
