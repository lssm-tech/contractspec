# AI-Native Channel Runtime - Execution Tracker

Last updated: 2026-02-26
Status: In progress
Owner: Platform Integrations + AI Runtime

## Purpose

This file is the long-term execution log for the AI-native channel runtime initiative.
It tracks scope, decisions, progress, risks, and next actions so work can continue
across sessions without losing context.

## Mission

Build one AI-native decision runtime that powers support + PR assistant workflows
across messaging channels with deterministic safety and durable Postgres reliability.

## V1 Scope Lock

Included:

- Slack
- GitHub (PR and commit workflows)
- WhatsApp Meta (primary)
- WhatsApp Twilio (fallback, active-passive)

Deferred:

- Discord
- Reddit/community connectors
- Dual-active WhatsApp
- Cross-channel rich interaction parity

## Core Invariants

1. Ack-fast: verify + dedupe claim + enqueue under webhook timeout budget.
2. Postgres is source of truth for correctness (no Redis requirement).
3. At-least-once inbound tolerated; outbound side effects deduped durably.
4. Policy-first autonomy: every action passes risk policy before side effects.
5. Full traceability: inbound event -> AI decision -> outbound attempt.

## Canonical Runtime Loop

InboundEvent -> Decision -> OutboundAction -> Outcome

## Planned Artifacts

### Specs and Contracts

- New integration category support for messaging connectors.
- Provider specs:
  - messaging.slack
  - messaging.github
  - messaging.whatsapp.meta
  - messaging.whatsapp.twilio
- Channel runtime operations/events for ingest, decisioning, dispatch, feedback.

### Reliability Data Model (Postgres)

- channel_event_receipts
- channel_threads
- channel_ai_decisions
- channel_outbox_actions
- channel_delivery_attempts

### Runtime and App Wiring

- Messaging provider interface + factory wiring.
- Webhook ingress handlers in app layer.
- Async dispatch with retries and dead-letter handling.

## Milestones

### M0 - Plan and Contract Baseline

Status: Completed
Exit criteria:

- RFC scope + invariants locked in this file.
- Contracts and provider specs scaffolded.

### M1 - Slack Vertical Slice

Status: Completed
Exit criteria:

- Signed webhook ingest works end-to-end.
- Dedupe + outbox + retries validated.
- Policy gates enforce safe autonomy.

### M2 - GitHub Workflow Slice

Status: In progress
Exit criteria:

- PR/commit event normalization integrated.
- Draft/comment actions routed through outbox.

### M3 - WhatsApp Meta Primary

Status: In progress
Exit criteria:

- Inbound + outbound flows running with policy + idempotency.

### M4 - WhatsApp Twilio Fallback

Status: In progress
Exit criteria:

- Active-passive routing with safe failover.

## Decision Log

- 2026-02-26: Use Postgres for idempotency and outbox correctness; Redis not required.
- 2026-02-26: Vercel cache can be used as optional performance layer only.
- 2026-02-26: WhatsApp providers support both Meta and Twilio.
- 2026-02-26: Twilio path is fallback in active-passive mode for v1.
- 2026-02-26: Scope reduced to Slack/GitHub/WhatsApp for faster delivery.
- 2026-02-26: Added new integration category `messaging` to shared type systems.
- 2026-02-26: Added provider specs for Slack, GitHub, WhatsApp Meta, and WhatsApp Twilio.
- 2026-02-26: Added messaging provider interface and factory wiring in provider impls.
- 2026-02-26: Added spec skeleton document for channel runtime contracts/events and Postgres schema.
- 2026-02-26: Added channel runtime package scaffolding in `@contractspec/integration.runtime/channel`.
- 2026-02-26: Added Slack webhook ingress endpoint with signature verification and ack-fast ingest path.
- 2026-02-26: Added Postgres persistence implementation for receipts, thread state, decisions, and outbox.
- 2026-02-26: Added replay fixtures and policy gate tests for messaging decision pipeline.
- 2026-02-26: Added outbox dispatcher with retry/dead-letter flow and provider sender abstraction.
- 2026-02-26: Added GitHub and WhatsApp (Meta + Twilio) webhook ingress routes using shared runtime service.
- 2026-02-26: Added telemetry hooks for ingest, decision, outbox, and dispatch stages.
- 2026-02-26: Added API-level integration tests for Slack, GitHub, Meta WhatsApp, and Twilio webhook -> outbox -> dispatch flows.
- 2026-02-26: Fixed Slack integration test signature timestamp drift by using a runtime timestamp within verification tolerance.
- 2026-02-26: Resolved api-library TypeScript issues in channel dispatch handler/scheduler and restored build health.

