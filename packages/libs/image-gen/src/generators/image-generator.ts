import type {
  ImageBrief,
  ImageGeneratorOptions,
  ImageProject,
  ImageStyle,
} from '../types';
import { createImageGenI18n, type ImageGenI18n } from '../i18n/messages';
import { PromptBuilder } from './prompt-builder';
import { StyleResolver } from './style-resolver';

/** Default clock backed by the native `Date` API. */
const DEFAULT_CLOCK = {
  now: () => Date.now(),
  toISOString: () => new Date().toISOString(),
};

export class ImageGenerator {
  private readonly promptBuilder: PromptBuilder;
  private readonly styleResolver: StyleResolver;
  private readonly options: ImageGeneratorOptions;
  private readonly i18n: ImageGenI18n;
  private readonly clock: { now(): number; toISOString(): string };

  constructor(options?: ImageGeneratorOptions) {
    this.options = options ?? {};
    this.i18n = createImageGenI18n(options?.locale);
    this.clock = options?.clock ?? DEFAULT_CLOCK;

    this.styleResolver = new StyleResolver();
    this.promptBuilder = new PromptBuilder({
      llm: options?.llm,
      model: options?.model,
      temperature: options?.temperature,
      i18n: this.i18n,
    });
  }

  async generate(brief: ImageBrief): Promise<ImageProject> {
    const resolvedStyle = this.styleResolver.resolve(
      brief.purpose,
      brief.style ?? this.options.defaultStyle,
      brief.brandColors
    );

    const prompt = await this.promptBuilder.build(brief, resolvedStyle);

    // Fix 4: Respect brief.dimensions override
    if (brief.dimensions) {
      prompt.dimensions = brief.dimensions;
    }

    const id = this.generateId(brief);

    const project: ImageProject = {
      id,
      prompt,
      metadata: {
        purpose: brief.purpose,
        title: brief.content.title,
        createdAt: this.clock.toISOString(),
        locale: brief.locale ?? this.options.locale ?? 'en',
      },
    };

    if (this.options.image) {
      try {
        const results = await this.options.image.generate({
          prompt: prompt.text,
          negativePrompt: prompt.negativeText,
          dimensions: prompt.dimensions,
          format: prompt.format,
          style: this.mapStyleToProviderStyle(prompt.style),
          numVariants: brief.variants,
          seed: brief.seed,
        });
        project.results = results;
      } catch (error) {
        const message = this.i18n.t('image.error.generationFailed');
        throw new Error(
          message,
          error instanceof Error ? { cause: error } : undefined
        );
      }
    }

    return project;
  }

  private generateId(brief: ImageBrief): string {
    const slug = brief.content.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const ts = this.clock.now().toString(36);
    return `img-${slug}-${ts}`;
  }

  private mapStyleToProviderStyle(
    style: ImageStyle
  ):
    | 'photorealistic'
    | 'illustration'
    | '3d-render'
    | 'flat-design'
    | 'abstract'
    | undefined {
    const providerStyles = [
      'photorealistic',
      'illustration',
      '3d-render',
      'flat-design',
      'abstract',
    ] as const;

    if (providerStyles.includes(style as (typeof providerStyles)[number])) {
      return style as (typeof providerStyles)[number];
    }

    if (style === 'minimalist' || style === 'branded') {
      return 'flat-design';
    }

    return undefined;
  }
}
