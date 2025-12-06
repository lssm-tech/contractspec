import type { TicketResolver } from '../rag/ticket-resolver';
import type { TicketClassifier } from '../tickets/classifier';
import type { AutoResponder } from './auto-responder';
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
import type { Tool } from '@ai-sdk/provider-utils';
import { z } from 'zod';

const ticketSchema = z.object({
  id: z.string(),
  subject: z.string(),
  body: z.string(),
  channel: z.enum(['email', 'chat', 'phone', 'portal']),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  metadata: z.object().optional(),
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
  payload: z.record(z.string(), z.string()),
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

function ensureTicket(input: unknown): SupportTicket {
  if (!input || typeof input !== 'object' || !('ticket' in input)) {
    throw new Error('Input must include ticket');
  }
  const ticket = (input as { ticket: SupportTicket }).ticket;
  if (!ticket?.id) throw new Error('Ticket is missing id');
  return ticket;
}

function extractResolution(input: unknown): SupportResolution | undefined {
  if (!input || typeof input !== 'object' || !('resolution' in input))
    return undefined;
  return (input as { resolution?: SupportResolution }).resolution;
}

function extractClassification(
  input: unknown
): TicketClassification | undefined {
  if (!input || typeof input !== 'object' || !('classification' in input))
    return undefined;
  return (input as { classification?: TicketClassification }).classification;
}

export interface SupportToolsetOptions {
  resolver: TicketResolver;
  classifier: TicketClassifier;
  responder: AutoResponder;
}

export function createSupportTools(options: SupportToolsetOptions): Tool[] {
  const classifyTool: Tool = {
    title: 'support_classify_ticket',
    description: 'Classify a ticket for priority, sentiment, and category',
    inputSchema: z.object({ ticket: ticketSchema }),
    execute: async (input: unknown) => {
      const ticket = ensureTicket(input);
      const classification = await options.classifier.classify(ticket);
      return {
        content: JSON.stringify(classification),
        metadata: { ticketId: ticket.id },
      };
    },
  };

  const resolveTool: Tool = {
    title: 'support_resolve_ticket',
    description: 'Generate a knowledge-grounded resolution for a ticket',
    inputSchema: z.object({ ticket: ticketSchema }),
    execute: async (input: unknown) => {
      const ticket = ensureTicket(input);
      const resolution = await options.resolver.resolve(ticket);
      return {
        content: JSON.stringify(resolution),
        metadata: { ticketId: ticket.id },
      };
    },
  };

  const responderTool: Tool = {
    title: 'support_draft_response',
    description:
      'Draft a user-facing reply based on resolution + classification',
    inputSchema: z.object({
      ticket: ticketSchema,
      resolution: supportResolutionSchema,
      classification: ticketClassificationSchema,
    }),
    execute: async (input: unknown) => {
      const ticket = ensureTicket(input);
      const resolution = extractResolution(input);
      const classification = extractClassification(input);
      if (!resolution || !classification) {
        throw new Error('resolution and classification are required');
      }
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
