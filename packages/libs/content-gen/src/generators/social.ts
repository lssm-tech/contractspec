import type { ContentBrief, GeneratorOptions, SocialPost } from '../types';
import type { LLMProvider } from '@lssm/lib.contracts/integrations/providers/llm';

export class SocialPostGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;

  constructor(options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
  }

  async generate(brief: ContentBrief): Promise<SocialPost[]> {
    if (this.llm) {
      const posts = await this.generateWithLlm(brief);
      if (posts.length) return posts;
    }
    return this.generateFallback(brief);
  }

  private async generateWithLlm(brief: ContentBrief): Promise<SocialPost[]> {
    const response = await this.llm!.chat(
      [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'Create JSON array of social posts for twitter/linkedin/threads with body, hashtags, cta.',
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
    const hashtags = this.buildHashtags(brief);
    return [
      {
        channel: 'linkedin',
        body: `${brief.title}: ${brief.summary}\n${brief.problems[0]} → ${brief.solutions[0]}`,
        hashtags,
        cta: brief.callToAction ?? 'Book a 15-min run-through',
      },
      {
        channel: 'twitter',
        body: `${brief.solutions[0]} in <60s. ${brief.solutions[1] ?? ''}`.trim(),
        hashtags: hashtags.slice(0, 3),
        cta: '→ contractspec.chaman.ventures/sandbox',
      },
      {
        channel: 'threads',
        body: `Ops + policy can move fast. ${brief.title} automates guardrails so teams ship daily.`,
        hashtags: hashtags.slice(1, 4),
      },
    ];
  }

  private buildHashtags(brief: ContentBrief): string[] {
    const base = [
      brief.audience.industry ? `#${camel(brief.audience.industry)}` : '#operations',
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
