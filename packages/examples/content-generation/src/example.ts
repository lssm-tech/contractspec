import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'content-generation',
    version: '1.0.0',
    title: 'Content Generation',
    description:
      'Generate blog/landing/email/social/SEO assets from a typed ContentBrief using @contractspec/lib.content-gen.',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['content', 'marketing', 'generation', 'ai'],
  },
  docs: {
    rootDocId: 'docs.examples.content-generation',
    usageDocId: 'docs.examples.content-generation.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.content-generation',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
