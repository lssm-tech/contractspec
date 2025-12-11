# @lssm/example.learning-journey.ambient-coach

Ambient coach learning journey example that surfaces contextual tips based on user behavior and marks completion when acknowledged or acted upon.

## What it shows

- Tip/insight model with trigger → show → acknowledge/action events
- Track steps for money and coliving behaviors
- Event and count-based completion with optional action follow-ups
- XP/engagement increments for acting on tips

## How to run

1. `bun test packages/examples/learning-journey-ambient-coach`
2. Use registry helper `recordEvent` with events like:

```ts
recordEvent({
  name: 'coach.tip.triggered',
  learnerId: 'u1',
  payload: { tipId: 'cash_buffer_too_high' },
});
recordEvent({
  name: 'coach.tip.follow_up_action_taken',
  learnerId: 'u1',
  payload: { tipId: 'cash_buffer_too_high' },
});
```

## Adapting

- Swap categories for your domain (money, coliving, product adoption).
- Adjust trigger payload filters to align with analytics events.
- Add more steps or split tracks per persona/segment.
