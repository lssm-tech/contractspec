import type { BuilderConversation } from '@contractspec/lib.builder-spec';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

export async function startConversation(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const boundChannelIds = Array.isArray(input.payload?.boundChannelIds)
		? (input.payload.boundChannelIds as string[])
		: [];
	const primaryChannelType =
		(input.payload
			?.primaryChannelType as BuilderConversation['primaryChannelType']) ??
		(boundChannelIds[0] as
			| BuilderConversation['primaryChannelType']
			| undefined) ??
		'web_chat';
	return deps.store.saveConversation({
		id: String(input.entityId ?? createBuilderId('conversation')),
		workspaceId: String(input.workspaceId),
		mode: (input.payload?.mode as BuilderConversation['mode']) ?? 'mixed',
		primaryChannelType,
		activeLane: 'clarify',
		activeExecutionLaneKey: 'clarify',
		boundChannelIds,
		lastActivityAt: isoNow(deps.now),
		status: 'active',
	});
}

export async function updateConversation(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const conversation = await deps.store.getConversation(
		String(input.entityId ?? input.conversationId)
	);
	if (!conversation) return null;
	const channelId = String(input.payload?.channelId ?? '');
	const boundChannelIds =
		commandKey === 'builder.conversation.bindChannel'
			? [...new Set([...conversation.boundChannelIds, channelId])]
			: commandKey === 'builder.conversation.unbindChannel'
				? conversation.boundChannelIds.filter((id) => id !== channelId)
				: conversation.boundChannelIds;
	return deps.store.saveConversation({
		...conversation,
		status:
			commandKey === 'builder.conversation.pause'
				? 'paused'
				: commandKey === 'builder.conversation.resume'
					? 'active'
					: commandKey === 'builder.conversation.archive'
						? 'archived'
						: conversation.status,
		boundChannelIds,
		primaryChannelType:
			(commandKey === 'builder.conversation.bindChannel' &&
			channelId &&
			!conversation.primaryChannelType
				? (channelId as BuilderConversation['primaryChannelType'])
				: conversation.primaryChannelType) ??
			(boundChannelIds[0] as
				| BuilderConversation['primaryChannelType']
				| undefined) ??
			'web_chat',
		lastActivityAt: isoNow(deps.now),
	});
}
