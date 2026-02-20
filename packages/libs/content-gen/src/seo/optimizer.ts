import type { ContentBrief, SeoMetadata, GeneratorOptions } from '../types';
import { createContentGenI18n } from '../i18n';
import type { ContentGenI18n } from '../i18n';

export class SeoOptimizer {
  private readonly i18n: ContentGenI18n;

  constructor(options?: GeneratorOptions) {
    this.i18n = createContentGenI18n(options?.locale);
  }

  optimize(brief: ContentBrief): SeoMetadata {
    const { t } = this.i18n;
    const keywords = this.keywords(brief);
    const metaTitle = t('seo.metaTitle', { title: brief.title });
    const industrySuffix = brief.audience.industry
      ? t('seo.audience.industry', { industry: brief.audience.industry })
      : '';
    const metaDescription = t('seo.metaDescription', {
      summary: brief.summary,
      role: brief.audience.role,
      industry: industrySuffix,
    });
    const slug = this.slugify(brief.title);
    const schemaMarkup = this.schema(brief, metaDescription, keywords);
    return { metaTitle, metaDescription, keywords, slug, schemaMarkup };
  }

  private keywords(brief: ContentBrief): string[] {
    const base = [brief.title, ...brief.problems, ...brief.solutions];
    return [
      ...new Set(base.flatMap((entry) => entry.toLowerCase().split(/\s+/))),
    ]
      .filter((word) => word.length > 3)
      .slice(0, 12);
  }

  /**
   * Unicode-safe slug generator.
   *
   * Uses Unicode property escapes to preserve letters from any script
   * (Latin, Cyrillic, CJK, Arabic, etc.) while collapsing non-alphanumeric
   * characters into hyphens.
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics
      .replace(/[^\p{L}\p{N}]+/gu, '-') // non-letter/digit → hyphen
      .replace(/^-+|-+$/g, '');
  }

  private schema(
    brief: ContentBrief,
    description: string,
    keywords: string[]
  ): Record<string, unknown> {
    const { t } = this.i18n;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: brief.title,
      description,
      audience: {
        '@type': 'Audience',
        audienceType: brief.audience.role,
        industry: brief.audience.industry,
      },
      offers: {
        '@type': 'Offer',
        description: brief.callToAction ?? t('seo.offer.default'),
      },
      keywords: keywords.join(', '),
      citation: brief.references?.map((ref) => ref.url),
    };
  }
}
