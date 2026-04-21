import type { RuntimeTarget } from '@contractspec/lib.provider-spec';

export const LOCAL_RUNTIME_INTEGRATION_PACKAGE =
	'@contractspec/integration.runtime.local';

export function createLocalRuntimeTargetPayload(
	overrides: Partial<RuntimeTarget> & Record<string, unknown> = {}
) {
	return {
		type: 'local_daemon',
		runtimeMode: 'local',
		displayName: 'Local Builder Runtime',
		networkPolicy: 'tenant-local',
		dataLocality: 'local',
		secretHandlingMode: 'local',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: true,
		...overrides,
	} as const;
}

export function createLocalDaemonRuntimeRegistrationPayload(
	input: {
		grantedTo?: string;
		availableProviders?: string[];
		storageProfile?: string;
		networkReachability?: 'online' | 'restricted' | 'offline';
		evidenceEgressPolicy?: 'full' | 'summaries_only' | 'blocked';
		artifactSizeLimitMb?: number;
	} = {}
): ReturnType<typeof createLocalRuntimeTargetPayload> & {
	supportedChannels: string[];
} {
	const supportedChannels = ['telegram', 'whatsapp', 'mobile_web'];
	const payload = createLocalRuntimeTargetPayload({
		capabilityHandshake: {
			id: 'hs_local_default',
			workspaceId: '',
			runtimeTargetId: '',
			supportedModes: ['local'],
			availableProviders: input.availableProviders ?? [
				'provider.codex',
				'provider.local.model',
			],
			storageProfile: input.storageProfile ?? 'local-daemon-cache',
			networkReachability: input.networkReachability ?? 'restricted',
			artifactSizeLimitMb: input.artifactSizeLimitMb ?? 50,
			localUiSupport: false,
			capturedAt: new Date().toISOString(),
		},
		trustProfile: {
			controller: 'tenant_local',
			secretsLocation: 'local_only',
			outboundNetworkAllowed: input.networkReachability !== 'offline',
			managedRelayAllowed: false,
			evidenceEgressPolicy: input.evidenceEgressPolicy ?? 'summaries_only',
			lastReviewedAt: new Date().toISOString(),
		},
		lease: input.grantedTo
			? {
					id: 'lease_local_default',
					workspaceId: '',
					runtimeTargetId: '',
					grantedTo: input.grantedTo,
					allowedScopes: ['preview', 'export', 'review'],
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
					status: 'active',
				}
			: undefined,
		lastHealthSummary: 'Local daemon registered and awaiting first heartbeat.',
	});
	return {
		...payload,
		supportedChannels,
	};
}
export * from './integration';
