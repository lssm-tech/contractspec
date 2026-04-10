import type {
	BuilderChannelMessage,
	BuilderParticipantBinding,
	BuilderSourceRecord,
	BuilderTranscriptSegment,
	BuilderTrustProfile,
	EvidenceReference,
} from '@contractspec/lib.builder-spec';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import type { BuilderChannelInboundEnvelope } from './types';

export const DEFAULT_APPROVED_LOCALES = ['en', 'fr', 'es', 'de'] as const;
export const OUTBOUND_LOOP_PREFIX = 'builder:outbound:';

export function guessMimeTypeFromPath(path: string): string {
	const normalized = path.toLowerCase();
	if (normalized.endsWith('.json')) return 'application/json';
	if (normalized.endsWith('.yaml') || normalized.endsWith('.yml'))
		return 'application/yaml';
	if (normalized.endsWith('.csv')) return 'text/csv';
	if (normalized.endsWith('.md') || normalized.endsWith('.txt'))
		return 'text/plain';
	if (normalized.endsWith('.pdf')) return 'application/pdf';
	if (normalized.endsWith('.png')) return 'image/png';
	if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg'))
		return 'image/jpeg';
	if (normalized.endsWith('.webp')) return 'image/webp';
	if (normalized.endsWith('.wav')) return 'audio/wav';
	if (normalized.endsWith('.mp3')) return 'audio/mpeg';
	if (normalized.endsWith('.zip')) return 'application/zip';
	return 'application/octet-stream';
}

export function resolveSourceType(
	input: BuilderChannelInboundEnvelope
): BuilderSourceRecord['sourceType'] {
	if (input.channelType === 'web_chat') return 'web_chat_message';
	if (input.messageKind === 'voice') return 'audio_upload';
	if (input.channelType === 'telegram') {
		return input.messageKind === 'button' ||
			input.messageKind === 'list_selection'
			? 'telegram_callback'
			: 'telegram_message';
	}
	if (input.channelType === 'whatsapp') {
		return input.messageKind === 'button' ||
			input.messageKind === 'list_selection'
			? 'whatsapp_interaction'
			: 'whatsapp_message';
	}
	return 'web_chat_message';
}

export function deriveTrustProfile(input: {
	binding?: BuilderParticipantBinding | null;
	override?: BuilderTrustProfile;
	transcriptConfidence?: number;
}): BuilderTrustProfile {
	if (input.override) {
		return {
			...input.override,
			transcriptConfidence:
				input.transcriptConfidence ?? input.override.transcriptConfidence,
		};
	}
	if (!input.binding) {
		return {
			identityAssurance: 'low',
			channelBindingStrength: 'low',
			messageAuthenticity: 'medium',
			transcriptConfidence: input.transcriptConfidence,
			approvalEligible: false,
		};
	}
	return {
		identityAssurance: input.binding.identityAssurance,
		channelBindingStrength: input.binding.channelBindingStrength,
		messageAuthenticity: input.binding.messageAuthenticity,
		transcriptConfidence: input.transcriptConfidence,
		approvalEligible:
			!input.binding.revokedAt && input.binding.allowedActions.length > 0,
		participantBindingId: input.binding.id,
	};
}

export function createMessageEvidence(
	message: BuilderChannelMessage,
	sourceId: string
): EvidenceReference {
	return {
		id: createBuilderId('evidence'),
		workspaceId: message.workspaceId,
		sourceId,
		kind: 'message',
		label: `${message.channelType} ${message.messageKind}`,
		uri: `builder://message/${message.id}`,
		confidence:
			message.trustProfile?.messageAuthenticity === 'high'
				? 1
				: message.trustProfile?.messageAuthenticity === 'medium'
					? 0.75
					: 0.5,
	};
}

export function createTranscriptEvidence(
	segment: BuilderTranscriptSegment
): EvidenceReference {
	return {
		id: createBuilderId('evidence'),
		workspaceId: segment.workspaceId,
		sourceId: segment.sourceId,
		kind: 'transcript',
		partId: segment.id,
		label: `Transcript ${segment.id}`,
		uri: `builder://transcript/${segment.id}`,
		confidence: segment.confidence,
	};
}

