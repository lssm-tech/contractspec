import type { AgentToolDefinitionWithHandler } from '@lssm/lib.ai-agent';
import type { TicketResolver } from '../rag/ticket-resolver';
import type { TicketClassifier } from '../tickets/classifier';
import type { AutoResponder } from './auto-responder';
import type {
  SupportTicket,
  SupportResolution,
  TicketClassification,
} from '../types';

export interface SupportToolsetOptions {
  resolver: TicketResolver;
  classifier: TicketClassifier;
  responder: AutoResponder;
}

export function createSupportTools(
  options: SupportToolsetOptions
): AgentToolDefinitionWithHandler[] {
  const classifyTool: AgentToolDefinitionWithHandler = {
    definition: {
      name: 'support_classify_ticket',
      description: 'Classify a ticket for priority, sentiment, and category',
      inputSchema: {
        type: 'object',
        required: ['ticket'],
        properties: {
          ticket: ticketSchema,
        },
      },
    },
    handler: async (input: unknown) => {
      const ticket = ensureTicket(input);
      const classification = await options.classifier.classify(ticket);
      return {
        content: JSON.stringify(classification),
        metadata: { ticketId: ticket.id },
      };
    },
  };

  const resolveTool: AgentToolDefinitionWithHandler = {
    definition: {
      name: 'support_resolve_ticket',
      description: 'Generate a knowledge-grounded resolution for a ticket',
      inputSchema: {
        type: 'object',
        required: ['ticket'],
        properties: {
          ticket: ticketSchema,
        },
      },
    },
    handler: async (input: unknown) => {
      const ticket = ensureTicket(input);
      const resolution = await options.resolver.resolve(ticket);
      return {
        content: JSON.stringify(resolution),
        metadata: { ticketId: ticket.id },
      };
    },
  };

  const responderTool: AgentToolDefinitionWithHandler = {
    definition: {
      name: 'support_draft_response',
      description:
        'Draft a user-facing reply based on resolution + classification',
      inputSchema: {
        type: 'object',
        required: ['ticket', 'resolution', 'classification'],
        properties: {
          ticket: ticketSchema,
          resolution: { type: 'object' },
          classification: { type: 'object' },
        },
      },
    },
    handler: async (input: unknown) => {
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

const ticketSchema = {
  type: 'object',
  required: ['id', 'subject', 'body', 'channel'],
  properties: {
    id: { type: 'string' },
    subject: { type: 'string' },
    body: { type: 'string' },
    channel: { type: 'string', enum: ['email', 'chat', 'phone', 'portal'] },
    customerName: { type: 'string' },
    customerEmail: { type: 'string' },
    metadata: { type: 'object' },
  },
};

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
