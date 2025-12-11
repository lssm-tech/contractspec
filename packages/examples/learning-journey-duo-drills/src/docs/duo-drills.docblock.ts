import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const duoDrillsDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.duo-drills',
    title: 'Learning Journey — Duo Drills',
    summary:
      'Short drill/SRS example with XP and streak hooks for language, finance, or ContractSpec concept drills.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/duo-drills',
    tags: ['learning', 'drills', 'srs', 'xp'],
    body: `## Track
- **Key**: \`drills_language_basics\`
- **Persona**: learner running quick drills (language/finance/spec concepts)
- **Goal**: complete first session, maintain high-accuracy sessions, master cards in the first skill

## Steps & Conditions
1) \`complete_first_session\` → event \`drill.session.completed\`
2) \`reach_accuracy_threshold\` → count 3 sessions with payload \`accuracyBucket: "high"\` (within default window)
3) \`unlock_new_skill\` → SRS mastery: \`drill.card.mastered\` events with \`mastery >= 0.8\`, count 5 cards

XP: 20 + 30 + 40. Streak: daily session completion can be used to drive streak rewards.

## Wiring
- Tracks export from \`@lssm/example.learning-journey.duo-drills/track\`.
- Use registry helper \`recordEvent\` to advance steps from drill/session events.
- SRS mastery events should include payload: \`{ skillId, mastery }\`.`,
  },
];

registerDocBlocks(duoDrillsDocBlocks);
