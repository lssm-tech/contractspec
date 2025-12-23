import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.personalization',
    title: 'Personalization Patterns (example)',
    summary:
      'Behavior tracking, overlay-driven UI tweaks, and tenant workflow extension patterns.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/personalization',
    tags: ['personalization', 'overlays', 'workflows', 'example'],
    body: `## Includes\n- Behavior tracking + insight analysis.\n- Overlay customization (hide fields, rename labels).\n- Workflow extension (inject tenant-specific steps).\n\n## Guardrails\n- Keep tracking events structured and non-PII.\n- Keep overlays signed and scoped.\n- Keep workflow composition deterministic.`,
  },
  {
    id: 'docs.examples.personalization.usage',
    title: 'Personalization — Usage',
    summary: 'How to run the small examples and swap adapters.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/personalization/usage',
    tags: ['personalization', 'usage'],
    body: `## Usage\n- Call \`runBehaviorTrackingExample()\` for insights.\n- Call \`runOverlayCustomizationExample()\` to apply overlays.\n- Call \`composeTenantWorkflowExample()\` and \`logTenantWorkflowSteps()\` to inspect steps.\n\n## Notes\n- Replace in-memory stores with app-layer storage.\n- Keep PII out of logs and markdown outputs.`,
  },
];

registerDocBlocks(blocks);
