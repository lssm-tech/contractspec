import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const docBlocks: DocBlock[] = [
  {
    id: 'docs.examples.kb-update-pipeline.goal',
    title: 'KB Update Pipeline — Goal',
    summary:
      'Automation proposes KB patches; humans verify; publishing is blocked until approvals are complete.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/kb-update-pipeline/goal',
    tags: ['knowledge', 'pipeline', 'hitl', 'audit'],
    body: `## Why it matters
- Keeps humans as the verifiers (HITL) while automation does the busywork.\n- Produces an auditable chain: source change -> diff -> proposal -> review -> publish.\n\n## Guardrails\n- High-risk changes require expert approval.\n- Publishing fails if any included rule versions are not approved.\n- Review requests emit notifications/events.`,
  },
  {
    id: 'docs.examples.kb-update-pipeline.reference',
    title: 'KB Update Pipeline — Reference',
    summary:
      'Entities, contracts, and events for the KB update pipeline example.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/kb-update-pipeline',
    tags: ['knowledge', 'reference'],
    body: `## Contracts\n- kbPipeline.runWatch\n- kbPipeline.createReviewTask\n- kbPipeline.submitDecision\n- kbPipeline.publishIfReady\n\n## Events\n- kb.change.detected\n- kb.change.summarized\n- kb.patch.proposed\n- kb.review.requested\n- kb.review.decided`,
  },
];

registerDocBlocks(docBlocks);



