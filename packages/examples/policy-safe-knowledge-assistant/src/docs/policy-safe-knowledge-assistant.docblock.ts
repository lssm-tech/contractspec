import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const docBlocks: DocBlock[] = [
  {
    id: 'docs.examples.policy-safe-knowledge-assistant.goal',
    title: 'Policy-safe Knowledge Assistant — Goal',
    summary:
      'End-to-end example: versioned KB snapshots + locale/jurisdiction gating + HITL pipeline + learning hub.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/policy-safe-knowledge-assistant/goal',
    tags: ['assistant', 'knowledge', 'policy', 'hitl', 'learning'],
    body: `## What this template proves\n- Assistant answers are structured and must cite a KB snapshot (or refuse).\n- Locale + jurisdiction are mandatory inputs for every assistant call.\n- Automation proposes KB patches; humans verify; publishing stays blocked until approvals.\n- Learning hub demonstrates drills + coaching + quests without spam.\n\n## Offline-first\n- Seeded fixtures are deterministic and require no external services.\n- Optional non-authoritative fallback can be added behind a single feature flag (disabled by default).`,
  },
  {
    id: 'docs.examples.policy-safe-knowledge-assistant.usage',
    title: 'Policy-safe Knowledge Assistant — Usage',
    summary: '5–10 minute sandbox walkthrough for developers.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/policy-safe-knowledge-assistant/usage',
    tags: ['assistant', 'knowledge', 'usage'],
    body: `## Demo walkthrough (high level)\n1) Onboard: set locale + jurisdiction.\n2) Publish snapshot: ingest source -> propose rule -> approve -> publish.\n3) Ask assistant: must pass gate and cite snapshot.\n4) Simulate change: watcher -> review -> publish new snapshot.\n5) Learning hub: drills session, ambient tip, quest start + step completion.`,
  },
];

registerDocBlocks(docBlocks);


