import type { RuntimeTarget } from '@contractspec/lib.provider-spec';

export const HYBRID_RUNTIME_INTEGRATION_PACKAGE =
	'@contractspec/integration.runtime.hybrid';

export function createHybridRuntimeTargetPayload(
	overrides: Partial<RuntimeTarget> = {}
) {
	return {
		type: 'hybrid_bridge',
		runtimeMode: 'hybrid',
		displayName: 'Hybrid Builder Runtime',
		networkPolicy: 'hybrid-bridge',
		dataLocality: 'mixed',
		secretHandlingMode: 'mixed',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: true,
		...overrides,
	} as const;
}
export * from './integration';
