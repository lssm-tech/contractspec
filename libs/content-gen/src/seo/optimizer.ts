import type { ContentBrief, SeoMetadata } from '../types';

export class SeoOptimizer {
  optimize(brief: ContentBrief): SeoMetadata {
    const keywords = this.keywords(brief);
    const metaTitle = `${brief.title} | ContractSpec`;
    const metaDescription = `${brief.summary} — built for ${brief.audience.role}${brief.audience.industry ? ` in ${brief.audience.industry}` : ''}.`;
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

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private schema(
    brief: ContentBrief,
    description: string,
    keywords: string[]
  ): Record<string, unknown> {
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
        description: brief.callToAction ?? 'Start building with ContractSpec',
      },
      keywords: keywords.join(', '),
      citation: brief.references?.map((ref) => ref.url),
    };
  }
}
