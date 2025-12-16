import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const docBlocks: DocBlock[] = [
  {
    id: 'docs.examples.versioned-knowledge-base.goal',
    title: 'Versioned Knowledge Base — Goal',
    summary:
      'Curated KB with immutable sources, versioned rules, and published snapshots referenced by answers.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/versioned-knowledge-base/goal',
    tags: ['knowledge', 'versioning', 'snapshots', 'traceability'],
    body: `## Why it matters
- Separates raw sources from curated knowledge.\n- Ensures assistant answers cite a published snapshot.\n- Makes change review and safe regeneration possible.\n\n## Core invariants\n- Sources are immutable and content-addressed (hash).\n- Rule versions must cite at least one source.\n- Snapshots include only approved rule versions.`,
  },
  {
    id: 'docs.examples.versioned-knowledge-base.reference',
    title: 'Versioned Knowledge Base — Reference',
    summary: 'Entities, contracts, and events for the versioned KB example.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/versioned-knowledge-base',
    tags: ['knowledge', 'reference'],
    body: `## Contracts\n- kb.ingestSource\n- kb.upsertRuleVersion\n- kb.approveRuleVersion\n- kb.publishSnapshot\n- kb.search\n\n## Events\n- kb.source.ingested\n- kb.ruleVersion.created\n- kb.ruleVersion.approved\n- kb.snapshot.published`,
  },
];

registerDocBlocks(docBlocks);



