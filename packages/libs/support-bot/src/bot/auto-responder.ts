import type { LLMProvider } from '@lssm/lib.contracts/integrations/providers/llm';
import type {
  SupportResponseDraft,
  SupportResolution,
  SupportTicket,
  TicketClassification,
} from '../types';

export interface AutoResponderOptions {
  llm?: LLMProvider;
  model?: string;
  tone?: 'friendly' | 'formal';
  closing?: string;
}

export class AutoResponder {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly tone: 'friendly' | 'formal';
  private readonly closing: string;

  constructor(options?: AutoResponderOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.tone = options?.tone ?? 'friendly';
    this.closing =
      options?.closing ??
      (this.tone === 'friendly'
        ? 'We remain available if you need anything else.'
        : 'Please let us know if you require additional assistance.');
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
    const prompt = `You are a ${this.tone} support agent. Draft an email response.
Ticket Subject: ${ticket.subject}
Ticket Body: ${ticket.body}
Detected Category: ${classification.category}
Detected Priority: ${classification.priority}
Resolution:
${resolution.answer}
Citations: ${resolution.citations.map((c) => c.label).join(', ')}`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await this.llm!.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'Write empathetic, accurate support replies that cite sources when relevant.',
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
    const greeting = ticket.customerName
      ? `Hi ${ticket.customerName},`
      : 'Hi there,';
    const body = `${greeting}

Thanks for contacting us about "${ticket.subject}". ${this.renderCategoryIntro(
      classification
    )}

${resolution.answer}

${this.renderCitations(resolution)}
${this.closing}

— ContractSpec Support`;

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
    switch (classification.category) {
      case 'billing':
        return 'I understand billing issues can be stressful, so let me clarify the situation.';
      case 'technical':
        return 'I see you encountered a technical issue. Here is what happened and how to fix it.';
      case 'product':
        return 'Thanks for sharing feedback about the product. Here are the next steps.';
      case 'account':
        return 'Account access is critical, so let me walk you through the resolution.';
      case 'compliance':
        return 'Compliance questions require precision. See the policy-aligned answer below.';
      default:
        return 'Here is what we found after reviewing your request.';
    }
  }

  private renderCitations(resolution: SupportResolution) {
    if (!resolution.citations.length) return '';
    const lines = resolution.citations.map((citation, index) => {
      const label = citation.label || `Source ${index + 1}`;
      const link = citation.url ? ` (${citation.url})` : '';
      return `- ${label}${link}`;
    });
    return `References:\n${lines.join('\n')}`;
  }
}
