import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import type {
  ContentBrief,
  GeneratedContent,
  GeneratorOptions,
} from '../types';
import { createContentGenI18n } from '../i18n';
import type { ContentGenI18n } from '../i18n';

export class BlogGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;
  private readonly i18n: ContentGenI18n;

  constructor(options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.4;
    this.i18n = createContentGenI18n(options?.locale);
  }

  async generate(brief: ContentBrief): Promise<GeneratedContent> {
    if (this.llm) {
      return this.generateWithLlm(brief);
    }
    return this.generateDeterministic(brief);
  }

  private async generateWithLlm(
    brief: ContentBrief
  ): Promise<GeneratedContent> {
    if (!this.llm) {
      return this.generateDeterministic(brief);
    }
    const response = await this.llm.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: this.i18n.t('prompt.blog.system'),
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: JSON.stringify({ brief }),
            },
          ],
        },
      ],
      {
        responseFormat: 'json',
        model: this.model,
        temperature: this.temperature,
      }
    );
    const jsonPart = response.message.content.find((part) => 'text' in part);
    if (jsonPart && 'text' in jsonPart) {
      return JSON.parse(jsonPart.text) as GeneratedContent;
    }
    return this.generateDeterministic(brief);
  }

  private generateDeterministic(brief: ContentBrief): GeneratedContent {
    const { t } = this.i18n;

    const intro = t('blog.intro', {
      role: brief.audience.role,
      problems: brief.problems.slice(0, 2).join(' and '),
      title: brief.title,
      summary: brief.summary,
    });

    const sections = [
      {
        heading: t('blog.heading.whyNow'),
        body: this.renderWhyNow(brief),
      },
      {
        heading: t('blog.heading.whatYouGet'),
        body: t('blog.body.whatYouGet'),
        bullets: brief.solutions,
      },
      {
        heading: t('blog.heading.proofItWorks'),
        body: t('blog.body.proofItWorks'),
        bullets: brief.metrics ?? [
          t('blog.metric.launchWorkflows'),
          t('blog.metric.cutReviewTime'),
        ],
      },
    ];

    return {
      title: brief.title,
      subtitle: brief.summary,
      intro,
      sections,
      outro: brief.callToAction ?? t('blog.outro.default'),
    };
  }

  private renderWhyNow(brief: ContentBrief): string {
    const { t } = this.i18n;
    const audience = `${brief.audience.role}${brief.audience.industry ? t('blog.audience.industry', { industry: brief.audience.industry }) : ''}`;
    const pains = brief.problems.slice(0, 2).join('; ');
    return t('blog.whyNow', {
      audience,
      pains,
      title: brief.title,
    });
  }
}
