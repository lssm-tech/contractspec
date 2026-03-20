import type {
	MessagingProvider,
	MessagingSendInput,
	MessagingSendResult,
} from "../messaging";

interface TelegramSendResponse {
	ok?: boolean;
	description?: string;
	result?: {
		message_id?: number;
		chat?: {
			id?: number | string;
		};
	};
}

export interface TelegramMessagingProviderOptions {
	botToken: string;
	defaultChatId?: string;
	apiBaseUrl?: string;
}

export class TelegramMessagingProvider implements MessagingProvider {
	private readonly botToken: string;
	private readonly defaultChatId?: string;
	private readonly apiBaseUrl: string;

	constructor(options: TelegramMessagingProviderOptions) {
		this.botToken = options.botToken;
		this.defaultChatId = options.defaultChatId;
		this.apiBaseUrl = options.apiBaseUrl ?? "https://api.telegram.org";
	}

	async sendMessage(input: MessagingSendInput): Promise<MessagingSendResult> {
		const chatId =
			input.channelId ?? input.recipientId ?? this.defaultChatId ?? undefined;
		if (!chatId) {
			throw new Error(
				"Telegram sendMessage requires channelId, recipientId, or defaultChatId."
			);
		}

		const messageThreadId =
			input.threadId && input.threadId !== chatId
				? Number.parseInt(input.threadId, 10)
				: undefined;

		const response = await fetch(
			`${this.apiBaseUrl}/bot${this.botToken}/sendMessage`,
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					chat_id: chatId,
					text: input.text,
					message_thread_id: Number.isFinite(messageThreadId)
						? messageThreadId
						: undefined,
				}),
			}
		);

		const body = (await response.json()) as TelegramSendResponse;
		const providerMessageId = body.result?.message_id;
		if (!response.ok || !body.ok || providerMessageId == null) {
			throw new Error(
				`Telegram sendMessage failed: ${body.description ?? `HTTP_${response.status}`}`
			);
		}

		return {
			id: `telegram:${chatId}:${providerMessageId}`,
			providerMessageId: String(providerMessageId),
			status: "sent",
			sentAt: new Date(),
			metadata: {
				chatId: String(body.result?.chat?.id ?? chatId),
			},
		};
	}
}
