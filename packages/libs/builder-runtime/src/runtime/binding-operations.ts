import type { BuilderParticipantBinding } from '@contractspec/lib.builder-spec';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

export async function updateParticipantBinding(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	if (
		commandKey === 'builder.participantBinding.bind' ||
		commandKey === 'builder.participant.bind'
	) {
		return deps.store.saveParticipantBinding({
			id: String(input.entityId ?? createBuilderId('binding')),
			workspaceId: String(input.workspaceId),
			participantId: String(input.payload?.participantId ?? 'participant'),
			workspaceRole:
				(input.payload
					?.workspaceRole as BuilderParticipantBinding['workspaceRole']) ??
				'editor',
			channelType:
				(input.payload
					?.channelType as BuilderParticipantBinding['channelType']) ??
				'telegram',
			externalIdentityRef: String(input.payload?.externalIdentityRef ?? ''),
			identityAssurance:
				(input.payload
					?.identityAssurance as BuilderParticipantBinding['identityAssurance']) ??
				'medium',
			channelBindingStrength:
				(input.payload
					?.channelBindingStrength as BuilderParticipantBinding['channelBindingStrength']) ??
				'medium',
			allowedActions: Array.isArray(input.payload?.allowedActions)
				? (input.payload.allowedActions as string[])
				: ['builder.brief.generate'],
			approvalStrength:
				(input.payload
					?.approvalStrength as BuilderParticipantBinding['approvalStrength']) ??
				'bound_channel_ack',
			messageAuthenticity:
				(input.payload
					?.messageAuthenticity as BuilderParticipantBinding['messageAuthenticity']) ??
				'high',
			createdAt: isoNow(deps.now),
		});
	}
	const binding = await deps.store.getParticipantBinding(
		String(input.entityId)
	);
	if (!binding) return null;
	return deps.store.saveParticipantBinding({
		...binding,
		allowedActions: Array.isArray(input.payload?.allowedActions)
			? (input.payload.allowedActions as string[])
			: binding.allowedActions,
		approvalStrength:
			commandKey === 'builder.participantBinding.update' ||
			commandKey === 'builder.participant.updateBinding'
				? ((input.payload
						?.approvalStrength as BuilderParticipantBinding['approvalStrength']) ??
					binding.approvalStrength)
				: binding.approvalStrength,
		channelBindingStrength:
			(input.payload
				?.channelBindingStrength as BuilderParticipantBinding['channelBindingStrength']) ??
			binding.channelBindingStrength,
		messageAuthenticity:
			(input.payload
				?.messageAuthenticity as BuilderParticipantBinding['messageAuthenticity']) ??
			binding.messageAuthenticity,
		revokedAt:
			commandKey === 'builder.participantBinding.revoke' ||
			commandKey === 'builder.participant.revokeBinding'
				? isoNow(deps.now)
				: binding.revokedAt,
	});
}
