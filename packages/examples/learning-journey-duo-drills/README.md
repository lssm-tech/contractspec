# @lssm/example.learning-journey-duo-drills

Drill-based learning journey example that demonstrates short SRS-driven drills, XP, and streak hooks. Tracks are defined in `src/track.ts` and can be reused for language, finance, or ContractSpec concept drills.

## What it shows

- Event-driven steps (`drill.session.completed`, `drill.card.mastered`)
- Count-based completion (reach accuracy threshold across multiple sessions)
- SRS mastery-based completion (master N cards in a skill)
- XP per card/session and daily streak (via registry progress logic)

## How to run

1. Build dependencies: `bun install`
2. Run tests: `bun test packages/examples/learning-journey-duo-drills`
3. Use the registry helper to emit events:

```ts
import {
  recordEvent,
  getProgress,
} from '@lssm/example.learning-journey-registry/api';
import { drillTracks } from '@lssm/example.learning-journey-duo-drills/track';

recordEvent({
  name: 'drill.session.completed',
  learnerId: 'u1',
  payload: { accuracyBucket: 'high' },
});
// ...
const progress = getProgress('drills_language_basics', 'u1');
```

## Adapting

- Swap skills/cards to represent language vocab, budgeting basics, or ContractSpec concepts.
- Tune count thresholds, mastery requirements, and XP rewards per step.
- Wire real drill events into the registry or your own progression handler.
