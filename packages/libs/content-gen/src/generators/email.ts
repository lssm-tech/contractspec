import type {
  EmailCampaignBrief,
  EmailDraft,
  GeneratorOptions,
} from '../types';
import type { LLMProvider } from '@lssm/lib.contracts/integrations/providers/llm';

export class EmailCampaignGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;

  constructor(options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.6;
  }

  async generate(input: EmailCampaignBrief): Promise<EmailDraft> {
    if (this.llm) {
      const draft = await this.generateWithLlm(input);
      if (draft) return draft;
    }
    return this.generateFallback(input);
  }

  private async generateWithLlm(
    input: EmailCampaignBrief
  ): Promise<EmailDraft | null> {
    if (!this.llm) return null;
    const response = await this.llm.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'Draft product marketing email as JSON {subject, previewText, body, cta}.',
            },
          ],
        },
        {
          role: 'user',
          content: [{ type: 'text', text: JSON.stringify(input) }],
        },
      ],
      {
        responseFormat: 'json',
        model: this.model,
        temperature: this.temperature,
      }
    );
    const jsonPart = response.message.content.find((chunk) => 'text' in chunk);
    if (!jsonPart || !('text' in jsonPart)) return null;
    const parsed = JSON.parse(jsonPart.text) as Partial<EmailDraft>;
    if (!parsed.subject || !parsed.body || !parsed.cta) return null;
    return {
      subject: parsed.subject,
      previewText: parsed.previewText ?? this.defaultPreview(input),
      body: parsed.body,
      cta: parsed.cta,
      variant: input.variant,
    };
  }

  private generateFallback(input: EmailCampaignBrief): EmailDraft {
    const { brief, variant } = input;
    const subject =
      this.subjects(brief.title, variant)[0] ?? `${brief.title} update`;
    const previewText = this.defaultPreview(input);
    const body = this.renderBody(input);
    const cta = brief.callToAction ?? 'Explore the sandbox';
    return { subject, previewText, body, cta, variant };
  }

  private subjects(
    title: string,
    variant: EmailCampaignBrief['variant']
  ): string[] {
    switch (variant) {
      case 'announcement':
        return [`Launch: ${title}`, `${title} is live`, `New: ${title}`];
      case 'onboarding':
        return [`Get started with ${title}`, `Your ${title} guide`];
      case 'nurture':
      default:
        return [`How ${title} speeds ops`, `Proof ${title} works`];
    }
  }

  private defaultPreview(input: EmailCampaignBrief) {
    const win = input.brief.metrics?.[0] ?? 'ship faster without policy gaps';
    return `See how teams ${win}.`;
  }

  private renderBody(input: EmailCampaignBrief): string {
    const { brief, variant } = input;
    const greeting = 'Hi there,';
    const hook = this.variantHook(variant, brief);
    const proof =
      brief.metrics?.map((metric) => `• ${metric}`).join('\n') ?? '';
    return `${greeting}

${hook}

Top reasons teams adopt ${brief.title}:
${brief.solutions.map((solution) => `• ${solution}`).join('\n')}

${proof}

${brief.callToAction ?? 'Spin up a sandbox'} → ${(input.cadenceDay ?? 0) + 1}
`;
  }

  private variantHook(
    variant: EmailCampaignBrief['variant'],
    brief: EmailCampaignBrief['brief']
  ): string {
    switch (variant) {
      case 'announcement':
        return `${brief.title} is live. ${brief.summary}`;
      case 'onboarding':
        return `Here is your next step to unlock ${brief.title}.`;
      case 'nurture':
      default:
        return `Operators like ${brief.audience.role} keep asking how to automate policy checks. Here is what works.`;
    }
  }
}
