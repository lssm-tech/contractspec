import type { BuilderApprovalTicket } from '@contractspec/lib.builder-spec';
import type { BuilderChannelInboundEnvelope } from '../ingestion';
import { isoNow } from '../utils/now';
import { patchBlueprint } from './authoring-operations';
import { updateApproval } from './plan-operations';
import {
	canApplyBuilderChannelOperation,
	extractStructuredOperation,
	inferBuilderRiskFromText,
} from './policy';
import { createDirectiveConfirmationReviewCard } from './review-card-operations';
import { requestedViaForChannel } from './shared';
import type { BuilderRuntimeDependencies } from './types';

export async function ingestChannelEnvelope(
	deps: BuilderRuntimeDependencies,
	envelope: BuilderChannelInboundEnvelope
) {
	const existingConversation = await deps.store.getConversation(
		envelope.conversationId
	);
	if (!existingConversation) {
		await deps.store.saveConversation({
			id: envelope.conversationId,
			workspaceId: envelope.workspaceId,
			mode: envelope.messageKind === 'voice' ? 'voice' : 'mixed',
			primaryChannelType: envelope.channelType,
			activeLane: 'clarify',
			activeExecutionLaneKey: 'clarify',
			boundChannelIds: [envelope.channelType],
			lastActivityAt: isoNow(deps.now),
			status: 'active',
		});
	}
	const result = await deps.ingestion.ingestChannelMessage(envelope);
	const binding = envelope.participantBindingId
		? await deps.store.getParticipantBinding(envelope.participantBindingId)
		: null;
	const operation = extractStructuredOperation(envelope.metadata?.operation);
	let approvalTicket: BuilderApprovalTicket | null = null;
	if (operation && result.message) {
		const riskLevel = inferBuilderRiskFromText(
			JSON.stringify(operation.value ?? envelope.text ?? operation.fieldPath),
			operation.fieldPath
		);
		const canApply = canApplyBuilderChannelOperation({
			riskLevel,
			binding,
			message: result.message,
			confirmationStep: operation.confirmationStep,
		});
		if (canApply) {
			if (operation.approvalTicketId) {
				await updateApproval(deps, 'builder.approval.capture', {
					workspaceId: envelope.workspaceId,
					entityId: operation.approvalTicketId,
					payload: {
						approvedBy: binding?.participantId,
						resolutionChannelType: envelope.channelType,
					},
				});
			}
			await patchBlueprint(deps, 'builder.blueprint.patch', {
				workspaceId: envelope.workspaceId,
				payload: {
					fieldPath: operation.fieldPath,
					mode: operation.mode,
					value: operation.value,
				},
			});
			for (const directive of result.directives) {
				await deps.store.saveDirective({
					...directive,
					status: 'accepted',
					updatedAt: isoNow(deps.now),
				});
			}
			await createDirectiveConfirmationReviewCard({
				deps,
				workspaceId: envelope.workspaceId,
				channelType: envelope.channelType,
				subjectId:
					result.message?.id ?? operation.approvalTicketId ?? 'directive',
				summary: `Applied ${operation.fieldPath} update from ${envelope.channelType}.`,
				affectedAreas: [operation.fieldPath],
				sourceRefs: result.source ? [result.source.id] : [],
			});
		} else {
			approvalTicket = (await updateApproval(deps, 'builder.approval.request', {
				workspaceId: envelope.workspaceId,
				conversationId: envelope.conversationId,
				payload: {
					reason: `Channel operation for ${operation.fieldPath} requires approval.`,
					riskLevel,
					requestedVia: requestedViaForChannel(envelope.channelType),
					requiredStrength:
						riskLevel === 'high'
							? 'admin_signed'
							: riskLevel === 'medium'
								? 'bound_channel_ack'
								: 'weak_channel_ack',
					requiresTwoStepConfirmation: riskLevel === 'high',
				},
			})) as BuilderApprovalTicket;
			for (const directive of result.directives) {
				await deps.store.saveDirective({
					...directive,
					approvalTicketId: approvalTicket.id,
					updatedAt: isoNow(deps.now),
				});
			}
		}
	}
	return {
		...result,
		approvalTicket,
	};
}
