import type {
	ChannelDeliveryResult,
	ChannelNotification,
	NotificationChannel,
	NotificationEmailAddress,
	NotificationEmailProvider,
	NotificationMessagingProvider,
	NotificationSmsProvider,
} from './types';

export class ProviderEmailChannel implements NotificationChannel {
	readonly channelId = 'EMAIL';

	constructor(
		private readonly provider: NotificationEmailProvider,
		private readonly options?: { defaultFrom?: NotificationEmailAddress }
	) {}

	async send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		const to = notification.email?.to;
		if (!to?.length) {
			return failure('Email notifications require email.to recipients.');
		}

		const from = notification.email?.from ?? this.options?.defaultFrom;
		if (!from) {
			return failure(
				'Email notifications require email.from or a channel defaultFrom.'
			);
		}

		try {
			const response = await this.provider.sendEmail({
				from,
				to,
				cc: notification.email?.cc,
				bcc: notification.email?.bcc,
				replyTo: notification.email?.replyTo,
				subject: notification.email?.subject ?? notification.title,
				textBody: notification.email?.text ?? notification.body,
				htmlBody: notification.email?.html,
				headers: notification.email?.headers,
				attachments: notification.email?.attachments,
				metadata: stringifyMetadata(notification.metadata),
			});

			return success(response.providerMessageId ?? response.id);
		} catch (error) {
			return failure(error);
		}
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export class ProviderSmsChannel implements NotificationChannel {
	readonly channelId = 'SMS';

	constructor(private readonly provider: NotificationSmsProvider) {}

	async send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		const to = notification.sms?.to;
		if (!to) {
			return failure('SMS notifications require sms.to.');
		}

		try {
			const response = await this.provider.sendSms({
				to,
				from: notification.sms?.from,
				body: notification.sms?.body ?? notification.body,
				metadata: stringifyMetadata(notification.metadata),
			});

			return {
				success:
					response.status !== 'failed' && response.status !== 'undelivered',
				externalId: response.id,
				responseCode: response.status,
				responseMessage: response.errorMessage,
			};
		} catch (error) {
			return failure(error);
		}
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export class TelegramChannel implements NotificationChannel {
	readonly channelId = 'TELEGRAM';

	constructor(private readonly provider: NotificationMessagingProvider) {}

	async send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		const channel = notification.telegram;
		if (!channel?.channelId && !channel?.recipientId) {
			return failure(
				'Telegram notifications require telegram.channelId or telegram.recipientId.'
			);
		}

		return sendMessagingNotification(this.provider, channel, notification);
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export class WhatsappChannel implements NotificationChannel {
	readonly channelId = 'WHATSAPP';

	constructor(private readonly provider: NotificationMessagingProvider) {}

	async send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		const channel = notification.whatsapp;
		if (!channel?.channelId && !channel?.recipientId) {
			return failure(
				'WhatsApp notifications require whatsapp.channelId or whatsapp.recipientId.'
			);
		}

		return sendMessagingNotification(this.provider, channel, notification);
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

async function sendMessagingNotification(
	provider: NotificationMessagingProvider,
	channel:
		| ChannelNotification['telegram']
		| ChannelNotification['whatsapp']
		| undefined,
	notification: ChannelNotification
): Promise<ChannelDeliveryResult> {
	try {
		const response = await provider.sendMessage({
			recipientId: channel?.recipientId,
			channelId: channel?.channelId,
			threadId: channel?.threadId,
			text: channel?.text ?? notification.body,
			markdown: channel?.markdown,
			metadata: stringifyMetadata(notification.metadata),
		});

		return {
			success: response.status !== 'failed',
			externalId: response.providerMessageId ?? response.id,
			responseCode: response.status,
			responseMessage: response.errorMessage,
		};
	} catch (error) {
		return failure(error);
	}
}

function stringifyMetadata(
	metadata?: Record<string, unknown>
): Record<string, string> | undefined {
	if (!metadata) return undefined;
	return Object.fromEntries(
		Object.entries(metadata).map(([key, value]) => [key, String(value)])
	);
}

function success(externalId?: string): ChannelDeliveryResult {
	return {
		success: true,
		externalId,
	};
}

function failure(error: unknown): ChannelDeliveryResult {
	return {
		success: false,
		responseMessage: error instanceof Error ? error.message : String(error),
	};
}
