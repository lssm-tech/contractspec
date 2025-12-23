const example = {
  id: 'content-generation',
  title: 'Content Generation',
  summary:
    'Generate blog/landing/email/social/SEO assets from a typed ContentBrief using @lssm/lib.content-gen.',
  tags: ['content', 'marketing', 'generation', 'ai'],
  kind: 'script',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.content-generation',
    usageDocId: 'docs.examples.content-generation.usage',
  },
  entrypoints: {
    packageName: '@lssm/example.content-generation',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;
