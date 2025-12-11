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
- **Contracts**: enroll/resume/advance steps, complete quizzes, record streaks, assign XP, fetch progress dashboards.
- **Engines**: spaced-repetition (SRS), streak calculator, XP progression.
- **Events**: learner.enrolled, step.completed, quiz.scored, streak.reset, xp.awarded.

## Usage

1) Compose schema
- Include \`learningJourneySchemaContribution\` (entities export) in composition.

2) Register contracts/events
- Import from \`@lssm/module.learning-journey\` into your spec registry.

3) Bind to product actions
- Tie \`Step\` completion conditions to domain events (e.g., deal.created, agent.run.completed).
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
`,
  },
];

registerDocBlocks(learningJourneyDocBlocks);
