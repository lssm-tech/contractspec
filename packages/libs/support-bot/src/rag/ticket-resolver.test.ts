import { describe, expect, it } from 'bun:test';
import type { KnowledgeAnswer } from '@contractspec/lib.knowledge/query/service';
import type { SupportTicket } from '../types';
import { TicketResolver } from './ticket-resolver';

const ticket: SupportTicket = {
	id: 'ticket-1',
	subject: 'Account access',
	body: 'I cannot access my account after resetting my password.',
	channel: 'chat',
	customerName: 'Alex',
};

function createResolver(answer: KnowledgeAnswer, minConfidence?: number) {
	return new TicketResolver({
		knowledge: {
			async query() {
				return answer;
			},
		},
		minConfidence,
	});
}

describe('TicketResolver', () => {
	it('responds when confidence is sufficient', async () => {
		const resolver = createResolver({
			answer: 'Follow the password reset steps in the linked guide.',
			references: [
				{
					id: 'doc-1',
					score: 0.9,
					payload: {
						title: 'Password reset guide',
						url: 'https://example.test/reset',
						text: 'Reset your password from the account page.',
					},
				},
			],
			usage: {
				promptTokens: 10,
				completionTokens: 50,
				totalTokens: 60,
			},
		});

		const resolution = await resolver.resolve(ticket);

		expect(resolution.actions).toEqual([
			{ type: 'respond', label: 'Send automated response' },
		]);
		expect(resolution.escalationReason).toBeUndefined();
		expect(resolution.citations).toHaveLength(1);
	});

	it('escalates when confidence is below threshold', async () => {
		const resolver = createResolver({
			answer: 'Try again later.',
			references: [
				{ id: 'doc-2', score: 0.45, payload: { text: 'retry later' } },
			],
			usage: {
				promptTokens: 10,
				completionTokens: 100,
				totalTokens: 110,
			},
		});

		const resolution = await resolver.resolve(ticket);

		expect(resolution.actions).toEqual([
			{ type: 'escalate', label: 'Escalate for human review' },
		]);
		expect(resolution.escalationReason).toBe(
			'Insufficient confidence or missing knowledge references'
		);
		expect(resolution.knowledgeUpdates).toEqual([ticket.body]);
	});

	it('escalates when references are missing', async () => {
		const resolver = createResolver({
			answer: 'We could not find matching knowledge.',
			references: [],
		});

		const resolution = await resolver.resolve(ticket);

		expect(resolution.actions).toEqual([
			{ type: 'escalate', label: 'Escalate for human review' },
		]);
		expect(resolution.citations).toEqual([]);
	});
});
