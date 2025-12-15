const example = {
  id: 'openbanking-powens',
  title: 'Open Banking — Powens',
  summary:
    'OAuth callback + webhook handler patterns for Powens open banking integration (provider + workflow orchestration).',
  tags: ['openbanking', 'powens', 'oauth', 'webhooks', 'integrations'],
  kind: 'integration',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.openbanking-powens',
    usageDocId: 'docs.examples.openbanking-powens.usage',
  },
  entrypoints: {
    packageName: '@lssm/example.openbanking-powens',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;
