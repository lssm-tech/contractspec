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
- \`myOnboardingTracks(productId?, includeProgress?)\`
- \`myOnboardingProgress(trackKey)\`
- \`dismissOnboardingTrack(trackKey)\`

## Common event names (convention)

- \`module.navigated\` — user navigated to a Studio module (payload at minimum: \`{ moduleId }\`).
- \`studio.template.instantiated\` — created a new Studio project (starter template). Payload commonly includes \`{ templateId, projectSlug }\`.
- \`spec.changed\` — created or updated a Studio spec. Payload may include \`{ action: 'create' | 'update', specId?, specType? }\`.
- \`regeneration.completed\` — finished a “regen/deploy” action (currently emitted on successful Studio deploy actions).
- \`studio.evolution.applied\` — completed an Evolution session (payload commonly includes \`{ evolutionSessionId }\`).

These events are intentionally minimal and must avoid PII/secrets in payloads.
`,
  },
];

registerDocBlocks(tech_studio_learning_events_DocBlocks);




