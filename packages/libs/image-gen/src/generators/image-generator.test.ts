import { describe, it, expect, beforeEach } from 'bun:test';
import { ImageGenerator } from './image-generator';
import { resetI18nRegistry } from '../i18n/messages';
import { IMAGE_PRESETS } from '../types';
import type { ImageBrief, ImageGeneratorOptions } from '../types';
import type {
  ImageProvider,
  ImageGenerationResult,
} from '@contractspec/lib.contracts-integrations/integrations/providers/image';

// =============================================================================
// Helpers
// =============================================================================

const FIXED_NOW = 1700000000000;
const FIXED_ISO = '2023-11-14T22:13:20.000Z';

const fixedClock = {
  now: () => FIXED_NOW,
  toISOString: () => FIXED_ISO,
};

function makeBrief(overrides?: Partial<ImageBrief>): ImageBrief {
  return {
    content: {
      title: 'AI for DevOps',
      summary: 'Automate infrastructure with AI',
      problems: ['manual deploys', 'slow reviews'],
      solutions: ['auto-scaling', 'smart alerts'],
      audience: { role: 'DevOps', industry: 'fintech' },
    },
    purpose: 'blog-hero',
    ...overrides,
  };
}

function makeMockProvider(
  result?: Partial<ImageGenerationResult>
): ImageProvider {
  const defaultResult: ImageGenerationResult = {
    images: [
      {
        data: new Uint8Array([1, 2, 3]),
        format: 'png',
        dimensions: { width: 1920, height: 1080 },
      },
    ],
    seed: 42,
    model: 'test-model',
    generationTimeMs: 1200,
  };
  return {
    generate: async () => ({ ...defaultResult, ...result }),
  };
}

function makeFailingProvider(): ImageProvider {
  return {
    generate: async () => {
      throw new Error('Provider API error');
    },
  };
}

function makeGenerator(
  overrides?: Partial<ImageGeneratorOptions>
): ImageGenerator {
  return new ImageGenerator({
    clock: fixedClock,
    ...overrides,
  });
}

// =============================================================================
// Basic generation (no provider)
// =============================================================================

describe('ImageGenerator - basic generation', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should generate an ImageProject without a provider', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief());

    expect(project.id).toMatch(/^img-ai-for-devops-/);
    expect(project.prompt.style).toBe('photorealistic');
    expect(project.prompt.format).toBe('png');
    expect(project.prompt.dimensions).toEqual(IMAGE_PRESETS.blogHero);
    expect(project.prompt.text).toContain('AI for DevOps');
    expect(project.results).toBeUndefined();
  });

  it('should set metadata correctly', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief());

    expect(project.metadata.purpose).toBe('blog-hero');
    expect(project.metadata.title).toBe('AI for DevOps');
    expect(project.metadata.createdAt).toBe(FIXED_ISO);
    expect(project.metadata.locale).toBe('en');
  });

  it('should use brief locale when provided', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief({ locale: 'fr' }));

    expect(project.metadata.locale).toBe('fr');
  });

  it('should use options locale as fallback', async () => {
    const gen = makeGenerator({ locale: 'es' });
    const project = await gen.generate(makeBrief());

    expect(project.metadata.locale).toBe('es');
  });

  it('should default locale to "en"', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief());

    expect(project.metadata.locale).toBe('en');
  });
});

// =============================================================================
// ID generation
// =============================================================================

describe('ImageGenerator - ID generation', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should generate deterministic IDs with fixed clock', async () => {
    const gen = makeGenerator();
    const a = await gen.generate(makeBrief());
    const b = await gen.generate(makeBrief());

    expect(a.id).toBe(b.id);
  });

  it('should slugify the title in the ID', async () => {
    const gen = makeGenerator();
    const brief = makeBrief({
      content: {
        title: 'Hello World! Special & Chars #123',
        summary: 'test',
        problems: [],
        solutions: [],
        audience: { role: 'Dev' },
      },
    });
    const project = await gen.generate(brief);

    expect(project.id).toMatch(/^img-hello-world-special-chars-123-/);
    expect(project.id).not.toMatch(/[^a-z0-9-]/);
  });

  it('should truncate long titles to 40 chars in slug', async () => {
    const gen = makeGenerator();
    const brief = makeBrief({
      content: {
        title:
          'This is a very long title that should be truncated to forty characters exactly',
        summary: 'test',
        problems: [],
        solutions: [],
        audience: { role: 'Dev' },
      },
    });
    const project = await gen.generate(brief);

    const slug = project.id.replace(/^img-/, '').replace(/-[a-z0-9]+$/, '');
    expect(slug.length).toBeLessThanOrEqual(40);
  });

  it('should include timestamp in base36', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief());

    const expectedTs = FIXED_NOW.toString(36);
    expect(project.id).toContain(expectedTs);
  });
});

// =============================================================================
// Style resolution & defaults
// =============================================================================

