import type {
  EmailCampaignBrief,
  EmailDraft,
  GeneratorOptions,
} from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import { createContentGenI18n } from '../i18n';
import type { ContentGenI18n } from '../i18n';

export class EmailCampaignGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;
  private readonly i18n: ContentGenI18n;

  constructor(options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.6;
    this.i18n = createContentGenI18n(options?.locale);
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
              text: this.i18n.t('prompt.email.system'),
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
    const { t } = this.i18n;
    const subject =
      this.subjects(brief.title, variant)[0] ??
      t('email.subject.fallback', { title: brief.title });
    const previewText = this.defaultPreview(input);
    const body = this.renderBody(input);
    const cta = brief.callToAction ?? t('email.cta.explore');
    return { subject, previewText, body, cta, variant };
  }

  private subjects(
    title: string,
    variant: EmailCampaignBrief['variant']
  ): string[] {
    const { t } = this.i18n;
    switch (variant) {
      case 'announcement':
        return [
          t('email.subject.announcement.launch', { title }),
          t('email.subject.announcement.live', { title }),
          t('email.subject.announcement.new', { title }),
        ];
      case 'onboarding':
        return [
          t('email.subject.onboarding.getStarted', { title }),
          t('email.subject.onboarding.guide', { title }),
        ];
      case 'nurture':
      default:
        return [
          t('email.subject.nurture.speeds', { title }),
          t('email.subject.nurture.proof', { title }),
        ];
    }
  }

  private defaultPreview(input: EmailCampaignBrief) {
    const { t } = this.i18n;
    const win = input.brief.metrics?.[0] ?? t('email.preview.defaultWin');
    return t('email.preview.template', { win });
  }

  private renderBody(input: EmailCampaignBrief): string {
    const { brief, variant } = input;
    const { t } = this.i18n;
    const greeting = t('email.body.greeting');
    const hook = this.variantHook(variant, brief);
    const proof =
      brief.metrics?.map((metric) => `\u2022 ${metric}`).join('\n') ?? '';
    return `${greeting}

${hook}

${t('email.body.reasons', { title: brief.title })}
${brief.solutions.map((solution) => `\u2022 ${solution}`).join('\n')}

${proof}

${brief.callToAction ?? t('email.cta.sandbox')} \u2192 ${(input.cadenceDay ?? 0) + 1}
`;
  }

  private variantHook(
    variant: EmailCampaignBrief['variant'],
    brief: EmailCampaignBrief['brief']
  ): string {
    const { t } = this.i18n;
    switch (variant) {
      case 'announcement':
        return t('email.hook.announcement', {
          title: brief.title,
          summary: brief.summary,
        });
      case 'onboarding':
        return t('email.hook.onboarding', { title: brief.title });
      case 'nurture':
      default:
        return t('email.hook.nurture', { role: brief.audience.role });
    }
  }
}
