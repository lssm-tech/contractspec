import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'integration-stripe',
    version: '1.0.0',
    title: 'Integration — Stripe Payments',
    description:
      'Wire AppBlueprint + Workflow + TenantAppConfig to enable Stripe-backed payments (spec-first integration pattern).',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['stripe', 'payments', 'integration', 'blueprint', 'workflow'],
  },
  docs: {
    rootDocId: 'docs.examples.integration-stripe',
    usageDocId: 'docs.examples.integration-stripe.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.integration-stripe',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;
