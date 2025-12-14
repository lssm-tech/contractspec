import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_learning_events_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.learning-events',
    title: 'Studio Learning Events',
    summary:
      'Studio persists learning/activity events to the database; Sandbox keeps learning local-first and unlogged.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/learning-events',
    tags: ['studio', 'learning', 'events', 'analytics', 'sandbox'],
    body: `# Studio Learning Events

Studio emits lightweight **learning/activity events** to support onboarding, ambient coaching, and learning journeys.

## Persistence model

- **Studio**: events are persisted to the database in \`StudioLearningEvent\` and are organization-scoped (optionally project-scoped).
- **Sandbox**: events remain **local-only** (unlogged); they must never be sent to backend services.

## GraphQL API

- \`recordLearningEvent(input: { name, projectId?, payload? })\`
- \`myLearningEvents(projectId?, limit?)\`

## Common event names (convention)

- \`module.navigated\` — user navigated to a module (payload: \`{ moduleId }\`).
- \`project.created\` — created a project.
- \`project.deleted\` — deleted a project (soft delete).
- \`spec.saved\` — saved spec content.
- \`canvas.draft_saved\` — saved a canvas draft.
- \`deploy.triggered\` — triggered a deployment.

These events are intentionally minimal and must avoid PII/secrets in payloads.
`,
  },
];

registerDocBlocks(tech_studio_learning_events_DocBlocks);


