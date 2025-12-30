import type { ContentBrief, ContentBlock, GeneratorOptions } from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts/integrations/providers/llm';

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

  constructor(private readonly options?: GeneratorOptions) {
    this.llm = options?.llm;
    this.model = options?.model;
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
              text: 'Write JSON landing page copy with hero/highlights/socialProof/faq arrays.',
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
    return {
      hero: {
        eyebrow: `${brief.audience.industry ?? 'Operations'} teams`,
        title: brief.title,
        subtitle: brief.summary,
        primaryCta: brief.callToAction ?? 'Launch a sandbox',
        secondaryCta: 'View docs',
      },
      highlights: brief.solutions.slice(0, 3).map((solution, index) => ({
        heading:
          [
            'Policy-safe by default',
            'Auto-adapts per tenant',
            'Launch-ready in days',
          ][index] ?? 'Key capability',
        body: solution,
      })),
      socialProof: {
        heading: 'Teams using ContractSpec',
        body:
          brief.proofPoints?.join('\n') ??
          '“We ship compliant workflows 5x faster while cutting ops toil in half.”',
      },
      faq: this.buildFaq(brief),
    };
  }

  private buildFaq(brief: ContentBrief): ContentBlock[] {
    const faqs: ContentBlock[] = [
      {
        heading: 'How does this keep policies enforced?',
        body: 'All workflows compile from TypeScript specs and pass through PDP checks before execution, so no shadow logic slips through.',
      },
      {
        heading: 'Will it fit our existing stack?',
        body: 'Runtime adapters plug into REST, GraphQL, or MCP. Integrations stay vendor agnostic.',
      },
    ];
    if (brief.complianceNotes?.length) {
      faqs.push({
        heading: 'What about compliance requirements?',
        body: brief.complianceNotes.join(' '),
      });
    }
    return faqs;
  }
}
