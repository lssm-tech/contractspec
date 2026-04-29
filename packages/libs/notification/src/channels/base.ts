import type {
	ChannelDeliveryResult,
	ChannelNotification,
	NotificationChannel,
} from './types';

export class InAppChannel implements NotificationChannel {
	readonly channelId = 'IN_APP';

	async send(
		_notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		return {
			success: true,
			responseMessage: 'Stored in database',
		};
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export class ConsoleChannel implements NotificationChannel {
	readonly channelId = 'CONSOLE';

	async send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		console.log(`[${notification.id}] ${notification.title}`);
		console.log(notification.body);
		if (notification.actionUrl) {
			console.log(`Action: ${notification.actionUrl}`);
		}
		return {
			success: true,
			responseMessage: 'Logged to console',
		};
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export abstract class PushChannel implements NotificationChannel {
	readonly channelId = 'PUSH';

	abstract send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult>;

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export class WebhookChannel implements NotificationChannel {
	readonly channelId = 'WEBHOOK';
	private readonly locale?: string;

	constructor(options?: { locale?: string }) {
		this.locale = options?.locale;
	}

	async send(
		notification: ChannelNotification
	): Promise<ChannelDeliveryResult> {
		if (!notification.webhook?.url) {
			const { createNotificationsI18n } = await import('../i18n/messages');
			const i18n = createNotificationsI18n(this.locale);
			return {
				success: false,
				responseMessage: i18n.t('channel.webhook.noUrl'),
			};
		}

		try {
			const response = await fetch(notification.webhook.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...notification.webhook.headers,
				},
				body: JSON.stringify({
					id: notification.id,
					title: notification.title,
					body: notification.body,
					actionUrl: notification.actionUrl,
					metadata: notification.metadata,
				}),
			});

			return {
				success: response.ok,
				responseCode: String(response.status),
				responseMessage: response.statusText,
			};
		} catch (error) {
			return {
				success: false,
				responseMessage:
					error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	async isAvailable(): Promise<boolean> {
		return true;
	}
}

export class ChannelRegistry {
	private channels = new Map<string, NotificationChannel>();

	register(channel: NotificationChannel): void {
		this.channels.set(channel.channelId, channel);
	}

	get(channelId: string): NotificationChannel | undefined {
		return this.channels.get(channelId);
	}

	getAll(): NotificationChannel[] {
		return Array.from(this.channels.values());
	}

	async getAvailable(): Promise<NotificationChannel[]> {
		const available: NotificationChannel[] = [];
		for (const channel of this.channels.values()) {
			if (await channel.isAvailable()) {
				available.push(channel);
			}
		}
		return available;
	}
}

export function createChannelRegistry(options?: {
	locale?: string;
	channels?: NotificationChannel[];
}): ChannelRegistry {
	const registry = new ChannelRegistry();
	registry.register(new InAppChannel());
	registry.register(new ConsoleChannel());
	registry.register(new WebhookChannel({ locale: options?.locale }));

	for (const channel of options?.channels ?? []) {
		registry.register(channel);
	}

	return registry;
}
