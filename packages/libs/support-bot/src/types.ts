import type { AgentSpec } from '@contractspec/lib.ai-agent/spec';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory =
  | 'billing'
  | 'technical'
  | 'product'
  | 'account'
  | 'compliance'
  | 'other';
export type TicketChannel = 'email' | 'chat' | 'phone' | 'portal';
export type TicketSentiment =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'frustrated';

export interface SupportTicket {
  id: string;
  subject: string;
  body: string;
  channel: TicketChannel;
  locale?: string;
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, string>;
}

export interface TicketClassification {
  ticketId: string;
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  intents: string[];
  tags: string[];
  confidence: number;
  escalationRequired?: boolean;
}

export interface SupportCitation {
  label: string;
  url?: string;
  snippet?: string;
  score?: number;
}

export interface SupportAction {
  type: 'respond' | 'escalate' | 'refund' | 'manual';
  label: string;
  payload?: Record<string, string>;
}

export interface SupportResolution {
  ticketId: string;
  answer: string;
  confidence: number;
  citations: SupportCitation[];
  actions: SupportAction[];
  escalationReason?: string;
  knowledgeUpdates?: string[];
}

export interface SupportResponseDraft {
  ticketId: string;
  subject: string;
  body: string;
  confidence: number;
  requiresEscalation: boolean;
  citations: SupportCitation[];
}

export interface SupportBotSpec extends AgentSpec {
  thresholds?: {
    autoResolveMinConfidence?: number;
    maxIterations?: number;
  };
  review?: {
    queueName?: string;
    approvalWorkflow?: string;
  };
}

export interface ClassificationResultPayload {
  ticket: SupportTicket;
  classification: TicketClassification;
}

export interface ResolutionResultPayload extends ClassificationResultPayload {
  resolution: SupportResolution;
  draft: SupportResponseDraft;
}
