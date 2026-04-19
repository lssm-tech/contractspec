import type { Tool } from '@ai-sdk/provider-utils';
import * as z from 'zod';
import { createSupportBotI18n } from '../i18n';
import type { TicketResolver } from '../rag/ticket-resolver';
import type { TicketClassifier } from '../tickets/classifier';
import type {
	SupportAction,
	SupportCitation,
	SupportResolution,
	SupportTicket,
	TicketCategory,
	TicketClassification,
	TicketPriority,
	TicketSentiment,
} from '../types';
import type { AutoResponder } from './auto-responder';

const ticketSchema = z.object({
	id: z.string(),
	subject: z.string(),
	body: z.string(),
	channel: z.enum(['email', 'chat', 'phone', 'portal']),
	locale: z.string().optional(),
	customerName: z.string().optional(),
	customerEmail: z.string().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
}) satisfies z.ZodType<SupportTicket>;
const supportCitationSchema = z.object({
	label: z.string(),
	url: z.string().optional(),
	snippet: z.string().optional(),
	score: z.number().optional(),
}) satisfies z.ZodType<SupportCitation>;
const supportActionSchema = z.object({
	type: z.enum(['respond', 'escalate', 'refund', 'manual']),
	label: z.string(),
	payload: z.record(z.string(), z.string()).optional(),
}) satisfies z.ZodType<SupportAction>;
const supportResolutionSchema = z.object({
	ticketId: z.string(),
	answer: z.string(),
	confidence: z.number(),
	citations: supportCitationSchema.array(),
	actions: supportActionSchema.array(),
	escalationReason: z.string().optional(),
	knowledgeUpdates: z.array(z.string()).optional(),
}) satisfies z.ZodType<SupportResolution>;
const ticketClassificationSchema = z.object({
	ticketId: z.string(),
	category: z.enum([
		'billing',
		'technical',
		'product',
		'account',
		'compliance',
		'other',
	]) satisfies z.ZodType<TicketCategory>,
	priority: z.enum([
		'urgent',
		'high',
		'medium',
		'low',
	]) satisfies z.ZodType<TicketPriority>,
	sentiment: z.enum([
		'positive',
		'neutral',
		'negative',
		'frustrated',
	]) satisfies z.ZodType<TicketSentiment>,
	intents: z.array(z.string()),
	tags: z.array(z.string()),
	confidence: z.number(),
	escalationRequired: z.boolean().optional(),
}) satisfies z.ZodType<TicketClassification>;

const classifyInputSchema = z.object({
	ticket: ticketSchema,
});

const draftInputSchema = z.object({
	ticket: ticketSchema,
	resolution: supportResolutionSchema,
	classification: ticketClassificationSchema,
});

export interface SupportToolsetOptions {
	resolver: TicketResolver;
	classifier: TicketClassifier;
	responder: AutoResponder;
	locale?: string;
}

type Translate = ReturnType<typeof createSupportBotI18n>['t'];

function isTicketMissing(error: z.ZodError): boolean {
	return error.issues.some(
		(issue) => issue.path.length === 1 && issue.path[0] === 'ticket'
	);
}

function isTicketIdInvalid(error: z.ZodError): boolean {
	return error.issues.some(
		(issue) => issue.path[0] === 'ticket' && issue.path[1] === 'id'
	);
}

function isResolutionOrClassificationInvalid(error: z.ZodError): boolean {
	return error.issues.some(
		(issue) =>
			issue.path[0] === 'resolution' || issue.path[0] === 'classification'
	);
}

function ensureTicketId(ticket: SupportTicket, t: Translate): SupportTicket {
	if (!ticket.id.trim()) {
		throw new Error(t('error.ticketMissingId'));
	}
	return ticket;
}

function parseTicketInput(input: unknown, t: Translate): SupportTicket {
	const parsed = classifyInputSchema.safeParse(input);
	if (!parsed.success) {
		if (isTicketIdInvalid(parsed.error)) {
			throw new Error(t('error.ticketMissingId'));
		}
		throw new Error(t('error.inputMustIncludeTicket'));
	}
	return ensureTicketId(parsed.data.ticket, t);
}

function parseDraftInput(
	input: unknown,
	t: Translate
): {
	ticket: SupportTicket;
	resolution: SupportResolution;
	classification: TicketClassification;
} {
	const parsed = draftInputSchema.safeParse(input);
	if (!parsed.success) {
		if (isTicketMissing(parsed.error)) {
			throw new Error(t('error.inputMustIncludeTicket'));
		}
		if (isTicketIdInvalid(parsed.error)) {
			throw new Error(t('error.ticketMissingId'));
		}
		if (isResolutionOrClassificationInvalid(parsed.error)) {
			throw new Error(t('error.resolutionClassificationRequired'));
		}
		throw new Error(t('error.resolutionClassificationRequired'));
	}

	return {
		...parsed.data,
		ticket: ensureTicketId(parsed.data.ticket, t),
	};
}

export function createSupportTools(options: SupportToolsetOptions): Tool[] {
	const { t } = createSupportBotI18n(options.locale);
	const classifyTool: Tool = {
		title: 'support_classify_ticket',
		description: t('tool.classify.description'),
		inputSchema: z.object({ ticket: ticketSchema }),
		execute: async (input: unknown) => {
			const ticket = parseTicketInput(input, t);
			const classification = await options.classifier.classify(ticket);
			return {
				content: JSON.stringify(classification),
				metadata: { ticketId: ticket.id },
			};
		},
	};

	const resolveTool: Tool = {
		title: 'support_resolve_ticket',
		description: t('tool.resolve.description'),
		inputSchema: z.object({ ticket: ticketSchema }),
		execute: async (input: unknown) => {
			const ticket = parseTicketInput(input, t);
			const resolution = await options.resolver.resolve(ticket);
			return {
				content: JSON.stringify(resolution),
				metadata: { ticketId: ticket.id },
			};
		},
	};

	const responderTool: Tool = {
		title: 'support_draft_response',
		description: t('tool.draft.description'),
		inputSchema: z.object({
			ticket: ticketSchema,
			resolution: supportResolutionSchema,
			classification: ticketClassificationSchema,
		}),
		execute: async (input: unknown) => {
			const { ticket, resolution, classification } = parseDraftInput(input, t);
			const draft = await options.responder.draft(
				ticket,
				resolution,
				classification
			);
			return {
				content: JSON.stringify(draft),
				metadata: { ticketId: ticket.id },
			};
		},
	};

	return [classifyTool, resolveTool, responderTool];
}
