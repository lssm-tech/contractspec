import { describe, expect, it } from 'bun:test';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import type { SupportTicket } from '../types';
import { TicketClassifier } from './classifier';

function createMockLlm(responseText: string): LLMProvider {
	return {
		async chat() {
			return {
				message: {
					role: 'assistant',
					content: [{ type: 'text', text: responseText }],
				},
			};
		},
		async *stream() {},
		async countTokens() {
			return { promptTokens: 0 };
		},
	};
}

describe('TicketClassifier', () => {
	it('classifies locale-specific tickets heuristically', async () => {
		const classifier = new TicketClassifier({ locale: 'fr' });
		const ticket: SupportTicket = {
			id: 'ticket-1',
			subject: 'Probleme de facturation',
			body: 'Je souhaite un remboursement urgent.',
			channel: 'email',
		};

		const result = await classifier.classify(ticket);

		expect(result.category).toBe('billing');
		expect(result.priority).toBe('urgent');
		expect(result.intents).toContain('refund');
	});

	it('merges valid LLM overrides and clamps confidence', async () => {
		const classifier = new TicketClassifier({
			llm: createMockLlm(
				JSON.stringify({
					category: 'technical',
					priority: 'high',
					sentiment: 'negative',
					intents: ['bug-report'],
					tags: ['bug'],
					confidence: 1.4,
					escalationRequired: true,
				})
			),
		});

		const result = await classifier.classify({
			id: 'ticket-2',
			subject: 'Refund request',
			body: 'I saw an error and need help.',
			channel: 'chat',
		});

		expect(result.category).toBe('technical');
		expect(result.priority).toBe('high');
		expect(result.sentiment).toBe('negative');
		expect(result.intents).toEqual(['bug-report']);
		expect(result.tags).toEqual(['bug']);
		expect(result.confidence).toBe(1);
		expect(result.escalationRequired).toBe(true);
	});

	it('falls back to heuristics when LLM JSON is invalid', async () => {
		const classifier = new TicketClassifier({
			llm: createMockLlm(
				JSON.stringify({
					category: 'unknown',
					priority: 'extreme',
				})
			),
		});

		const result = await classifier.classify({
			id: 'ticket-3',
			subject: 'Refund request',
			body: 'Please process this refund immediately.',
			channel: 'portal',
		});

		expect(result.category).toBe('billing');
		expect(result.priority).toBe('urgent');
		expect(result.intents).toContain('refund');
	});
});
