# Studio Learning Events

Studio emits lightweight **learning/activity events** to support onboarding, ambient coaching, and learning journeys.

## Persistence model

- **Studio**: events are persisted to the database in `StudioLearningEvent` and are organization-scoped (optionally project-scoped).
- **Sandbox**: events remain **local-only** (unlogged); they must never be sent to backend services.

## GraphQL API

- `recordLearningEvent(input: { name, projectId?, payload? })`
- `myLearningEvents(projectId?, limit?)`
- `myOnboardingTracks(productId?, includeProgress?)`
- `myOnboardingProgress(trackKey)`
- `dismissOnboardingTrack(trackKey)`

## Common event names (convention)

- `module.navigated` — user navigated to a Studio module (payload at minimum: `{ moduleId }`).
- `studio.template.instantiated` — created a new Studio project (starter template). Payload commonly includes `{ templateId, projectSlug }`.
- `spec.changed` — created or updated a Studio spec. Payload may include `{ action: 'create' | 'update', specId?, specType? }`.
- `regeneration.completed` — finished a “regen/deploy” action (currently emitted on successful Studio deploy actions).
- `studio.evolution.applied` — completed an Evolution session (payload commonly includes `{ evolutionSessionId }`).

These events are intentionally minimal and must avoid PII/secrets in payloads.