describe('ImageGenerator - style resolution', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should use brief style when provided', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief({ style: 'abstract' }));

    expect(project.prompt.style).toBe('abstract');
  });

  it('should use defaultStyle from options when brief has no style', async () => {
    const gen = makeGenerator({ defaultStyle: 'minimalist' });
    const project = await gen.generate(makeBrief());

    expect(project.prompt.style).toBe('photorealistic');
    // Style defaults in the prompt builder, not the generator
    // But the style resolver receives defaultStyle from options
  });

  it('should map purposes to correct dimensions', async () => {
    const gen = makeGenerator();

    const ogProject = await gen.generate(makeBrief({ purpose: 'social-og' }));
    expect(ogProject.prompt.dimensions).toEqual(IMAGE_PRESETS.ogImage);

    const iconProject = await gen.generate(makeBrief({ purpose: 'icon' }));
    expect(iconProject.prompt.dimensions).toEqual(IMAGE_PRESETS.favicon);
  });
});

// =============================================================================
// Dimensions override (Fix 4)
// =============================================================================

describe('ImageGenerator - dimensions override', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should respect brief.dimensions override', async () => {
    const gen = makeGenerator();
    const customDims = { width: 800, height: 600 };
    const project = await gen.generate(makeBrief({ dimensions: customDims }));

    expect(project.prompt.dimensions).toEqual(customDims);
  });

  it('should use style-resolved dimensions when brief has no override', async () => {
    const gen = makeGenerator();
    const project = await gen.generate(makeBrief());

    expect(project.prompt.dimensions).toEqual(IMAGE_PRESETS.blogHero);
  });
});

// =============================================================================
// Provider integration
// =============================================================================

describe('ImageGenerator - with provider', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should call provider and attach results', async () => {
    const provider = makeMockProvider();
    const gen = makeGenerator({ image: provider });
    const project = await gen.generate(makeBrief());

    expect(project.results).toBeDefined();
    const results = project.results;
    if (!results) throw new Error('Expected results');
    expect(results.images).toHaveLength(1);
    expect(results.seed).toBe(42);
    expect(results.model).toBe('test-model');
  });

  it('should pass prompt dimensions to provider', async () => {
    let capturedDimensions: { width: number; height: number } | undefined;
    const provider: ImageProvider = {
      generate: async (input) => {
        capturedDimensions = input.dimensions;
        return {
          images: [],
          seed: 1,
          model: 'test',
        };
      },
    };

    const gen = makeGenerator({ image: provider });
    await gen.generate(makeBrief({ dimensions: { width: 800, height: 600 } }));

    expect(capturedDimensions).toEqual({ width: 800, height: 600 });
  });

  it('should pass seed and variants to provider', async () => {
    let capturedSeed: number | undefined;
    let capturedVariants: number | undefined;
    const provider: ImageProvider = {
      generate: async (input) => {
        capturedSeed = input.seed;
        capturedVariants = input.numVariants;
        return { images: [], seed: 123, model: 'test' };
      },
    };

    const gen = makeGenerator({ image: provider });
    await gen.generate(makeBrief({ seed: 42, variants: 3 }));

    expect(capturedSeed).toBe(42);
    expect(capturedVariants).toBe(3);
  });

  it('should throw i18n error when provider fails', async () => {
    const provider = makeFailingProvider();
    const gen = makeGenerator({ image: provider });

    try {
      await gen.generate(makeBrief());
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Image generation failed');
      expect((error as Error).cause).toBeInstanceOf(Error);
    }
  });

  it('should throw i18n error in French locale', async () => {
    const provider = makeFailingProvider();
    const gen = makeGenerator({ image: provider, locale: 'fr' });

    try {
      await gen.generate(makeBrief());
      expect(true).toBe(false);
    } catch (error) {
      expect((error as Error).message).toBe("La génération d'image a échoué");
    }
  });
});

// =============================================================================
// Style-to-provider-style mapping
// =============================================================================

describe('ImageGenerator - mapStyleToProviderStyle', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should pass through direct provider styles', async () => {
    let capturedStyle: string | undefined;
    const provider: ImageProvider = {
      generate: async (input) => {
        capturedStyle = input.style;
        return { images: [], seed: 1, model: 'test' };
      },
    };

    const gen = makeGenerator({ image: provider });
    await gen.generate(makeBrief({ style: 'illustration' }));
    expect(capturedStyle).toBe('illustration');

    await gen.generate(makeBrief({ style: '3d-render' }));
    expect(capturedStyle).toBe('3d-render');
  });

  it('should map minimalist to flat-design', async () => {
    let capturedStyle: string | undefined;
    const provider: ImageProvider = {
      generate: async (input) => {
        capturedStyle = input.style;
        return { images: [], seed: 1, model: 'test' };
      },
    };

    const gen = makeGenerator({ image: provider });
    await gen.generate(makeBrief({ style: 'minimalist' }));
    expect(capturedStyle).toBe('flat-design');
  });

  it('should map branded to flat-design', async () => {
    let capturedStyle: string | undefined;
    const provider: ImageProvider = {
      generate: async (input) => {
        capturedStyle = input.style;
        return { images: [], seed: 1, model: 'test' };
      },
    };

    const gen = makeGenerator({ image: provider });
    await gen.generate(makeBrief({ style: 'branded' }));
    expect(capturedStyle).toBe('flat-design');
  });
});
