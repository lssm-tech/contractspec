import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'openbanking-powens',
    version: '1.0.0',
    title: 'Open Banking — Powens',
    description:
      'OAuth callback + webhook handler patterns for Powens open banking integration (provider + workflow orchestration).',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['openbanking', 'powens', 'oauth', 'webhooks', 'integrations'],
  },
  docs: {
    rootDocId: 'docs.examples.openbanking-powens',
    usageDocId: 'docs.examples.openbanking-powens.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.openbanking-powens',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;
