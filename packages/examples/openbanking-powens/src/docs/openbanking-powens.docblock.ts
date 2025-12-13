import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.openbanking-powens',
    title: 'Open Banking — Powens (example)',
    summary:
      'Framework-neutral OAuth callback + webhook handler patterns for Powens, orchestrating canonical sync workflows.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/openbanking-powens',
    tags: ['openbanking', 'powens', 'integration', 'example'],
    body: `## What this example shows\n- OAuth callback handler: exchange auth code, map powens user, enqueue sync workflow.\n- Webhook handler: verify signature, route event → workflow, optionally refresh balances.\n\n## Guardrails\n- Secrets via secret providers/env only.\n- Verify webhook signatures.\n- Keep side effects explicit: enqueue workflows instead of mutating canonical stores inline.`,
  },
  {
    id: 'docs.examples.openbanking-powens.usage',
    title: 'Open Banking — Powens — Usage',
    summary: 'How to integrate the handlers in a fetch-compatible runtime.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/openbanking-powens/usage',
    tags: ['openbanking', 'usage'],
    body: `## Usage\n- Wire \\`powensOAuthCallbackHandler(req)\\` at your OAuth redirect route.\n- Wire \\`powensWebhookHandler(req)\\` at your webhook route.\n\n## Notes\n- Replace the fake stores with your app-layer persistence.\n- Enqueue ContractSpec workflows for canonical upserts and telemetry.`,
  },
];

registerDocBlocks(blocks);


