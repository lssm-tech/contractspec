import type { RuntimeTarget } from '@contractspec/lib.provider-spec';
import { isRecord, readRuntimeMode, readStringArray } from './shared';

export function createBuilderRuntimeTargetRecord(input: {
	commandKey: string;
	workspaceId: string;
	entityId: string;
	payload?: Record<string, unknown>;
	existing?: RuntimeTarget | null;
	nowIso: string;
}) {
	const payload = input.payload ?? {};
	const existing = input.existing;
	return {
		id: input.entityId,
		workspaceId: input.workspaceId,
		type:
			(payload.type as RuntimeTarget['type']) ??
			existing?.type ??
			'managed_workspace',
		runtimeMode: readRuntimeMode(
			payload.runtimeMode,
			existing?.runtimeMode ?? 'managed'
		),
		displayName: String(
			payload.displayName ?? existing?.displayName ?? 'Runtime Target'
		),
		registrationState:
			input.commandKey === 'builder.runtimeTarget.quarantine'
				? 'quarantined'
				: ((payload.registrationState as RuntimeTarget['registrationState']) ??
					existing?.registrationState ??
					'registered'),
		capabilityProfile: {
			supportsPreview:
				typeof payload.supportsPreview === 'boolean'
					? payload.supportsPreview
					: (existing?.capabilityProfile.supportsPreview ?? true),
			supportsExport:
				typeof payload.supportsExport === 'boolean'
					? payload.supportsExport
					: (existing?.capabilityProfile.supportsExport ?? true),
			supportsMobileInspection:
				typeof payload.supportsMobileInspection === 'boolean'
					? payload.supportsMobileInspection
					: (existing?.capabilityProfile.supportsMobileInspection ?? true),
			supportsLocalExecution:
				typeof payload.supportsLocalExecution === 'boolean'
					? payload.supportsLocalExecution
					: (existing?.capabilityProfile.supportsLocalExecution ??
						readRuntimeMode(payload.runtimeMode) !== 'managed'),
			availableProviders:
				readStringArray(payload.availableProviders).length > 0
					? readStringArray(payload.availableProviders)
					: (existing?.capabilityProfile.availableProviders ?? []),
			dataLocality:
				(payload.dataLocality as RuntimeTarget['capabilityProfile']['dataLocality']) ??
				existing?.capabilityProfile.dataLocality ??
				'managed',
			artifactSizeLimitMb:
				typeof payload.artifactSizeLimitMb === 'number'
					? payload.artifactSizeLimitMb
					: existing?.capabilityProfile.artifactSizeLimitMb,
			storageProfile:
				typeof payload.storageProfile === 'string'
					? payload.storageProfile
					: existing?.capabilityProfile.storageProfile,
			networkReachability:
				(payload.networkReachability as RuntimeTarget['capabilityProfile']['networkReachability']) ??
				existing?.capabilityProfile.networkReachability,
			supportedChannels:
				readStringArray(payload.supportedChannels).length > 0
					? readStringArray(payload.supportedChannels)
					: existing?.capabilityProfile.supportedChannels,
		},
		networkPolicy: String(
			payload.networkPolicy ?? existing?.networkPolicy ?? 'default'
		),
		dataLocality:
			(payload.dataLocality as RuntimeTarget['dataLocality']) ??
			existing?.dataLocality ??
			'managed',
		secretHandlingMode:
			(payload.secretHandlingMode as RuntimeTarget['secretHandlingMode']) ??
			existing?.secretHandlingMode ??
			'managed',
		capabilityHandshake: isRecord(payload.capabilityHandshake)
			? {
					id: String(
						payload.capabilityHandshake.id ?? `handshake_${input.entityId}`
					),
					workspaceId: input.workspaceId,
					runtimeTargetId: input.entityId,
					supportedModes: Array.isArray(
						payload.capabilityHandshake.supportedModes
					)
						? payload.capabilityHandshake.supportedModes.map((mode) =>
								readRuntimeMode(mode)
							)
						: (existing?.capabilityHandshake?.supportedModes ?? ['managed']),
					availableProviders:
						readStringArray(payload.capabilityHandshake.availableProviders)
							.length > 0
							? readStringArray(payload.capabilityHandshake.availableProviders)
							: (existing?.capabilityHandshake?.availableProviders ?? []),
					storageProfile: String(
						payload.capabilityHandshake.storageProfile ?? 'default'
					),
					networkReachability:
						(payload.capabilityHandshake.networkReachability as
							| 'online'
							| 'restricted'
							| 'offline') ?? 'online',
					artifactSizeLimitMb: Number(
						payload.capabilityHandshake.artifactSizeLimitMb ?? 25
					),
					localUiSupport: Boolean(payload.capabilityHandshake.localUiSupport),
					capturedAt: input.nowIso,
				}
			: existing?.capabilityHandshake,
		trustProfile: isRecord(payload.trustProfile)
			? {
					controller:
						(payload.trustProfile.controller as
							| 'builder_managed'
							| 'tenant_local'
							| 'shared'
							| 'unknown') ?? 'unknown',
					secretsLocation:
						(payload.trustProfile.secretsLocation as
							| 'managed_vault'
							| 'local_only'
							| 'mixed'
							| 'unknown') ?? 'unknown',
					outboundNetworkAllowed: Boolean(
						payload.trustProfile.outboundNetworkAllowed
					),
					managedRelayAllowed: Boolean(
						payload.trustProfile.managedRelayAllowed
					),
					evidenceEgressPolicy:
						(payload.trustProfile.evidenceEgressPolicy as
							| 'full'
							| 'summaries_only'
							| 'blocked') ?? 'summaries_only',
					lastReviewedAt: input.nowIso,
				}
			: existing?.trustProfile,
		lease: existing?.lease,
		lastSeenAt: input.nowIso,
		lastHealthSummary:
			typeof payload.lastHealthSummary === 'string'
				? payload.lastHealthSummary
				: existing?.lastHealthSummary,
		blockedReasons:
			input.commandKey === 'builder.runtimeTarget.quarantine'
				? [
						...new Set([
							...(existing?.blockedReasons ?? []),
							String(payload.reason ?? 'Runtime target quarantined.'),
						]),
					]
				: existing?.blockedReasons,
		createdAt: existing?.createdAt ?? input.nowIso,
		updatedAt: input.nowIso,
	} satisfies RuntimeTarget;
}
