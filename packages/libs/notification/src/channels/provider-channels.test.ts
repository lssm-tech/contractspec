import { describe, expect, it } from 'bun:test';
import {
	ProviderEmailChannel,
	ProviderSmsChannel,
	TelegramChannel,
	WhatsappChannel,
} from './provider-channels';

describe('provider-backed notification channels', () => {
	it('maps email delivery results', async () => {
		const channel = new ProviderEmailChannel(
			{
				sendEmail: async () => ({
					id: 'mail-1',
					providerMessageId: 'provider-mail-1',
				}),
			},
			{ defaultFrom: { email: 'noreply@example.com', name: 'Notifier' } }
		);

		const result = await channel.send({
			id: 'notif-1',
			userId: 'user-1',
			title: 'Welcome',
			body: 'Hello there',
			email: {
				to: [{ email: 'alice@example.com', name: 'Alice' }],
				subject: 'Welcome aboard',
			},
		});

		expect(result.success).toBe(true);
		expect(result.externalId).toBe('provider-mail-1');
	});

	it('maps sms delivery failures', async () => {
		const channel = new ProviderSmsChannel({
			sendSms: async () => ({
				id: 'sms-1',
				status: 'failed',
				errorMessage: 'carrier rejected',
			}),
		});

		const result = await channel.send({
			id: 'notif-2',
			userId: 'user-1',
			title: 'Urgent',
			body: 'Call back',
			sms: {
				to: '+15551234567',
			},
		});

		expect(result.success).toBe(false);
		expect(result.responseCode).toBe('failed');
	});

	it('maps telegram delivery with thread metadata', async () => {
		const channel = new TelegramChannel({
			sendMessage: async () => ({
				id: 'tg-1',
				providerMessageId: '101',
				status: 'sent',
			}),
		});

		const result = await channel.send({
			id: 'notif-3',
			userId: 'user-1',
			title: 'Review requested',
			body: 'Please review',
			telegram: {
				channelId: '-10042',
				threadId: '17',
				markdown: true,
			},
		});

		expect(result.success).toBe(true);
		expect(result.externalId).toBe('101');
	});

	it('maps whatsapp delivery', async () => {
		const channel = new WhatsappChannel({
			sendMessage: async () => ({
				id: 'wa-1',
				providerMessageId: 'wamid.123',
				status: 'delivered',
			}),
		});

		const result = await channel.send({
			id: 'notif-4',
			userId: 'user-1',
			title: 'Reply',
			body: 'Thanks',
			whatsapp: {
				recipientId: '15550001',
			},
		});

		expect(result.success).toBe(true);
		expect(result.externalId).toBe('wamid.123');
	});
});
