import type {
  LLMProvider,
  LLMMessage,
} from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type { ImageBrief, ImagePrompt, ImageStyle } from '../types';
import type { ResolvedStyle } from './style-resolver';
import type { ImageGenI18n } from '../i18n/messages';

interface PromptBuilderOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
  i18n: ImageGenI18n;
}

export class PromptBuilder {
  private readonly llm?: LLMProvider;
  private readonly model?: string;
  private readonly temperature: number;
  private readonly i18n: ImageGenI18n;

  constructor(options: PromptBuilderOptions) {
    this.llm = options.llm;
    this.model = options.model;
    this.temperature = options.temperature ?? 0.4;
    this.i18n = options.i18n;
  }

  async build(
    brief: ImageBrief,
    resolvedStyle: ResolvedStyle
  ): Promise<ImagePrompt> {
    const style: ImageStyle = brief.style ?? 'photorealistic';
    const format = brief.format ?? 'png';

    if (this.llm) {
      try {
        return await this.buildWithLlm(brief, resolvedStyle, style, format);
      } catch {
        return this.buildDeterministic(brief, resolvedStyle, style, format);
      }
    }

    return this.buildDeterministic(brief, resolvedStyle, style, format);
  }

  private async buildWithLlm(
    brief: ImageBrief,
    resolvedStyle: ResolvedStyle,
    style: ImageStyle,
    format: 'png' | 'jpg' | 'webp' | 'svg'
  ): Promise<ImagePrompt> {
    const systemPrompt = this.i18n.t('prompt.system.imagePromptEngineer');
    const briefJson = JSON.stringify({
      title: brief.content.title,
      summary: brief.content.summary,
      problems: brief.content.problems,
      solutions: brief.content.solutions,
      purpose: brief.purpose,
      style,
      styleTokens: resolvedStyle.styleTokens,
    });

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: [{ type: 'text', text: systemPrompt }],
      },
      {
        role: 'user',
        content: [{ type: 'text', text: briefJson }],
      },
    ];

    const llm = this.llm;
    if (!llm) {
      throw new Error('LLM provider is required for buildWithLlm');
    }

    const response = await llm.chat(messages, {
      model: this.model,
      temperature: this.temperature,
    });

    const text = response.message.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('');

    return {
      text: text.trim(),
      negativeText: resolvedStyle.negativeTokens.join(', '),
      style,
      dimensions: resolvedStyle.dimensions,
      format,
    };
  }

  private buildDeterministic(
    brief: ImageBrief,
    resolvedStyle: ResolvedStyle,
    style: ImageStyle,
    format: 'png' | 'jpg' | 'webp' | 'svg'
  ): ImagePrompt {
    const parts: string[] = [
      brief.content.title,
      this.i18n.t('image.generate.description', {
        style,
        purpose: brief.purpose,
      }),
    ];

    if (brief.content.solutions.length > 0) {
      parts.push(
        this.i18n.t('image.prompt.featuring', {
          solutions: brief.content.solutions.slice(0, 3).join(', '),
        })
      );
    }

    if (brief.content.audience?.industry) {
      parts.push(
        this.i18n.t('image.prompt.industryContext', {
          industry: brief.content.audience.industry,
        })
      );
    }

    parts.push(...resolvedStyle.styleTokens);

    return {
      text: parts.join(', '),
      negativeText: resolvedStyle.negativeTokens.join(', '),
      style,
      dimensions: resolvedStyle.dimensions,
      format,
    };
  }
}
