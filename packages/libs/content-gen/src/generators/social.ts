import type { ContentBrief, GeneratorOptions, SocialPost } from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import { createContentGenI18n } from '../i18n';
import type { ContentGenI18n } from '../i18n';

export class SocialPostGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly i18n: ContentGenI18n;

  constructor(options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.i18n = createContentGenI18n(options?.locale);
  }

  async generate(brief: ContentBrief): Promise<SocialPost[]> {
    if (this.llm) {
      const posts = await this.generateWithLlm(brief);
      if (posts.length) return posts;
    }
    return this.generateFallback(brief);
  }

  private async generateWithLlm(brief: ContentBrief): Promise<SocialPost[]> {
    if (!this.llm) return [];
    const response = await this.llm.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: this.i18n.t('prompt.social.system'),
            },
          ],
        },
        {
          role: 'user',
          content: [{ type: 'text', text: JSON.stringify(brief) }],
        },
      ],
      { responseFormat: 'json', model: this.model }
    );
    const part = response.message.content.find((chunk) => 'text' in chunk);
    if (!part || !('text' in part)) return [];
    return JSON.parse(part.text) as SocialPost[];
  }

  private generateFallback(brief: ContentBrief): SocialPost[] {
    const { t } = this.i18n;
    const hashtags = this.buildHashtags(brief);
    return [
      {
        channel: 'linkedin',
        body: `${brief.title}: ${brief.summary}\n${brief.problems[0]} \u2192 ${brief.solutions[0]}`,
        hashtags,
        cta: brief.callToAction ?? t('social.cta.linkedin'),
      },
      {
        channel: 'twitter',
        body: `${brief.solutions[0]}${t('social.body.twitter.connector')}${brief.solutions[1] ?? ''}`.trim(),
        hashtags: hashtags.slice(0, 3),
        cta: t('social.cta.twitter'),
      },
      {
        channel: 'threads',
        body: t('social.body.threads', { title: brief.title }),
        hashtags: hashtags.slice(1, 4),
      },
    ];
  }

  private buildHashtags(brief: ContentBrief): string[] {
    const base = [
      brief.audience.industry
        ? `#${camel(brief.audience.industry)}`
        : '#operations',
      '#automation',
      '#aiops',
      '#compliance',
    ];
    return [...new Set(base.map((tag) => tag.replace(/\s+/g, '')))].slice(0, 5);
  }
}

function camel(text: string) {
  return text
    .split(/\s|-/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join('');
}
