import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const ambientCoachDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.ambient-coach',
    title: 'Learning Journey — Ambient Coach',
    summary:
      'Context-aware coaching pattern that triggers tips, shows them, and marks completion when users act or acknowledge.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/ambient-coach',
    tags: ['learning', 'coach', 'tips'],
    body: `## Tracks
- \`money_ambient_coach\`: cash buffer too high, no savings goal, irregular savings
- \`coliving_ambient_coach\`: noise late evening, guest frequency high, shared space conflicts

## Steps & Events
- Trigger tip: \`coach.tip.triggered\` (payload includes \`tipId\`)
- Show tip (optional UI emission): \`coach.tip.shown\`
- Complete when acknowledged or follow-up action taken:
  - \`coach.tip.acknowledged\`
  - \`coach.tip.follow_up_action_taken\`

## Usage
- Tracks export from \`@contractspec/example.learning-journey-ambient-coach/track\`.
- Registry progression is event-driven; payload filters can scope tips per category.
- XP/engagement can be awarded on completion of each tip step.`,
  },
];

registerDocBlocks(ambientCoachDocBlocks);
