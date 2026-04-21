import {
	type MetaWhatsappWebhookPayload,
	parseMetaWebhookPayload,
	parseTwilioFormPayload,
	verifyMetaSignature,
	verifyTwilioSignature,
} from '@contractspec/integration.runtime/channel';
import type { BuilderChannelInboundEnvelope } from '@contractspec/lib.builder-runtime';

export {
	type MetaWhatsappWebhookPayload,
	parseMetaWebhookPayload,
	parseTwilioFormPayload,
	verifyMetaSignature,
	verifyTwilioSignature,
};

function toRecord(value: unknown): Record<string, unknown> | null {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: null;
}

function normalizeMetaMessage(
	workspaceId: string,
	conversationId: string,
	participantBindingId: string | undefined,
	phoneNumberId: string | undefined,
	message: Record<string, unknown>
): BuilderChannelInboundEnvelope | null {
	const from = typeof message.from === 'string' ? message.from : undefined;
	const messageId = typeof message.id === 'string' ? message.id : undefined;
	if (!from || !messageId) return null;
	const textBody = toRecord(message.text)?.body;
	const interactive = toRecord(message.interactive);
	const interactiveType =
		typeof interactive?.type === 'string' ? interactive.type : undefined;
	const buttonReply = toRecord(interactive?.button_reply);
	const listReply = toRecord(interactive?.list_reply);
	const audio = toRecord(message.audio);
	const document = toRecord(message.document);
	const image = toRecord(message.image);

	const messageKind = audio
		? 'voice'
		: buttonReply
			? 'button'
			: listReply
				? 'list_selection'
				: 'text';
	return {
		workspaceId,
		conversationId,
		channelType: 'whatsapp',
		eventType: `whatsapp.meta.${typeof message.type === 'string' ? message.type : 'message'}`,
		externalEventId: messageId,
		externalConversationId: from,
		externalChannelId: phoneNumberId,
		externalMessageId: messageId,
		participantBindingId,
		externalIdentityRef: from,
		externalUserId: from,
		messageKind,
		text:
			typeof textBody === 'string'
				? textBody
				: typeof buttonReply?.title === 'string'
					? buttonReply.title
					: typeof listReply?.title === 'string'
						? listReply.title
						: undefined,
		interactiveSelection:
			buttonReply && typeof buttonReply.id === 'string'
				? {
						selectionType: 'button',
						selectionId: buttonReply.id,
						label:
							typeof buttonReply.title === 'string'
								? buttonReply.title
								: undefined,
						payload: { interactiveType },
					}
				: listReply && typeof listReply.id === 'string'
					? {
							selectionType: 'list_selection',
							selectionId: listReply.id,
							label:
								typeof listReply.title === 'string'
									? listReply.title
									: undefined,
							payload: { interactiveType },
						}
					: undefined,
		metadata: {
			phoneNumberId: phoneNumberId ?? '',
			audioId: typeof audio?.id === 'string' ? audio.id : '',
			documentId: typeof document?.id === 'string' ? document.id : '',
			imageId: typeof image?.id === 'string' ? image.id : '',
		},
	};
}

export function normalizeBuilderMetaWhatsappEnvelopes(input: {
	workspaceId: string;
	conversationId: string;
	payload: MetaWhatsappWebhookPayload;
	rawBody?: string;
	traceId?: string;
	participantBindingId?: string;
}): BuilderChannelInboundEnvelope[] {
	const envelopes: BuilderChannelInboundEnvelope[] = [];
	for (const entry of input.payload.entry ?? []) {
		for (const change of entry.changes ?? []) {
			const value = change.value;
			if (!value) continue;
			const phoneNumberId = value.metadata?.phone_number_id;
			for (const message of value.messages ?? []) {
				const envelope = normalizeMetaMessage(
					input.workspaceId,
					input.conversationId,
					input.participantBindingId,
					phoneNumberId,
					message as unknown as Record<string, unknown>
				);
				if (envelope) envelopes.push(envelope);
			}
			for (const status of value.statuses ?? []) {
				if (!status.id) continue;
				envelopes.push({
					workspaceId: input.workspaceId,
					conversationId: input.conversationId,
					channelType: 'whatsapp',
					eventType: 'whatsapp.meta.status',
					externalEventId: status.id,
					externalConversationId: status.recipient_id ?? status.id,
					externalChannelId: phoneNumberId,
					externalMessageId: status.id,
					participantBindingId: input.participantBindingId,
					externalIdentityRef: status.recipient_id ?? undefined,
					externalUserId: status.recipient_id ?? undefined,
					messageKind: 'system',
					statusEvent: {
						status: status.status ?? 'unknown',
						providerMessageId: status.id,
					},
					text: `status ${status.status ?? 'unknown'}`,
				});
			}
		}
	}
	return envelopes;
}

export function normalizeBuilderTwilioWhatsappEnvelope(input: {
	workspaceId: string;
	conversationId: string;
	formBody: URLSearchParams;
	rawBody?: string;
	traceId?: string;
	participantBindingId?: string;
}): BuilderChannelInboundEnvelope | null {
	const messageSid = input.formBody.get('MessageSid');
	const from = input.formBody.get('From');
	if (!messageSid || !from) return null;
	const buttonText = input.formBody.get('ButtonText');
	const buttonPayload = input.formBody.get('ButtonPayload');
	const listTitle =
		input.formBody.get('ListTitle') ?? input.formBody.get('ListSelection');
	const mediaType = input.formBody.get('MediaContentType0');
	const messageKind = buttonText
		? 'button'
		: listTitle
			? 'list_selection'
			: mediaType?.startsWith('audio/')
				? 'voice'
				: 'text';
	return {
		workspaceId: input.workspaceId,
		conversationId: input.conversationId,
		channelType: 'whatsapp',
		eventType: 'whatsapp.twilio.message',
		externalEventId: messageSid,
		externalConversationId: from,
		externalChannelId: input.formBody.get('To') ?? undefined,
		externalMessageId: messageSid,
		participantBindingId: input.participantBindingId,
		externalIdentityRef: from,
		externalUserId: from,
		messageKind,
		text:
			buttonText ??
			listTitle ??
			input.formBody.get('Body') ??
			(mediaType ? `media ${mediaType}` : undefined) ??
			'',
		interactiveSelection: buttonText
			? {
					selectionType: 'button',
					selectionId: buttonPayload ?? buttonText,
					label: buttonText,
				}
			: listTitle
				? {
						selectionType: 'list_selection',
						selectionId: listTitle,
						label: listTitle,
					}
				: undefined,
		metadata: {
			accountSid: input.formBody.get('AccountSid') ?? '',
			profileName: input.formBody.get('ProfileName') ?? '',
			mediaContentType0: mediaType ?? '',
			mediaUrl0: input.formBody.get('MediaUrl0') ?? '',
		},
	};
}
export * from './integration';
