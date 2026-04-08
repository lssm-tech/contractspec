import { describe, expect, it } from 'bun:test';
import { normalizeBuilderTelegramEnvelope } from '.';

describe('builder telegram integration', () => {
	it('maps telegram webhook payloads to Builder envelopes', () => {
		const envelope = normalizeBuilderTelegramEnvelope({
			workspaceId: 'ws_1',
			conversationId: 'conv_1',
			payload: {
				update_id: 1,
				message: {
					message_id: 2,
					text: 'Need an approval dashboard',
					chat: { id: 3 },
				},
			},
		});

		expect(envelope?.channelType).toBe('telegram');
		expect(envelope?.text).toContain('approval dashboard');
		expect(envelope?.externalChannelId).toBe('3');
	});

	it('maps telegram callback queries to structured Builder selections', () => {
		const envelope = normalizeBuilderTelegramEnvelope({
			workspaceId: 'ws_1',
			conversationId: 'conv_1',
			payload: {
				update_id: 10,
				callback_query: {
					id: 'cb_1',
					data: 'approve:surface',
					message: {
						message_id: 11,
						text: 'Approve change?',
						chat: { id: 3 },
					},
				},
			} as never,
		});

		expect(envelope?.messageKind).toBe('button');
		expect(envelope?.interactiveSelection?.selectionId).toBe('cb_1');
		expect(envelope?.eventType).toBe('telegram.callback_query');
	});
});
