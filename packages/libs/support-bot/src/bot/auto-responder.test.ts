import { describe, expect, it } from 'bun:test';
import type {
	LLMChatOptions,
	LLMMessage,
	LLMProvider,
} from '@contractspec/lib.contracts-integrations';
import { createSupportBotI18n } from '../i18n';
import type {
	SupportResolution,
	SupportTicket,
	TicketClassification,
} from '../types';
import { AutoResponder } from './auto-responder';

const ticket: SupportTicket = {
	id: 'ticket-1',
	subject: 'Probleme de facturation',
	body: 'Je souhaite un remboursement urgent.',
	channel: 'email',
	customerName: 'Marie',
};

const classification: TicketClassification = {
	ticketId: ticket.id,
	category: 'billing',
	priority: 'urgent',
	sentiment: 'frustrated',
	intents: ['refund'],
	tags: ['refund'],
	confidence: 0.86,
};

const resolution: SupportResolution = {
	ticketId: ticket.id,
	answer: 'Nous avons traite votre demande de remboursement.',
	confidence: 0.88,
	citations: [
		{ label: 'Politique de remboursement', url: 'https://example.test' },
	],
	actions: [{ type: 'respond', label: 'Send automated response' }],
};

function createMockLlm(responseText: string) {
	const calls: { messages: LLMMessage[]; options?: LLMChatOptions }[] = [];
	const llm: LLMProvider = {
		async chat(messages, options) {
			calls.push({ messages, options });
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

	return {
		llm,
		calls,
	};
}

describe('AutoResponder', () => {
	it('localizes reply subjects through i18n', async () => {
		const responder = new AutoResponder({ locale: 'fr' });
		const draft = await responder.draft(ticket, resolution, classification);

		expect(draft.subject).toBe(
			createSupportBotI18n('fr').t('responder.subject.replyPrefix', {
				subject: ticket.subject,
			})
		);
	});

	it('generates template drafts with citations and signature', async () => {
		const responder = new AutoResponder({ locale: 'en' });
		const draft = await responder.draft(ticket, resolution, classification);

		expect(draft.body).toContain('Hi Marie,');
		expect(draft.body).toContain(resolution.answer);
		expect(draft.body).toContain('References:');
		expect(draft.body).toContain('Politique de remboursement');
		expect(draft.body).toContain('ContractSpec Support');
	});

	it('builds aligned LLM prompt context without unreplaced placeholders', async () => {
		const { llm, calls } = createMockLlm('Drafted response body');
		const responder = new AutoResponder({
			llm,
			locale: 'en',
			tone: 'formal',
		});

		const draft = await responder.draft(ticket, resolution, classification);
		const prompt = calls[0]?.messages[1]?.content[0];

		expect(draft.body).toBe('Drafted response body');
		expect(prompt && 'text' in prompt ? prompt.text : '').toContain(
			resolution.answer
		);
		expect(prompt && 'text' in prompt ? prompt.text : '').toContain(
			classification.sentiment
		);
		expect(prompt && 'text' in prompt ? prompt.text : '').toContain(
			'Politique de remboursement'
		);
		expect(prompt && 'text' in prompt ? prompt.text : '').not.toContain(
			'{answer}'
		);
		expect(prompt && 'text' in prompt ? prompt.text : '').not.toContain(
			'{citations}'
		);
	});

	it('propagates escalation requirements from classification or actions', async () => {
		const responder = new AutoResponder();
		const escalatedDraft = await responder.draft(
			ticket,
			{
				...resolution,
				actions: [{ type: 'escalate', label: 'Escalate' }],
			},
			{
				...classification,
				escalationRequired: true,
			}
		);

		expect(escalatedDraft.requiresEscalation).toBe(true);
	});
});
