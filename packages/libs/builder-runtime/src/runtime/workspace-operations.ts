import type { BuilderWorkspace } from '@contractspec/lib.builder-spec';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

export async function createWorkspace(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = {
		id: String(input.workspaceId ?? createBuilderId('workspace')),
		tenantId: String(input.payload?.tenantId ?? 'builder_default_tenant'),
		name: String(input.payload?.name ?? 'Builder Workspace'),
		status: 'draft',
		appClass:
			(input.payload?.appClass as BuilderWorkspace['appClass']) ??
			'internal_workflow',
		defaultRuntimeMode:
			input.payload?.defaultRuntimeMode === 'local' ||
			input.payload?.defaultRuntimeMode === 'hybrid'
				? input.payload.defaultRuntimeMode
				: 'managed',
		preferredProviderProfileId:
			typeof input.payload?.preferredProviderProfileId === 'string'
				? input.payload.preferredProviderProfileId
				: undefined,
		mobileParityRequired:
			typeof input.payload?.mobileParityRequired === 'boolean'
				? input.payload.mobileParityRequired
				: true,
		ownerIds: Array.isArray(input.payload?.ownerIds)
			? (input.payload.ownerIds as string[])
			: ['builder_owner'],
		defaultLocale: String(input.payload?.defaultLocale ?? 'en'),
		defaultChannelPolicy:
			(input.payload?.defaultChannelPolicy as Record<string, unknown>) ?? {},
		createdAt: isoNow(deps.now),
		updatedAt: isoNow(deps.now),
	} satisfies BuilderWorkspace;
	return deps.store.saveWorkspace(workspace);
}

export async function updateWorkspace(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	if (!workspace) return null;
	return deps.store.saveWorkspace({
		...workspace,
		name:
			commandKey === 'builder.workspace.rename'
				? String(input.payload?.name ?? workspace.name)
				: workspace.name,
		status:
			commandKey === 'builder.workspace.archive'
				? 'archived'
				: workspace.status,
		updatedAt: isoNow(deps.now),
	});
}
