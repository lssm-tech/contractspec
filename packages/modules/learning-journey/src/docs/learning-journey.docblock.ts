import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const learningJourneyDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.engine',
    title: 'Learning Journey Engine',
    summary:
      'Tracks learners, tracks/modules/steps, progress, quizzes, streaks, XP, and AI coaching hooks for product-integrated onboarding.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/engine',
    tags: ['learning', 'onboarding', 'journey', 'education'],
    body: `## Capabilities

- **Entities**: Learner, Track, Module, Step, Progress, Quiz, Flashcard, AI Coach, Gamification (XP, streaks, badges).
- **Contracts**: enroll/resume/advance steps, complete quizzes, record streaks, assign XP, fetch progress dashboards, onboarding list/progress/recordEvent.
- **Engines**: spaced-repetition (SRS), streak calculator, XP progression.
- **Events**: learner.enrolled, step.completed, quiz.scored, streak.reset, xp.awarded, onboarding.started/completed/step_completed.

## Usage

1) Compose schema
- Include \`learningJourneySchemaContribution\` (entities export) in composition.

2) Register contracts/events
- Import from \`@lssm/module.learning-journey\` into your spec registry.

3) Bind to product actions
- Tie \`Step\` completion conditions (event name/version/source + optional payload filter) to domain events (e.g., deal.created, agent.run.completed).
- Trigger notifications via Notification Center and audits on completion.

4) Gamification
- Use \`XP\` and \`Streak\` engines to update learner stats; emit analytics for UI.

## Example

${'```'}ts
import { learningJourneyEntities } from '@lssm/module.learning-journey';
import { StreakEngine } from '@lssm/module.learning-journey/engines';

const streak = new StreakEngine({ graceDays: 1 });
const updated = streak.compute({ lastActiveAt: new Date(), today: new Date() });
${'```'},

## Guardrails

- Keep steps bound to real product events, not just button clicks.
- Avoid storing PII in content; keep org/user scoping for multi-tenant isolation.
- Emit analytics and audit logs for completions; respect \`prefers-reduced-motion\` in UIs consuming these specs.
- Track completion bonuses: \`completionXpBonus\`, \`completionBadgeKey\`, optional \`streakHoursWindow\` + \`streakBonusXp\`.
`,
  },
  {
    id: 'docs.learning-journey.goal',
    title: 'Learning Journey — Goal',
    summary:
      'Why the learning journey engine exists and the outcomes it targets.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/learning-journey/goal',
    tags: ['learning', 'goal'],
    body: `## Why it matters
- Provides a regenerable onboarding/education engine tied to product signals.
- Keeps tracks, steps, quizzes, and gamification consistent across surfaces.

## Business/Product goal
- Drive activation and retention with measurable progress, SRS, and streaks.
- Allow product teams to adjust journeys safely via specs.

## Success criteria
- Journey changes regenerate UI/API/events without drift.
- Analytics/audit hooks exist for completions and streaks.`,
  },
  {
    id: 'docs.learning-journey.usage',
    title: 'Learning Journey — Usage',
    summary: 'How to compose, bind, and regenerate journeys safely.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/learning-journey/usage',
    tags: ['learning', 'usage'],
    body: `## Setup
1) Include \`learningJourneyEntities\` in schema composition.
2) Register contracts/events from \`@lssm/module.learning-journey\`.
3) Bind steps to real product events (e.g., deal.created, run.completed).

## Extend & regenerate
1) Update track/module/step definitions or quiz schemas in spec.
2) Regenerate to sync UI/API/events; mark PII paths where needed.
3) Use Feature Flags to trial new tracks or streak rules.

## Guardrails
- Avoid hardcoded progression; keep engines declarative.
- Emit analytics/audit for completions; respect user locale/accessibility in presentations.
- Keep content free of PII; scope learners by org/tenant.`,
  },
  {
    id: 'docs.learning-journey.constraints',
    title: 'Learning Journey — Constraints & Safety',
    summary:
      'Internal guardrails for progression, telemetry, and regeneration semantics.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/learning-journey/constraints',
    tags: ['learning', 'constraints', 'internal'],
    body: `## Constraints
- Progression (tracks/modules/steps) and engines (SRS, streaks, XP) must stay declarative in spec.
- Events to emit: learner.enrolled, step.completed, quiz.scored, streak.reset, xp.awarded.
- Regeneration should not change scoring/streak rules without explicit spec change.

## PII & Telemetry
- Mark PII (learner identifiers) and redact in presentations; keep telemetry aggregated when possible.
- Respect accessibility (prefers-reduced-motion) in UIs consuming these specs.

## Verification
- Add fixtures for streak/XP rule changes and quiz scoring.
- Ensure Notifications/Audit wiring persists for completions; analytics emitted for progress.
- Use Feature Flags to trial new tracks or reward rules; default safe/off.`,
  },
];

registerDocBlocks(learningJourneyDocBlocks);
