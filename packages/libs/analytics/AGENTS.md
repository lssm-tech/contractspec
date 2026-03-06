# AI Agent Guide — `@contractspec/lib.analytics`

Scope: `packages/libs/analytics/*`

Product analytics and growth metrics, including cohort analysis, funnel tracking, and PostHog integration.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps

## Public Exports

- `.` — main entry
- `./churn`
- `./cohort`
- `./funnel`
- `./growth`
- `./lifecycle`
- `./posthog`
- `./types`

## Guardrails

- Event naming conventions must stay consistent with PostHog taxonomy.
- Metric calculations affect live dashboards; verify formulas before changing.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
