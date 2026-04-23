export interface NotificationEmailAddress {
	email: string;
	name?: string;
}

export interface NotificationEmailAttachment {
	id: string;
	filename: string;
	contentType: string;
	sizeBytes?: number;
	data?: Uint8Array;
	downloadUrl?: string;
}

export interface ChannelNotification {
	id: string;
	userId: string;
	title: string;
	body: string;
	actionUrl?: string;
	imageUrl?: string;
	metadata?: Record<string, unknown>;
	email?: {
		to: NotificationEmailAddress[];
		from?: NotificationEmailAddress;
		cc?: NotificationEmailAddress[];
		bcc?: NotificationEmailAddress[];
		replyTo?: NotificationEmailAddress;
		subject?: string;
		html?: string;
		text?: string;
		headers?: Record<string, string>;
		attachments?: NotificationEmailAttachment[];
	};
	sms?: {
		to: string;
		from?: string;
		body?: string;
	};
	telegram?: {
		recipientId?: string;
		channelId?: string;
		threadId?: string;
		text?: string;
		markdown?: boolean;
	};
	whatsapp?: {
		recipientId?: string;
		channelId?: string;
		threadId?: string;
		text?: string;
		markdown?: boolean;
	};
	push?: {
		token: string;
		badge?: number;
		sound?: string;
		data?: Record<string, unknown>;
	};
	webhook?: {
		url: string;
		headers?: Record<string, string>;
	};
}

export interface ChannelDeliveryResult {
	success: boolean;
	externalId?: string;
	responseCode?: string;
	responseMessage?: string;
	metadata?: Record<string, unknown>;
}

export interface NotificationChannel {
	readonly channelId: string;
	send(notification: ChannelNotification): Promise<ChannelDeliveryResult>;
	isAvailable(): Promise<boolean>;
}

export interface NotificationEmailProvider {
	sendEmail(message: {
		from: NotificationEmailAddress;
		to: NotificationEmailAddress[];
		cc?: NotificationEmailAddress[];
		bcc?: NotificationEmailAddress[];
		replyTo?: NotificationEmailAddress;
		subject: string;
		textBody?: string;
		htmlBody?: string;
		headers?: Record<string, string>;
		attachments?: NotificationEmailAttachment[];
		metadata?: Record<string, string>;
	}): Promise<{ id: string; providerMessageId?: string }>;
}

export interface NotificationSmsProvider {
	sendSms(input: {
		to: string;
		from?: string;
		body: string;
		metadata?: Record<string, string>;
	}): Promise<{
		id: string;
		status:
			| 'queued'
			| 'sending'
			| 'sent'
			| 'delivered'
			| 'undelivered'
			| 'failed';
		errorCode?: string;
		errorMessage?: string;
	}>;
}

export interface NotificationMessagingProvider {
	sendMessage(input: {
		recipientId?: string;
		channelId?: string;
		threadId?: string;
		text: string;
		markdown?: boolean;
		metadata?: Record<string, string>;
	}): Promise<{
		id: string;
		providerMessageId?: string;
		status: 'queued' | 'sending' | 'sent' | 'delivered' | 'failed';
		errorCode?: string;
		errorMessage?: string;
	}>;
}
