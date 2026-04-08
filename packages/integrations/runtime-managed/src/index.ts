import type { RuntimeTarget } from '@contractspec/lib.provider-spec';

export const MANAGED_RUNTIME_INTEGRATION_PACKAGE =
	'@contractspec/integration.runtime.managed';

export function createManagedRuntimeTargetPayload(
	overrides: Partial<RuntimeTarget> = {}
) {
	return {
		type: 'managed_workspace',
		runtimeMode: 'managed',
		displayName: 'Managed Builder Runtime',
		networkPolicy: 'managed-default',
		dataLocality: 'managed',
		secretHandlingMode: 'managed',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: false,
		...overrides,
	} as const;
}
