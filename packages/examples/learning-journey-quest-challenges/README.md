# @lssm/example.learning-journey-quest-challenges

Time-bound challenge/quest example (7-day money reset) showing day-based unlocks and event-driven completion.

## What it shows

- Track steps that unlock by day since quest start
- Event-based completions for each day
- XP per day with completion bonus when finished within duration
- Optional recap via SRS mastery events

## How to run

1. `bun test packages/examples/learning-journey-quest-challenges`
2. Emit events in order with `recordEvent` from the registry:

```ts
recordEvent({ name: 'accounts.mapped', learnerId: 'u1' });
recordEvent({ name: 'transactions.categorized', learnerId: 'u1' });
// ...
```

## Adapting

- Swap events for your vertical (coliving integration week, artisan onboarding).
- Adjust unlock windows via `availability.unlockOnDay`.
- Tweak XP/bonus and add recap SRS mastery after completion.
