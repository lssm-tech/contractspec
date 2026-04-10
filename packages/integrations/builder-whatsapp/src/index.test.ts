import { describe, expect, it } from 'bun:test';
import {
	normalizeBuilderMetaWhatsappEnvelopes,
	normalizeBuilderTwilioWhatsappEnvelope,
} from '.';

describe('builder whatsapp integration', () => {
	it('maps twilio form payloads to Builder envelopes', () => {
		const formBody = new URLSearchParams({
			AccountSid: 'AC123',
			Body: 'Need a mobile-first manager dashboard',
			MessageSid: 'SM123',
			From: 'whatsapp:+123',
		});

		const envelope = normalizeBuilderTwilioWhatsappEnvelope({
			workspaceId: 'ws_1',
			conversationId: 'conv_1',
			formBody,
		});

		expect(envelope?.channelType).toBe('whatsapp');
		expect(envelope?.text).toContain('mobile-first');
		expect(envelope?.externalUserId).toBe('whatsapp:+123');
	});

	it('maps meta interactive replies and statuses to Builder envelopes', () => {
		const envelopes = normalizeBuilderMetaWhatsappEnvelopes({
			workspaceId: 'ws_1',
			conversationId: 'conv_1',
			payload: {
				entry: [
					{
						changes: [
							{
								value: {
									metadata: { phone_number_id: 'pn_1' },
									messages: [
										{
											id: 'wamid.1',
											from: '15550001',
											type: 'interactive',
											interactive: {
												type: 'button_reply',
												button_reply: {
													id: 'approve_1',
													title: 'Approve',
												},
											},
										},
									],
									statuses: [
										{
											id: 'wamid.status',
											recipient_id: '15550001',
											status: 'read',
										},
									],
								},
							},
						],
					},
				],
			} as never,
		});

		expect(envelopes[0]?.messageKind).toBe('button');
		expect(envelopes[0]?.interactiveSelection?.selectionId).toBe('approve_1');
		expect(envelopes[1]?.messageKind).toBe('system');
		expect(envelopes[1]?.statusEvent?.status).toBe('read');
	});
});