export async function resolveReplayState(input: {
	store: import('../stores/store').BuilderStore;
	envelope: BuilderChannelInboundEnvelope;
}) {
	const { store, envelope } = input;
	const [messages, sources] = await Promise.all([
		store.listChannelMessages(envelope.conversationId),
		store.listSources(envelope.workspaceId),
	]);
	const messageHistory = messages
		.filter(
			(message) =>
				message.channelType === envelope.channelType &&
				message.externalConversationId === envelope.externalConversationId &&
				message.externalMessageId === envelope.externalMessageId
		)
		.sort((left, right) => left.receivedAt.localeCompare(right.receivedAt));
	const sourceHistory = sources
		.filter(
			(source) =>
				source.conversationId === envelope.conversationId &&
				source.channelType === envelope.channelType &&
				source.provenance.externalConversationId ===
					envelope.externalConversationId &&
				source.provenance.externalMessageId === envelope.externalMessageId
		)
		.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
	const exactMessage = messageHistory.find(
		(message) =>
			(message.messageRevision ?? 0) === (envelope.messageRevision ?? 0) &&
			(message.eventType ?? '') === (envelope.eventType ?? '') &&
			(message.editedAt ?? '') === (envelope.editedAt ?? '') &&
			(message.deletedAt ?? '') === (envelope.deletedAt ?? '')
	);
	const exactSource = sourceHistory.find(
		(source) =>
			(source.provenance.editVersion ?? 0) === (envelope.messageRevision ?? 0)
	);
	const latestMessage = messageHistory.at(-1);
	const latestSource = sourceHistory.at(-1);
	const shouldSupersede =
		latestMessage != null &&
		((envelope.messageRevision ?? 0) > (latestMessage.messageRevision ?? 0) ||
			Boolean(envelope.editedAt) ||
			Boolean(envelope.deletedAt));
	return {
		exactMessage,
		exactSource,
		latestMessage,
		latestSource,
		shouldSupersede,
	};
}

export function createChannelMessage(input: {
	envelope: BuilderChannelInboundEnvelope;
	sourceId: string;
	trustProfile: BuilderTrustProfile;
	now?: () => Date;
	fallbackSupersedesMessageId?: string;
}): BuilderChannelMessage {
	const receivedAt =
		input.envelope.deletedAt ?? input.envelope.editedAt ?? isoNow(input.now);
	return {
		id: createBuilderId('message'),
		workspaceId: input.envelope.workspaceId,
		conversationId: input.envelope.conversationId,
		channelType: input.envelope.channelType,
		direction: 'inbound',
		eventType: input.envelope.eventType,
		externalEventId: input.envelope.externalEventId,
		externalConversationId: input.envelope.externalConversationId,
		externalChannelId: input.envelope.externalChannelId,
		externalMessageId: input.envelope.externalMessageId,
		externalUserId: input.envelope.externalUserId,
		participantBindingId: input.envelope.participantBindingId,
		messageKind: input.envelope.messageKind,
		contentRef:
			input.envelope.text ??
			input.envelope.file?.filename ??
			input.envelope.interactiveSelection?.label ??
			'builder://message/empty',
		directiveCandidates: [],
		attachmentSourceIds: input.envelope.file ? [input.sourceId] : [],
		replyToExternalMessageId: input.envelope.replyToExternalMessageId,
		messageRevision: input.envelope.messageRevision,
		supersedesMessageId:
			input.envelope.supersedesMessageId ?? input.fallbackSupersedesMessageId,
		interactiveSelection: input.envelope.interactiveSelection,
		outboundTag: input.envelope.outboundTag,
		trustProfile: input.trustProfile,
		receivedAt,
		editedAt: input.envelope.editedAt,
		deletedAt: input.envelope.deletedAt,
	};
}
