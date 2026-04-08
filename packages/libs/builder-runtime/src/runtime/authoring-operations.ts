import { resolveBuilderFusion } from '../fusion';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import { applyStructuredPatch } from './shared';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

export async function generateBlueprint(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	if (!workspace) return null;
	const [conversations, directives, sources, participantBindings, existing] =
		await Promise.all([
			deps.store.listConversations(workspace.id),
			deps.store.listDirectives(workspace.id),
			deps.store.listSources(workspace.id),
			deps.store.listParticipantBindings(workspace.id),
			deps.store.getBlueprint(workspace.id),
		]);
	const resolution = resolveBuilderFusion({
		workspace,
		conversations,
		directives,
		sources,
		participantBindings,
		existing,
		now: deps.now,
	});
	for (const assumption of resolution.assumptions) {
		await deps.store.saveAssumption(assumption);
	}
	for (const conflict of resolution.conflicts) {
		await deps.store.saveConflict(conflict);
	}
	for (const receipt of resolution.decisionReceipts) {
		await deps.store.saveDecisionReceipt(receipt);
	}
	for (const edge of resolution.fusionGraphEdges) {
		await deps.store.saveFusionGraphEdge(edge);
	}
	return deps.store.saveBlueprint(resolution.blueprint);
}

export async function updateDirective(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const directive = await deps.store.getDirective(String(input.entityId));
	if (!directive) return null;
	return deps.store.saveDirective({
		...directive,
		status: commandKey === 'builder.directive.accept' ? 'accepted' : 'rejected',
		updatedAt: isoNow(deps.now),
	});
}

export async function resolveConflict(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const conflict = await deps.store.getConflict(String(input.entityId));
	if (!conflict) return null;
	return deps.store.saveConflict({
		...conflict,
		status: 'resolved',
		resolvedByDecisionReceiptId: String(
			input.payload?.decisionReceiptId ?? createBuilderId('decision')
		),
		updatedAt: isoNow(deps.now),
	});
}

export async function updateAssumption(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const assumption = await deps.store.getAssumption(String(input.entityId));
	if (!assumption) return null;
	return deps.store.saveAssumption({
		...assumption,
		status:
			commandKey === 'builder.assumption.confirm' ? 'confirmed' : 'rejected',
		updatedAt: isoNow(deps.now),
	});
}

export async function patchBlueprint(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const blueprint = await deps.store.getBlueprint(String(input.workspaceId));
	if (!blueprint) return null;
	const fieldPath = String(input.payload?.fieldPath ?? '');
	if (
		commandKey === 'builder.blueprint.patch' &&
		blueprint.lockedFieldPaths.includes(fieldPath)
	) {
		return blueprint;
	}
	const nextBlueprint =
		commandKey === 'builder.blueprint.patch'
			? applyStructuredPatch(blueprint, {
					fieldPath,
					mode:
						input.payload?.mode === 'append' || input.payload?.mode === 'remove'
							? input.payload.mode
							: 'replace',
					value: input.payload?.value ?? input.payload?.appBrief,
				})
			: {
					...blueprint,
				};
	return deps.store.saveBlueprint({
		...nextBlueprint,
		lockedFieldPaths:
			commandKey === 'builder.blueprint.lockSection'
				? [...new Set([...blueprint.lockedFieldPaths, fieldPath])]
				: commandKey === 'builder.blueprint.unlockSection'
					? blueprint.lockedFieldPaths.filter((path) => path !== fieldPath)
					: nextBlueprint.lockedFieldPaths,
		version:
			commandKey === 'builder.blueprint.patch'
				? blueprint.version + 1
				: nextBlueprint.version,
		updatedAt: isoNow(deps.now),
	});
}
