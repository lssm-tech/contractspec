import type { RuntimeTarget } from '@contractspec/lib.provider-spec';

export const LOCAL_RUNTIME_INTEGRATION_PACKAGE =
	'@contractspec/integration.runtime.local';

export function createLocalRuntimeTargetPayload(
	overrides: Partial<RuntimeTarget> = {}
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
