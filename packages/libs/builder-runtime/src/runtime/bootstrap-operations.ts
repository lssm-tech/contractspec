import type {
	BuilderWorkspace,
	BuilderWorkspaceBootstrapPreset,
	BuilderWorkspaceBootstrapResult,
} from '@contractspec/lib.builder-spec';
import {
	createManagedBuilderBootstrapPreset,
	type ManagedBuilderBootstrapOptions,
} from '@contractspec/lib.provider-runtime';
import { isoNow } from '../utils/now';
import {
	updateExternalProvider,
	updateRuntimeTarget,
	upsertRoutingPolicy,
} from './provider-operations';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';
import { createWorkspace } from './workspace-operations';

function readBootstrapPreset(value: unknown): BuilderWorkspaceBootstrapPreset {
	return value === 'local_daemon_mvp' || value === 'hybrid_mvp'
		? value
		: 'managed_mvp';
}

function readBootstrapOptions(
	input: BuilderOperationInput
): ManagedBuilderBootstrapOptions {
	return {
		includeLocalRuntimeTarget:
			input.payload?.includeLocalRuntimeTarget === true,
		includeHybridRuntimeTarget:
			input.payload?.includeHybridRuntimeTarget === true,
		includeLocalHelperProvider:
			input.payload?.includeLocalHelperProvider !== false,
	};
}

async function ensureWorkspace(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const existing = input.workspaceId
		? await deps.store.getWorkspace(String(input.workspaceId))
		: null;
	if (existing) {
		return {
			workspace: existing,
			createdWorkspace: false,
		};
	}
	const created = (await createWorkspace(deps, input)) as BuilderWorkspace;
	return {
		workspace: created,
		createdWorkspace: true,
	};
}

export async function bootstrapWorkspace(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const preset = readBootstrapPreset(input.payload?.preset);
	const { workspace, createdWorkspace } = await ensureWorkspace(deps, input);
	const bootstrapPreset = createManagedBuilderBootstrapPreset({
		...readBootstrapOptions(input),
		preset,
	});

	for (const target of bootstrapPreset.runtimeTargets) {
		await updateRuntimeTarget(deps, 'builder.runtimeTarget.register', {
			workspaceId: workspace.id,
			entityId: target.id,
			payload: target.payload,
		});
	}
	for (const provider of bootstrapPreset.providers) {
		await updateExternalProvider(deps, 'builder.provider.register', {
			workspaceId: workspace.id,
			entityId: provider.id,
			payload: provider.payload,
		});
	}
	const routingPolicy = await upsertRoutingPolicy(deps, {
		workspaceId: workspace.id,
		payload: bootstrapPreset.routingPolicy,
	});
	await deps.store.saveWorkspace({
		...workspace,
		defaultRuntimeMode: bootstrapPreset.defaultRuntimeMode,
		preferredProviderProfileId: bootstrapPreset.defaultProviderProfileId,
		updatedAt: isoNow(deps.now),
	});

	return {
		workspaceId: workspace.id,
		preset,
		createdWorkspace,
		runtimeTargetIds: bootstrapPreset.runtimeTargets.map((target) => target.id),
		providerIds: bootstrapPreset.providers.map((provider) => provider.id),
		routingPolicyId: routingPolicy?.id,
		defaultProviderProfileId: bootstrapPreset.defaultProviderProfileId,
		defaultRuntimeMode: bootstrapPreset.defaultRuntimeMode,
	} satisfies BuilderWorkspaceBootstrapResult;
}
