import {
	parseTelegramWebhookPayload,
	type TelegramWebhookPayload,
	verifyTelegramWebhookSecret,
} from '@contractspec/integration.runtime/channel';
import type { BuilderChannelInboundEnvelope } from '@contractspec/lib.builder-runtime';

export {
	parseTelegramWebhookPayload,
	type TelegramWebhookPayload,
	verifyTelegramWebhookSecret,
};

interface TelegramCallbackQuery {
	id?: string;
	data?: string;
	from?: { id?: number | string; username?: string };
	message?: {
		message_id?: number;
		message_thread_id?: number;
		date?: number;
		text?: string;
		chat?: {
			id?: number | string;
			username?: string;
		};
		reply_to_message?: { message_id?: number };
	};
}

interface BuilderTelegramMessageShape {
	message_id?: number;
	message_thread_id?: number;
	date?: number;
	text?: string;
	from?: {
		id?: number | string;
		username?: string;
	};
	chat?: {
		id?: number | string;
		username?: string;
	};
	reply_to_message?: { message_id?: number };
}

function toRecord(value: unknown): Record<string, unknown> | null {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: null;
}

function getCallbackQuery(
	payload: TelegramWebhookPayload
): TelegramCallbackQuery | null {
	const record = toRecord(payload);
	const callback = toRecord(record?.callback_query);
	if (!callback) return null;
	const message = toRecord(callback.message);
	const chat = toRecord(message?.chat);
	const from = toRecord(callback.from);
	const reply = toRecord(message?.reply_to_message);
	return {
		id: typeof callback.id === 'string' ? callback.id : undefined,
		data: typeof callback.data === 'string' ? callback.data : undefined,
		from: {
			id:
				typeof from?.id === 'string' || typeof from?.id === 'number'
					? (from.id as string | number)
					: undefined,
			username: typeof from?.username === 'string' ? from.username : undefined,
		},
		message: {
			message_id:
				typeof message?.message_id === 'number'
					? message.message_id
					: undefined,
			message_thread_id:
				typeof message?.message_thread_id === 'number'
					? message.message_thread_id
					: undefined,
			date: typeof message?.date === 'number' ? message.date : undefined,
			text: typeof message?.text === 'string' ? message.text : undefined,
			chat: {
				id:
					typeof chat?.id === 'string' || typeof chat?.id === 'number'
						? (chat.id as string | number)
						: undefined,
				username:
					typeof chat?.username === 'string' ? chat.username : undefined,
			},
			reply_to_message: {
				message_id:
					typeof reply?.message_id === 'number' ? reply.message_id : undefined,
			},
		},
	};
}

function normalizeTelegramMessage(
	message: unknown
): BuilderTelegramMessageShape | null {
	const record = toRecord(message);
	if (!record) return null;
	const chat = toRecord(record.chat);
	const reply = toRecord(record.reply_to_message);
	const from = toRecord(record.from);
	return {
		message_id:
			typeof record.message_id === 'number' ? record.message_id : undefined,
		message_thread_id:
			typeof record.message_thread_id === 'number'
				? record.message_thread_id
				: undefined,
		date: typeof record.date === 'number' ? record.date : undefined,
		text: typeof record.text === 'string' ? record.text : undefined,
		from: {
			id:
				typeof from?.id === 'string' || typeof from?.id === 'number'
					? (from.id as string | number)
					: undefined,
			username: typeof from?.username === 'string' ? from.username : undefined,
		},
		chat: {
			id:
				typeof chat?.id === 'string' || typeof chat?.id === 'number'
					? (chat.id as string | number)
					: undefined,
			username: typeof chat?.username === 'string' ? chat.username : undefined,
		},
		reply_to_message: {
			message_id:
				typeof reply?.message_id === 'number' ? reply.message_id : undefined,
		},
	};
}

function resolveTelegramMessage(payload: TelegramWebhookPayload) {
	if (payload.message) {
		return {
			eventType: 'telegram.message',
			message: normalizeTelegramMessage(payload.message),
			senderId:
				payload.message.from?.id != null
					? String(payload.message.from.id)
					: undefined,
			messageKind: 'text' as const,
			editedAt: undefined,
			deletedAt: undefined,
			interactiveSelection: undefined,
		};
	}
	if (payload.edited_message) {
		return {
			eventType: 'telegram.edited_message',
			message: normalizeTelegramMessage(payload.edited_message),
			senderId:
				payload.edited_message.from?.id != null
					? String(payload.edited_message.from.id)
					: undefined,
			messageKind: 'text' as const,
			editedAt: new Date(
				(payload.edited_message.date ?? Math.floor(Date.now() / 1000)) * 1000
			).toISOString(),
			deletedAt: undefined,
			interactiveSelection: undefined,
		};
	}
	const callback = getCallbackQuery(payload);
	if (callback?.message) {
		return {
			eventType: 'telegram.callback_query',
			message: callback.message,
			senderId:
				callback.from?.id != null ? String(callback.from.id) : undefined,
			messageKind: 'button' as const,
			editedAt: undefined,
			deletedAt: undefined,
			interactiveSelection: callback.data
				? {
						selectionType: 'callback' as const,
						selectionId: callback.id ?? callback.data,
						label: callback.data,
						payload: { data: callback.data },
					}
				: undefined,
		};
	}
	return null;
}

export function normalizeBuilderTelegramEnvelope(input: {
	workspaceId: string;
	conversationId: string;
	payload: TelegramWebhookPayload;
	rawBody?: string;
	traceId?: string;
	participantBindingId?: string;
}): BuilderChannelInboundEnvelope | null {
	const resolved = resolveTelegramMessage(input.payload);
	if (!resolved?.message?.message_id || !resolved.message.chat?.id) {
		return null;
	}

	const chatId = String(resolved.message.chat.id);
	const threadId = resolved.message.message_thread_id
		? String(resolved.message.message_thread_id)
		: chatId;
	const externalMessageId = String(resolved.message.message_id);
	return {
		workspaceId: input.workspaceId,
		conversationId: input.conversationId,
		channelType: 'telegram',
		eventType: resolved.eventType,
		externalEventId: String(
			input.payload.update_id ??
				resolved.interactiveSelection?.selectionId ??
				externalMessageId
		),
		externalConversationId: threadId,
		externalChannelId: chatId,
		externalMessageId,
		participantBindingId: input.participantBindingId,
		externalIdentityRef: chatId,
		externalUserId: resolved.senderId,
		messageKind: resolved.messageKind,
		text: resolved.message.text,
		replyToExternalMessageId: resolved.message.reply_to_message?.message_id
			? String(resolved.message.reply_to_message.message_id)
			: undefined,
		messageRevision: resolved.eventType === 'telegram.edited_message' ? 2 : 1,
		interactiveSelection: resolved.interactiveSelection,
		editedAt: resolved.editedAt,
		deletedAt: resolved.deletedAt,
		metadata: {
			rawBody: input.rawBody ?? '',
			traceId: input.traceId ?? '',
		},
	};
}
