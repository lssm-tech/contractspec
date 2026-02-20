import type { KnowledgeAnswer } from '@contractspec/lib.knowledge/query/service';
import type { SupportResolution, SupportTicket } from '../types';
import { createSupportBotI18n } from '../i18n';
import type { SupportBotI18n } from '../i18n';

export interface KnowledgeRetriever {
  query(question: string): Promise<KnowledgeAnswer>;
}

export interface TicketResolverOptions {
  knowledge: KnowledgeRetriever;
  minConfidence?: number;
  prependPrompt?: string;
  locale?: string;
}

export class TicketResolver {
  private readonly knowledge: KnowledgeRetriever;
  private readonly minConfidence: number;
  private readonly prependPrompt?: string;
  private readonly i18n: SupportBotI18n;

  constructor(options: TicketResolverOptions) {
    this.knowledge = options.knowledge;
    this.minConfidence = options.minConfidence ?? 0.65;
    this.prependPrompt = options.prependPrompt;
    this.i18n = createSupportBotI18n(options.locale);
  }

  async resolve(ticket: SupportTicket): Promise<SupportResolution> {
    const question = this.buildQuestion(ticket);
    const answer = await this.knowledge.query(question);
    return this.toResolution(ticket, answer);
  }

  private buildQuestion(ticket: SupportTicket): string {
    const { t } = this.i18n;
    const header = [
      t('resolver.question.subjectLabel', { subject: ticket.subject }),
      t('resolver.question.channelLabel', { channel: ticket.channel }),
    ];
    if (ticket.customerName) {
      header.push(
        t('resolver.question.customerLabel', { name: ticket.customerName })
      );
    }
    const sections = [
      this.prependPrompt,
      header.join('\n'),
      '---',
      ticket.body,
    ].filter(Boolean);
    return sections.join('\n');
  }

  private toResolution(
    ticket: SupportTicket,
    answer: KnowledgeAnswer
  ): SupportResolution {
    const citations = answer.references.map((ref) => {
      const label =
        typeof ref.payload?.title === 'string'
          ? ref.payload.title
          : typeof ref.payload?.documentId === 'string'
            ? ref.payload.documentId
            : ref.id;
      return {
        label,
        url: typeof ref.payload?.url === 'string' ? ref.payload.url : undefined,
        snippet:
          typeof ref.payload?.text === 'string'
            ? ref.payload.text.slice(0, 280)
            : undefined,
        score: ref.score,
      };
    });

    const { t } = this.i18n;
    const confidence = this.deriveConfidence(answer);
    const escalate = confidence < this.minConfidence || citations.length === 0;

    return {
      ticketId: ticket.id,
      answer: answer.answer,
      confidence,
      citations,
      actions: [
        escalate
          ? { type: 'escalate', label: t('resolver.action.escalate') }
          : { type: 'respond', label: t('resolver.action.respond') },
      ],
      escalationReason: escalate
        ? t('resolver.escalation.insufficientConfidence')
        : undefined,
      knowledgeUpdates: escalate ? [ticket.body.slice(0, 200)] : undefined,
    };
  }

  private deriveConfidence(answer: KnowledgeAnswer): number {
    if (!answer.references.length) return 0.3;
    const topScore = answer.references[0]?.score ?? 0.4;
    const normalized = Math.min(1, Math.max(0, topScore));
    const tokenPenalty = answer.usage?.completionTokens
      ? Math.min(answer.usage.completionTokens / 1000, 0.2)
      : 0;
    return Number((normalized - tokenPenalty).toFixed(2));
  }
}
