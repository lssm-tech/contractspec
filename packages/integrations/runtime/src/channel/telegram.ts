import { timingSafeEqual } from "node:crypto";

import type { ChannelInboundEvent } from "./types";

export interface TelegramWebhookPayload {
	update_id?: number;
	message?: TelegramMessage;
	edited_message?: TelegramMessage;
	channel_post?: TelegramMessage;
	edited_channel_post?: TelegramMessage;
}

interface TelegramMessage {
	message_id?: number;
	message_thread_id?: number;
	date?: number;
	text?: string;
	chat?: {
		id?: number | string;
		type?: string;
		username?: string;
		title?: string;
	};
	from?: {
		id?: number | string;
		username?: string;
		first_name?: string;
		last_name?: string;
	};
}

export interface TelegramSecretVerificationInput {
	expectedSecretToken: string;
	secretTokenHeader: string | null;
}

export interface TelegramSecretVerificationResult {
	valid: boolean;
	reason?: string;
}

export function verifyTelegramWebhookSecret(
	input: TelegramSecretVerificationInput
): TelegramSecretVerificationResult {
	if (!input.secretTokenHeader) {
		return { valid: false, reason: "missing_secret_token" };
	}

	const expectedBuffer = Buffer.from(input.expectedSecretToken, "utf8");
	const providedBuffer = Buffer.from(input.secretTokenHeader, "utf8");
	if (expectedBuffer.length !== providedBuffer.length) {
		return { valid: false, reason: "secret_length_mismatch" };
	}

	return timingSafeEqual(expectedBuffer, providedBuffer)
		? { valid: true }
		: { valid: false, reason: "secret_mismatch" };
}

export function parseTelegramWebhookPayload(
	rawBody: string
): TelegramWebhookPayload {
	return JSON.parse(rawBody) as TelegramWebhookPayload;
}

export interface NormalizeTelegramEventInput {
	workspaceId: string;
	payload: TelegramWebhookPayload;
	signatureValid: boolean;
	traceId?: string;
	rawBody?: string;
}

export function normalizeTelegramInboundEvent(
	input: NormalizeTelegramEventInput
): ChannelInboundEvent | null {
	const [eventType, message] = getTelegramMessage(input.payload);
	if (!message?.message_id || !message.chat?.id || !message.text) {
		return null;
	}

	const chatId = String(message.chat.id);
	const threadId = message.message_thread_id
		? String(message.message_thread_id)
		: chatId;
	const externalEventId = String(input.payload.update_id ?? message.message_id);
	const occurredAt = message.date ? new Date(message.date * 1000) : new Date();

	return {
		workspaceId: input.workspaceId,
		providerKey: "messaging.telegram",
		externalEventId,
		eventType,
		occurredAt,
		signatureValid: input.signatureValid,
		traceId: input.traceId,
		rawPayload: input.rawBody,
		thread: {
			externalThreadId: threadId,
			externalChannelId: chatId,
			externalUserId:
				message.from?.id != null ? String(message.from.id) : undefined,
		},
		message: {
			text: message.text,
			externalMessageId: String(message.message_id),
		},
		metadata: {
			chatType: message.chat.type ?? "",
			chatUsername: message.chat.username ?? "",
			senderUsername: message.from?.username ?? "",
		},
	};
}

function getTelegramMessage(
	payload: TelegramWebhookPayload
): [string, TelegramMessage | undefined] {
	if (payload.message) {
		return ["telegram.message", payload.message];
	}
	if (payload.edited_message) {
		return ["telegram.edited_message", payload.edited_message];
	}
	if (payload.channel_post) {
		return ["telegram.channel_post", payload.channel_post];
	}
	if (payload.edited_channel_post) {
		return ["telegram.edited_channel_post", payload.edited_channel_post];
	}
	return ["telegram.unknown", undefined];
}
