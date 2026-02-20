import type { ContentBrief, ContentBlock, GeneratorOptions } from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import { createContentGenI18n } from '../i18n';
import type { ContentGenI18n } from '../i18n';

export interface LandingPageCopy {
  hero: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta?: string;
  };
  highlights: ContentBlock[];
  socialProof: ContentBlock;
  faq: ContentBlock[];
}

export class LandingPageGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly i18n: ContentGenI18n;

  constructor(private readonly options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.i18n = createContentGenI18n(options?.locale);
  }

  async generate(brief: ContentBrief): Promise<LandingPageCopy> {
    if (this.llm) {
      return this.generateWithLlm(brief);
    }
    return this.generateFallback(brief);
  }

  private async generateWithLlm(brief: ContentBrief): Promise<LandingPageCopy> {
    if (!this.llm) {
      return this.generateFallback(brief);
    }
    const response = await this.llm.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: this.i18n.t('prompt.landing.system'),
            },
          ],
        },
        {
          role: 'user',
          content: [{ type: 'text', text: JSON.stringify({ brief }) }],
        },
      ],
      {
        responseFormat: 'json',
        model: this.model,
        temperature: this.options?.temperature ?? 0.5,
      }
    );
    const part = response.message.content.find((chunk) => 'text' in chunk);
    if (part && 'text' in part) {
      return JSON.parse(part.text) as LandingPageCopy;
    }
    return this.generateFallback(brief);
  }

  private generateFallback(brief: ContentBrief): LandingPageCopy {
    const { t } = this.i18n;
    const industry =
      brief.audience.industry ?? t('landing.eyebrow.defaultIndustry');

    return {
      hero: {
        eyebrow: t('landing.eyebrow.template', { industry }),
        title: brief.title,
        subtitle: brief.summary,
        primaryCta: brief.callToAction ?? t('landing.cta.primary'),
        secondaryCta: t('landing.cta.secondary'),
      },
      highlights: brief.solutions.slice(0, 3).map((solution, index) => ({
        heading:
          [
            t('landing.highlight.policySafe'),
            t('landing.highlight.autoAdapts'),
            t('landing.highlight.launchReady'),
          ][index] ?? t('landing.highlight.fallback'),
        body: solution,
      })),
      socialProof: {
        heading: t('landing.socialProof.heading'),
        body:
          brief.proofPoints?.join('\n') ??
          t('landing.socialProof.defaultQuote'),
      },
      faq: this.buildFaq(brief),
    };
  }

  private buildFaq(brief: ContentBrief): ContentBlock[] {
    const { t } = this.i18n;
    const faqs: ContentBlock[] = [
      {
        heading: t('landing.faq.policiesEnforced.heading'),
        body: t('landing.faq.policiesEnforced.body'),
      },
      {
        heading: t('landing.faq.existingStack.heading'),
        body: t('landing.faq.existingStack.body'),
      },
    ];
    if (brief.complianceNotes?.length) {
      faqs.push({
        heading: t('landing.faq.compliance.heading'),
        body: brief.complianceNotes.join(' '),
      });
    }
    return faqs;
  }
}
