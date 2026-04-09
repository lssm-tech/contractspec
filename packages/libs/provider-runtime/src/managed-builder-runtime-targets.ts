import type { RuntimeTarget } from '@contractspec/lib.provider-spec';
import type { BuilderBootstrapResource } from './managed-builder-bootstrap';

export const BUILDER_MANAGED_RUNTIME_TARGET_ID = 'rt_managed_default';
export const BUILDER_LOCAL_RUNTIME_TARGET_ID = 'rt_local_default';
export const BUILDER_HYBRID_RUNTIME_TARGET_ID = 'rt_hybrid_default';

function createManagedRuntimeTargetPayload(): Record<string, unknown> {
	return {
		type: 'managed_workspace' satisfies RuntimeTarget['type'],
		runtimeMode: 'managed' satisfies RuntimeTarget['runtimeMode'],
		displayName: 'Managed Builder Runtime',
		networkPolicy: 'managed-default',
		dataLocality: 'managed',
		secretHandlingMode: 'managed',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: false,
	};
}

function createLocalRuntimeTargetPayload(): Record<string, unknown> {
	return {
		type: 'local_daemon' satisfies RuntimeTarget['type'],
		runtimeMode: 'local' satisfies RuntimeTarget['runtimeMode'],
		displayName: 'Local Builder Runtime',
		networkPolicy: 'tenant-local',
		dataLocality: 'local',
		secretHandlingMode: 'local',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: true,
	};
}

function createHybridRuntimeTargetPayload(): Record<string, unknown> {
	return {
		type: 'hybrid_bridge' satisfies RuntimeTarget['type'],
		runtimeMode: 'hybrid' satisfies RuntimeTarget['runtimeMode'],
		displayName: 'Hybrid Builder Runtime',
		networkPolicy: 'hybrid-bridge',
		dataLocality: 'mixed',
		secretHandlingMode: 'mixed',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: true,
	};
}

export function createManagedBuilderBootstrapRuntimeTargets(input: {
	includeLocalRuntimeTarget?: boolean;
	includeHybridRuntimeTarget?: boolean;
}) {
	const runtimeTargets: Array<
		BuilderBootstrapResource<Record<string, unknown>>
	> = [
		{
			id: BUILDER_MANAGED_RUNTIME_TARGET_ID,
			payload: createManagedRuntimeTargetPayload(),
		},
	];
	if (input.includeLocalRuntimeTarget) {
		runtimeTargets.push({
			id: BUILDER_LOCAL_RUNTIME_TARGET_ID,
			payload: createLocalRuntimeTargetPayload(),
		});
	}
	if (input.includeHybridRuntimeTarget) {
		runtimeTargets.push({
			id: BUILDER_HYBRID_RUNTIME_TARGET_ID,
			payload: createHybridRuntimeTargetPayload(),
		});
	}
	return runtimeTargets;
}