## Risks and Mitigations

1. Duplicate outbound side effects
   - Mitigation: unique idempotency keys on outbox actions.
2. Replay attacks / signature bypass
   - Mitigation: raw-body signature verification + timestamp skew checks.
3. Prompt injection and unsafe autonomy
   - Mitigation: risk-tier policy matrix + blocked action classes + escalation.
4. Provider-specific event disorder
   - Mitigation: thread ordering checks + stale-event handling.

## Open Questions

- Which app should be the long-term ingress host: api-library or dedicated channel ingress app?
- Which approval surface is preferred for assist mode actions (GitHub comment, Linear issue, or both)?

## Working Checklist

- [x] Create long-term progress tracker file.
- [x] Add messaging category + provider specs and registry wiring.
- [x] Add messaging provider interface + provider factory wiring.
- [x] Scaffold channel runtime contracts/events.
- [x] Add webhook ingress slice for first provider.
- [x] Add Postgres idempotency + outbox persistence layer.
- [x] Add replay fixtures and policy tests.
- [x] Ship Slack v1 slice.
- [x] Add outbox dispatcher worker path.
- [x] Add GitHub and WhatsApp ingress routes.
- [x] Add telemetry emission for runtime stages.
- [x] Add end-to-end API integration tests for Slack/GitHub/Twilio dispatch path.

## Completed Implementation (Current Session)

1. Created tracker and runtime spec docs:
   - docs/ai-native-channel-runtime-progress.md
   - docs/ai-native-channel-runtime-spec.md
2. Added `messaging` integration category in shared spec/type surfaces:
   - packages/libs/contracts-spec/src/integrations/spec.ts
   - packages/libs/contracts-integrations/src/integrations/spec.ts
   - packages/apps/cli-contractspec/src/types.ts
   - packages/modules/workspace/src/types/spec-types.ts
   - packages/bundles/workspace/src/types.ts
3. Added messaging provider specs and registry wiring in both contract libraries:
   - messaging.slack
   - messaging.github
   - messaging.whatsapp.meta
   - messaging.whatsapp.twilio
4. Added messaging provider interface and implementation factory support:
   - packages/libs/contracts-integrations/src/integrations/providers/messaging.ts
   - packages/integrations/providers-impls/src/impls/messaging-\*.ts
   - packages/integrations/providers-impls/src/impls/provider-factory.ts
5. Added and passed targeted test updates.
6. Added channel runtime components in integration runtime package:
   - packages/integrations/runtime/src/channel/types.ts
   - packages/integrations/runtime/src/channel/policy.ts
   - packages/integrations/runtime/src/channel/store.ts
   - packages/integrations/runtime/src/channel/memory-store.ts
   - packages/integrations/runtime/src/channel/postgres-store.ts
   - packages/integrations/runtime/src/channel/service.ts
   - packages/integrations/runtime/src/channel/slack.ts
7. Added webhook ingress wiring for Slack:
   - packages/apps/api-library/src/handlers/slack-webhook-handler.ts
   - packages/apps/api-library/src/index.ts
8. Added replay + policy + Slack + service + store tests:
   - packages/integrations/runtime/src/channel/policy.test.ts
   - packages/integrations/runtime/src/channel/replay.test.ts
   - packages/integrations/runtime/src/channel/slack.test.ts
   - packages/integrations/runtime/src/channel/service.test.ts
   - packages/integrations/runtime/src/channel/postgres-store.test.ts
9. Added outbox dispatch engine and tests:
   - packages/integrations/runtime/src/channel/dispatcher.ts
   - packages/integrations/runtime/src/channel/dispatcher.test.ts
10. Added GitHub and WhatsApp normalization + verification helpers:

- packages/integrations/runtime/src/channel/github.ts
- packages/integrations/runtime/src/channel/whatsapp-meta.ts
- packages/integrations/runtime/src/channel/whatsapp-twilio.ts

11. Added GitHub and WhatsApp webhook handlers and dispatch endpoint in API app:

- packages/apps/api-library/src/handlers/github-webhook-handler.ts
- packages/apps/api-library/src/handlers/whatsapp-webhook-handler.ts
- packages/apps/api-library/src/handlers/channel-dispatch-handler.ts
- packages/apps/api-library/src/handlers/channel-runtime-resources.ts

## Notes for Future Sessions

- Prefer additive changes and preserve backwards compatibility in public package exports.
- Keep app layer thin; shared logic belongs in modules/libs.
- Update both source exports and publish exports when adding public entrypoints.
