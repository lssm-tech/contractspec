import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.knowledge-canon',
    title: 'Knowledge Example — Product Canon Space',
    summary:
      'Bind the Product Canon KnowledgeSpaceSpec to a tenant and expose it to agents/workflows via ResolvedAppConfig.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/knowledge-canon',
    tags: ['knowledge', 'canon', 'example'],
    body: `## Included assets\n- Blueprint referencing a workflow depending on the Product Canon space.\n- Tenant app config binding the space to a workflow and agent scope.\n- Sample knowledge source configuration.\n- Helper to pick knowledge bindings from ResolvedAppConfig.\n\n## Guardrails\n- Keep sources scoped per tenant.\n- Keep secret fields out of config (use secret providers).\n- Enforce scope restrictions before answering.`,
  },
  {
    id: 'docs.examples.knowledge-canon.usage',
    title: 'Knowledge Canon — Usage',
    summary: 'How to register the space, configure sources, and route requests.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/knowledge-canon/usage',
    tags: ['knowledge', 'usage'],
    body: `## Usage\n1) Register the knowledge space spec in your KnowledgeSpaceRegistry.\n2) Persist the source config through knowledge CRUD operations.\n3) Compose ResolvedAppConfig and pass it to your workflow/agent runtime.\n4) Use helpers like \\`selectKnowledgeBindings\\` before dispatching to search/embedding.\n\n## Notes\n- Avoid logging PII.\n- Keep search results auditable and cite sources.`,
  },
];

registerDocBlocks(blocks);


