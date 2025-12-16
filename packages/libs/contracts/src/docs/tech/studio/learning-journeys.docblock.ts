import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_learning_journeys_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.learning-journeys',
    title: 'Studio learning journeys (onboarding + coach)',
    summary:
      'DB-backed learning journeys tracked per organization: seeded tracks/steps, event-driven progress, XP/streaks, and a Studio coach surface.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/learning-journeys',
    tags: [
      'studio',
      'learning',
      'onboarding',
      'journey',
      'graphql',
      'database',
    ],
    body: `# Studio learning journeys

Studio supports **DB-backed learning journeys** (onboarding tracks + ambient coach tips) that are advanced by **recorded learning events**.

> See also: \`/docs/tech/studio/learning-events\` for event naming + payload guardrails.

## Scope (multi-tenancy)

- Progress is tracked **per organization** (tenant/workspace), via a \`Learner\` record keyed by \`(userId, organizationId)\`.
- Learning events are stored as \`StudioLearningEvent\` under the Studio DB schema, scoped to an organization (optionally a project).

## Persistence model (Prisma)

Learning journey progress lives in the \`lssm_learning\` schema:

- \`Learner\` — one per \`(userId, organizationId)\`
- \`OnboardingTrack\` — seeded track definitions (trackKey, name, metadata)
- \`OnboardingStep\` — seeded step definitions (stepKey, completionCondition, xpReward, metadata)
- \`OnboardingProgress\` — learner × track progress (progress %, xpEarned, completedAt, dismissedAt)
- \`OnboardingStepCompletion\` — append-only completion records (stepKey, status, xpEarned, completedAt)

## Track definition source (spec-first)

- Canonical track specs live in \`@lssm/example.learning-journey-registry\`.
- The Studio API seeds/updates the DB definitions via an idempotent “ensure tracks” routine.
- The DB is kept aligned with track specs (stale steps are removed) to prevent drift and unblock completion.

## Progress advancement (event-driven)

1) UI records an event via GraphQL \`recordLearningEvent\`
2) Backend creates \`StudioLearningEvent\`
3) Backend advances onboarding by matching the new event against step completion conditions
4) Backend persists step completions and recomputes:
   - \`progress\` percentage
   - \`xpEarned\` (including streak/completion bonuses when configured)
   - track completion state (\`completedAt\`)

## GraphQL API (Studio)

- \`myOnboardingTracks(productId?, includeProgress?)\`
  - returns all tracks + optional progress for the current learner
- \`myOnboardingProgress(trackKey)\`
  - returns progress + step completion list for a single track
- \`dismissOnboardingTrack(trackKey)\`
  - marks a track dismissed for the learner (prevents auto-coach)

## UI routes/surfaces (web)

- \`/studio/learning\` — learning hub (track list + progress widget)
- \`/studio/learning/{trackKey}\` — track detail (steps + map)
- Studio shell mounts a **coach sheet** that can auto-open for incomplete, non-dismissed onboarding.

## Security + data hygiene

- Do not put secrets/PII in \`payload\` fields of learning events.
- Prefer shallow payload filters (small, stable keys).
`,
  },
];

registerDocBlocks(tech_studio_learning_journeys_DocBlocks);

