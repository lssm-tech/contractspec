import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.lifecycle-cli',
    title: 'Lifecycle CLI (demo)',
    summary:
      'Run a lifecycle assessment from a CLI using the lifecycle-managed bundle (no HTTP server required).',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/lifecycle-cli',
    tags: ['lifecycle', 'cli', 'example'],
    body: `## What this example shows\n- How to call \\`LifecycleAssessmentService\\` from a Node/Bun script.\n- How to wire mock analytics + questionnaire adapters.\n\n## Run\n- Use the exported function \\`runLifecycleCliDemo()\\` (or call it from your own CLI wrapper).\n\n## Notes\n- Keep outputs structured; avoid \\`console.log\\` in production paths.\n- This example is deterministic (fixed inputs → stable output).`,
  },
  {
    id: 'docs.examples.lifecycle-cli.usage',
    title: 'Lifecycle CLI — Usage',
    summary: 'How to run and tweak the lifecycle assessment demo.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/lifecycle-cli/usage',
    tags: ['lifecycle', 'cli', 'usage'],
    body: `## Usage\n1) Call \\`runLifecycleCliDemo()\\`.\n2) Adjust the mock metrics/answers to explore stage outcomes.\n\n## Guardrails\n- Avoid PII in logs.\n- Keep adapters explicit and deterministic for reproducible demos.`,
  },
];

registerDocBlocks(blocks);


