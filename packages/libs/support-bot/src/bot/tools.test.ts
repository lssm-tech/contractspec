import { describe, expect, it } from 'bun:test';
import { createSupportBotI18n } from '../i18n';
import { TicketResolver } from '../rag/ticket-resolver';
import { TicketClassifier } from '../tickets/classifier';
import type {
	SupportResolution,
	SupportTicket,
	TicketClassification,
} from '../types';
import { AutoResponder } from './auto-responder';
import { createSupportTools } from './tools';

const ticket: SupportTicket = {
	id: 'ticket-1',
	subject: 'Remboursement',
	body: 'Je souhaite un remboursement.',
	channel: 'email',
	locale: 'fr',
	metadata: {
		orderId: 'order-1',
	},
};

const classification: TicketClassification = {
	ticketId: ticket.id,
	category: 'billing',
	priority: 'high',
	sentiment: 'negative',
	intents: ['refund'],
	tags: ['refund'],
	confidence: 0.82,
};

const resolution: SupportResolution = {
	ticketId: ticket.id,
	answer: 'Votre demande de remboursement a ete enregistree.',
	confidence: 0.9,
	citations: [{ label: 'Refund policy' }],
	actions: [{ type: 'respond', label: 'Send automated response' }],
};

function createToolset(locale?: string) {
	const resolver = new TicketResolver({
		knowledge: {
			async query() {
				return {
					answer: resolution.answer,
					references: [
						{ id: 'doc-1', score: 0.9, payload: { title: 'Refund policy' } },
					],
				};
			},
		},
	});

	return createSupportTools({
		classifier: new TicketClassifier({ locale }),
		resolver,
		responder: new AutoResponder({ locale }),
		locale,
	});
}

describe('createSupportTools', () => {
	it('keeps stable titles and localizes descriptions', () => {
		const tools = createToolset('fr');
		const classifyTool = tools[0]!;
		const resolveTool = tools[1]!;
		const draftTool = tools[2]!;
		const i18n = createSupportBotI18n('fr');

		expect(classifyTool.title).toBe('support_classify_ticket');
		expect(resolveTool.title).toBe('support_resolve_ticket');
		expect(draftTool.title).toBe('support_draft_response');
		expect(classifyTool.description).toBe(i18n.t('tool.classify.description'));
		expect(resolveTool.description).toBe(i18n.t('tool.resolve.description'));
		expect(draftTool.description).toBe(i18n.t('tool.draft.description'));
	});

	it('accepts locale, metadata, and optional action payloads through schemas', async () => {
		const draftTool = createToolset('fr')[2]!;
		const result = await draftTool.execute?.(
			{
				ticket,
				resolution,
				classification,
			},
			{
				toolCallId: 'tool-call-1',
				messages: [],
			}
		);

		expect(result).toBeDefined();
		expect(
			result && 'metadata' in result ? result.metadata : undefined
		).toEqual({
			ticketId: ticket.id,
		});
	});

	it('throws localized errors for invalid classify and draft inputs', async () => {
		const tools = createToolset('fr');
		const classifyTool = tools[0]!;
		const draftTool = tools[2]!;
		const i18n = createSupportBotI18n('fr');

		await expect(
			classifyTool.execute?.(
				{},
				{
					toolCallId: 'tool-call-2',
					messages: [],
				}
			)
		).rejects.toThrow(i18n.t('error.inputMustIncludeTicket'));
		await expect(
			classifyTool.execute?.(
				{
					ticket: {
						...ticket,
						id: '',
					},
				},
				{
					toolCallId: 'tool-call-3',
					messages: [],
				}
			)
		).rejects.toThrow(i18n.t('error.ticketMissingId'));
		await expect(
			draftTool.execute?.(
				{ ticket },
				{
					toolCallId: 'tool-call-4',
					messages: [],
				}
			)
		).rejects.toThrow(i18n.t('error.resolutionClassificationRequired'));
	});
});
