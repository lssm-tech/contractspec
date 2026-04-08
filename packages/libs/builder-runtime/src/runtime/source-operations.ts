import { createBuilderId } from '../utils/id';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

export async function reprocessSource(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const source = await deps.store.getSource(String(input.entityId));
	if (!source) return null;
	return {
		source,
		parts: await deps.store.listExtractedParts(source.id),
		evidenceReferences: await deps.store.listEvidenceReferences(
			source.workspaceId
		),
		directives: (await deps.store.listDirectives(source.workspaceId)).filter(
			(directive) => directive.sourceIds.includes(source.id)
		),
	};
}

export async function removeSource(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const source = await deps.store.getSource(String(input.entityId));
	if (!source) return null;
	return deps.store.saveSource({
		...source,
		deletedAt: deps.now().toISOString(),
		approvalState: 'superseded',
		updatedAt: deps.now().toISOString(),
	});
}

export async function sendOutbound(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	if (!deps.options.outboundBridge) {
		throw new Error('Builder outbound bridge is not configured.');
	}
	const outboundTag = `builder:outbound:${String(input.workspaceId)}:${createBuilderId('dispatch')}`;
	const result = await deps.options.outboundBridge.send({
		workspaceId: String(input.workspaceId),
		channelType: String(input.payload?.channelType) as
			| 'telegram'
			| 'whatsapp'
			| 'web_chat',
		text: String(input.payload?.text ?? ''),
		externalThreadId: String(input.payload?.externalThreadId ?? ''),
		externalChannelId: input.payload?.externalChannelId as string | undefined,
	});
	return {
		...result,
		outboundTag,
	};
}
