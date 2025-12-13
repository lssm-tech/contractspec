import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.integration-stripe',
    title: 'Integration Example — Stripe Payments',
    summary:
      'How to wire IntegrationSpec/TenantAppConfig + blueprint + workflow to enable Stripe-backed payments.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/integration-stripe',
    tags: ['stripe', 'payments', 'integrations', 'example'],
    body: `## Included\n- App blueprint enabling \`payments.psp\` capability.\n- Workflow invoking Stripe operations (prepare → charge → confirm).\n- Tenant app config binding workflow to an IntegrationConnection.\n\n## Notes\n- Secrets live in secret providers; connection config is non-secret.\n- Use \`ctx.resolvedAppConfig\` in operation executors to access integrations, branding, and translations.`,
  },
  {
    id: 'docs.examples.integration-stripe.usage',
    title: 'Stripe Integration Example — Usage',
    summary: 'How to use the blueprint, workflow, and tenant config together.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/integration-stripe/usage',
    tags: ['stripe', 'usage'],
    body: `## Usage\n1) Register the blueprint + workflow + catalog in your registry.\n2) Persist an IntegrationConnection (see connection sample).\n3) Bind the tenant app config to the connection.\n\n## Guardrails\n- Never log secrets.\n- Keep payment semantics spec-defined; gate breaking changes behind flags.`,
  },
];

registerDocBlocks(blocks);
