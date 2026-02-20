import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import type {
  SupportResponseDraft,
  SupportResolution,
  SupportTicket,
  TicketClassification,
} from '../types';
import { createSupportBotI18n } from '../i18n';
import type { SupportBotI18n } from '../i18n';

export interface AutoResponderOptions {
  llm?: LLMProvider;
  model?: string;
  tone?: 'friendly' | 'formal';
  closing?: string;
  locale?: string;
}

export class AutoResponder {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly tone: 'friendly' | 'formal';
  private readonly closing: string;
  private readonly i18n: SupportBotI18n;

  constructor(options?: AutoResponderOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.tone = options?.tone ?? 'friendly';
    this.i18n = createSupportBotI18n(options?.locale);
    const { t } = this.i18n;
    this.closing =
      options?.closing ??
      (this.tone === 'friendly'
        ? t('responder.closing.friendly')
        : t('responder.closing.formal'));
  }

  async draft(
    ticket: SupportTicket,
    resolution: SupportResolution,
    classification: TicketClassification
  ): Promise<SupportResponseDraft> {
    if (this.llm) {
      return this.generateWithLLM(ticket, resolution, classification);
    }
    return this.generateTemplate(ticket, resolution, classification);
  }

  private async generateWithLLM(
    ticket: SupportTicket,
    resolution: SupportResolution,
    classification: TicketClassification
  ): Promise<SupportResponseDraft> {
    const { t } = this.i18n;
    const prompt = t('prompt.autoResponder.user', {
      tone: this.tone,
      subject: ticket.subject,
      body: ticket.body,
      category: classification.category,
      priority: classification.priority,
      answer: resolution.answer,
      citations: resolution.citations.map((c) => c.label).join(', '),
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await this.llm!.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: t('prompt.autoResponder.system'),
            },
          ],
        },
        {
          role: 'user',
          content: [{ type: 'text', text: prompt }],
        },
      ],
      { model: this.model }
    );

    const body = response.message.content
      .map((part) => ('text' in part ? part.text : ''))
      .join('')
      .trim();

    return this.buildDraft(ticket, resolution, classification, body);
  }

  private generateTemplate(
    ticket: SupportTicket,
    resolution: SupportResolution,
    classification: TicketClassification
  ): SupportResponseDraft {
    const { t } = this.i18n;
    const greeting = ticket.customerName
      ? t('responder.greeting.named', { name: ticket.customerName })
      : t('responder.greeting.anonymous');
    const body = `${greeting}

${t('responder.intro.thanks', { subject: ticket.subject })} ${this.renderCategoryIntro(
      classification
    )}

${resolution.answer}

${this.renderCitations(resolution)}
${this.closing}

${t('responder.signature')}`;

    return this.buildDraft(ticket, resolution, classification, body);
  }

  private buildDraft(
    ticket: SupportTicket,
    resolution: SupportResolution,
    classification: TicketClassification,
    body: string
  ): SupportResponseDraft {
    return {
      ticketId: ticket.id,
      subject: ticket.subject.startsWith('Re:')
        ? ticket.subject
        : `Re: ${ticket.subject}`,
      body,
      confidence: Math.min(resolution.confidence, classification.confidence),
      requiresEscalation:
        resolution.actions.some((action) => action.type === 'escalate') ||
        Boolean(classification.escalationRequired),
      citations: resolution.citations,
    };
  }

  private renderCategoryIntro(classification: TicketClassification) {
    const { t } = this.i18n;
    switch (classification.category) {
      case 'billing':
        return t('responder.category.billing');
      case 'technical':
        return t('responder.category.technical');
      case 'product':
        return t('responder.category.product');
      case 'account':
        return t('responder.category.account');
      case 'compliance':
        return t('responder.category.compliance');
      default:
        return t('responder.category.other');
    }
  }

  private renderCitations(resolution: SupportResolution) {
    const { t } = this.i18n;
    if (!resolution.citations.length) return '';
    const lines = resolution.citations.map((citation, index) => {
      const label =
        citation.label ||
        t('responder.references.sourceLabel', { index: index + 1 });
      const link = citation.url ? ` (${citation.url})` : '';
      return `- ${label}${link}`;
    });
    return `${t('responder.references.header')}\n${lines.join('\n')}`;
  }
}
