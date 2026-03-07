import { defineFeature } from '@contractspec/lib.contracts-spec';

export const ContentGenerationFeature = defineFeature({
  meta: {
    key: 'content-generation',
    version: '1.0.0',
    title: 'Content Generation',
    description:
      'AI content generation for blog posts, landing pages, emails, and social media',
    domain: 'content',
    owners: ['@examples'],
    tags: ['content', 'ai', 'generation'],
    stability: 'experimental',
  },

  docs: [
    'docs.examples.content-generation',
    'docs.examples.content-generation.usage',
  ],
});
