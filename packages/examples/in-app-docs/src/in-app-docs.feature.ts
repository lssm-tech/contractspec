import { defineFeature } from '@contractspec/lib.contracts-spec';

export const InAppDocsFeature = defineFeature({
  meta: {
    key: 'in-app-docs',
    version: '1.0.0',
    title: 'In-App Docs',
    description:
      'DocBlock-based in-app documentation viewer for non-technical users',
    domain: 'docs',
    owners: ['@examples'],
    tags: ['docs', 'in-app', 'viewer'],
    stability: 'experimental',
  },

  docs: ['docs.examples.in-app-docs', 'docs.examples.in-app-docs.usage'],
});
