import type { LLMProvider } from '@lssm/lib.contracts/integrations/providers/llm';
import type {
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketSentiment,
  TicketClassification,
} from '../types';

const CATEGORY_KEYWORDS: Record<TicketCategory, string[]> = {
  billing: ['invoice', 'payout', 'refund', 'charge', 'billing', 'payment'],
  technical: ['bug', 'error', 'crash', 'issue', 'failed', 'timeout'],
  product: ['feature', 'roadmap', 'idea', 'request', 'feedback'],
  account: ['login', 'password', '2fa', 'account', 'profile', 'email change'],
  compliance: ['kyc', 'aml', 'compliance', 'regulation', 'gdpr'],
  other: [],
};

const PRIORITY_HINTS: Record<TicketPriority, string[]> = {
  urgent: ['urgent', 'asap', 'immediately', 'today', 'right away'],
  high: ['high priority', 'blocking', 'major', 'critical'],
  medium: ['soon', 'next few days'],
  low: ['nice to have', 'when possible', 'later'],
};

const SENTIMENT_HINTS: Record<TicketSentiment, string[]> = {
  positive: ['love', 'great', 'awesome', 'thank you'],
  neutral: ['question', 'wonder', 'curious'],
  negative: ['unhappy', 'bad', 'terrible', 'awful', 'angry'],
  frustrated: ['furious', 'frustrated', 'fed up', 'ridiculous'],
};

export interface TicketClassifierOptions {
  keywords?: Partial<Record<TicketCategory, string[]>>;
  llm?: LLMProvider;
  llmModel?: string;
}

export class TicketClassifier {
  private readonly keywords: Record<TicketCategory, string[]>;
  private readonly llm?: LLMProvider;
  private readonly llmModel?: string;

  constructor(options?: TicketClassifierOptions) {
    this.keywords = {
      ...CATEGORY_KEYWORDS,
      ...(options?.keywords ?? {}),
    } as Record<TicketCategory, string[]>;
    this.llm = options?.llm;
    this.llmModel = options?.llmModel;
  }

  async classify(ticket: SupportTicket): Promise<TicketClassification> {
    const heuristics = this.heuristicClassification(ticket);
    if (!this.llm) return heuristics;

    try {
      const llmResult = await this.llm.chat(
        [
          {
            role: 'system',
            content: [{ type: 'text', text: 'Classify the support ticket.' }],
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  subject: ticket.subject,
                  body: ticket.body,
                  channel: ticket.channel,
                }),
              },
            ],
          },
        ],
        {
          responseFormat: 'json',
          model: this.llmModel,
        }
      );
      const content = llmResult.message.content.find((part) => 'text' in part);
      if (content && 'text' in content) {
        const parsed = JSON.parse(content.text) as Partial<TicketClassification>;
        return {
          ...heuristics,
          ...parsed,
          intents: parsed.intents ?? heuristics.intents,
          tags: parsed.tags ?? heuristics.tags,
        };
      }
    } catch {
      // fallback to heuristics
    }

    return heuristics;
  }

  private heuristicClassification(ticket: SupportTicket): TicketClassification {
    const text = `${ticket.subject}\n${ticket.body}`.toLowerCase();
    const category = this.detectCategory(text);
    const priority = this.detectPriority(text);
    const sentiment = this.detectSentiment(text);
    const intents = this.extractIntents(text);
    const tags = intents.slice(0, 3);
    const confidence = this.estimateConfidence(category, priority, sentiment);

    return {
      ticketId: ticket.id,
      category,
      priority,
      sentiment,
      intents,
      tags,
      confidence,
      escalationRequired: priority === 'urgent' || category === 'compliance',
    };
  }

  private detectCategory(text: string): TicketCategory {
    for (const [category, keywords] of Object.entries(this.keywords) as [
      TicketCategory,
      string[]
    ][]) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return category;
      }
    }
    return 'other';
  }

  private detectPriority(text: string): TicketPriority {
    for (const priority of ['urgent', 'high', 'medium', 'low'] as TicketPriority[]) {
      if (PRIORITY_HINTS[priority].some((word) => text.includes(word))) {
        return priority;
      }
    }
    return 'medium';
  }

  private detectSentiment(text: string): TicketSentiment {
    for (const sentiment of [
      'frustrated',
      'negative',
      'neutral',
      'positive',
    ] as TicketSentiment[]) {
      if (SENTIMENT_HINTS[sentiment].some((word) => text.includes(word))) {
        return sentiment;
      }
    }
    return 'neutral';
  }

  private extractIntents(text: string): string[] {
    const intents: string[] = [];
    if (text.includes('refund') || text.includes('chargeback')) intents.push('refund');
    if (text.includes('payout')) intents.push('payout');
    if (text.includes('login')) intents.push('login-help');
    if (text.includes('feature')) intents.push('feature-request');
    if (text.includes('bug') || text.includes('error')) intents.push('bug-report');
    return intents.length ? intents : ['general'];
  }

  private estimateConfidence(
    category: TicketCategory,
    priority: TicketPriority,
    sentiment: TicketSentiment
  ): number {
    let base = 0.6;
    if (category !== 'other') base += 0.1;
    if (priority === 'urgent' || priority === 'low') base += 0.05;
    if (sentiment === 'frustrated') base -= 0.05;
    return Math.min(0.95, Math.max(0.4, Number(base.toFixed(2))));
  }
}
