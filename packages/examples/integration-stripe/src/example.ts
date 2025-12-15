const example = {
  id: 'integration-stripe',
  title: 'Integration — Stripe Payments',
  summary:
    'Wire AppBlueprint + Workflow + TenantAppConfig to enable Stripe-backed payments (spec-first integration pattern).',
  tags: ['stripe', 'payments', 'integration', 'blueprint', 'workflow'],
  kind: 'integration',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.integration-stripe',
    usageDocId: 'docs.examples.integration-stripe.usage',
  },
  entrypoints: {
    packageName: '@lssm/example.integration-stripe',
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
