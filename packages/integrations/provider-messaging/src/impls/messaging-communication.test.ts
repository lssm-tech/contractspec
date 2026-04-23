import { afterEach, beforeEach, describe, expect, it, vi } from 'bun:test';
import { TelegramMessagingProvider } from './messaging-telegram';
import { MetaWhatsappMessagingProvider } from './messaging-whatsapp-meta';
import { TwilioWhatsappMessagingProvider } from './messaging-whatsapp-twilio';

describe('communication messaging providers', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		globalThis.fetch = vi.fn() as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('sends and updates Telegram messages with markdown support', async () => {
		const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
		fetchMock
			.mockResolvedValueOnce(
				createJsonResponse({
					ok: true,
					result: { message_id: 101, chat: { id: '-10042' } },
				})
			)
			.mockResolvedValueOnce(
				createJsonResponse({
					ok: true,
					result: { message_id: 101, chat: { id: '-10042' } },
				})
			);

		const provider = new TelegramMessagingProvider({
			botToken: 'bot-token',
			defaultChatId: '-10042',
		});

		const sent = await provider.sendMessage({
			text: '*hello*',
			threadId: '17',
			markdown: true,
		});
		const updated = await provider.updateMessage?.('101', {
			channelId: '-10042',
			text: '*updated*',
			markdown: true,
		});

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock.mock.calls[0]?.[0]).toContain('/sendMessage');
		expect(fetchMock.mock.calls[1]?.[0]).toContain('/editMessageText');
		expect(fetchMock.mock.calls[0]?.[1]?.body).toContain(
			'"parse_mode":"Markdown"'
		);
		expect(fetchMock.mock.calls[1]?.[1]?.body).toContain('"message_id":101');
		expect(sent.providerMessageId).toBe('101');
		expect(updated?.providerMessageId).toBe('101');
	});

	it('sends Meta WhatsApp messages', async () => {
		const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
		fetchMock.mockResolvedValueOnce(
			createJsonResponse({
				messages: [{ id: 'wamid.123' }],
			})
		);

		const provider = new MetaWhatsappMessagingProvider({
			accessToken: 'meta-token',
			phoneNumberId: 'phone-number-id',
		});

		const result = await provider.sendMessage({
			recipientId: '15550001',
			text: 'hello from meta',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0]?.[0]).toContain('/phone-number-id/messages');
		expect(result.providerMessageId).toBe('wamid.123');
	});

	it('sends Twilio WhatsApp messages with normalized addresses', async () => {
		const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
		fetchMock.mockResolvedValueOnce(
			createJsonResponse({
				sid: 'SM999',
				status: 'queued',
			})
		);

		const provider = new TwilioWhatsappMessagingProvider({
			accountSid: 'AC123',
			authToken: 'auth-token',
			fromNumber: 'whatsapp:+15551234567',
		});

		const result = await provider.sendMessage({
			recipientId: '+15557654321',
			text: 'hello from twilio',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0]?.[1]?.body).toContain(
			'To=whatsapp%3A%2B15557654321'
		);
		expect(result.providerMessageId).toBe('SM999');
		expect(result.status).toBe('queued');
	});
});

function createJsonResponse(body: unknown, status = 200): Response {
	return {
		ok: status >= 200 && status < 300,
		status,
		async json() {
			return body;
		},
	} as Response;
}
