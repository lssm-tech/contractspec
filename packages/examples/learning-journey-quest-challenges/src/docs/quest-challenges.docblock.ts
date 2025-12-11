import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const questDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.quest-challenges',
    title: 'Learning Journey — Quest Challenges',
    summary:
      'Time-bound challenge pattern (7-day money reset) with day unlocks and event-driven completion.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/quest-challenges',
    tags: ['learning', 'quest', 'challenge'],
    body: `## Track
- **Key**: \`money_reset_7day\`
- **Duration**: 7 days, steps unlock day by day

## Steps & Events
- Day 1 \`day1_map_accounts\` → event \`accounts.mapped\`
- Day 2 \`day2_categorize_transactions\` → event \`transactions.categorized\`
- Day 3 \`day3_define_goals\` → event \`goals.created\`
- Day 4 \`day4_setup_recurring_savings\` → event \`recurring_rule.created\`
- Day 5 \`day5_review_subscriptions\` → event \`subscription.flagged_or_cancelled\`
- Day 6 \`day6_plan_emergency\` → event \`emergency_plan.completed\`
- Day 7 \`day7_review_commit\` → event \`quest.review.completed\`

XP: 15 per day, completion bonus 30 if finished within duration. Optional recap via SRS after completion.

## Usage
- Exported via \`@lssm/example.learning-journey.quest-challenges/track\`.
- Step availability uses \`availability.unlockOnDay\` to gate days.
- Registry progression handles event matching and XP application.`,
  },
];

registerDocBlocks(questDocBlocks);
