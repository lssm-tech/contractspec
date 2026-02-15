import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import type {
  ContentBrief,
  GeneratedContent,
  GeneratorOptions,
} from '../types';

export class BlogGenerator {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;

  constructor(options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
    this.temperature = options?.temperature ?? 0.4;
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
              text: 'You are a product marketing writer. Produce JSON with title, subtitle, intro, sections[].heading/body/bullets, outro.',
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
    const intro = `Operators like ${brief.audience.role} teams face ${brief.problems
      .slice(0, 2)
      .join(' and ')}. ${brief.title} changes that by ${brief.summary}.`;

    const sections = [
      {
        heading: 'Why now',
        body: this.renderWhyNow(brief),
      },
      {
        heading: 'What you get',
        body: 'A focused stack built for policy-safe automation.',
        bullets: brief.solutions,
      },
      {
        heading: 'Proof it works',
        body: 'Teams using the blueprint report measurable wins.',
        bullets: brief.metrics ?? [
          'Launch workflows in minutes',
          'Cut review time by 60%',
        ],
      },
    ];

    return {
      title: brief.title,
      subtitle: brief.summary,
      intro,
      sections,
      outro:
        brief.callToAction ??
        'Ready to see it live? Spin up a sandbox in under 5 minutes.',
    };
  }

  private renderWhyNow(brief: ContentBrief): string {
    const audience = `${brief.audience.role}${brief.audience.industry ? ` in ${brief.audience.industry}` : ''}`;
    const pains = brief.problems.slice(0, 2).join('; ');
    return `${audience} teams are stuck with ${pains}. ${brief.title} delivers guardrails without slowing shipping.`;
  }
}
