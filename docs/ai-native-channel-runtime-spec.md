# AI-Native Channel Runtime Spec Skeleton

Last updated: 2026-02-26
Status: Baseline implemented (Slack ingest + policy + Postgres store)

## Objective

Provide an implementation-ready skeleton for channel runtime contracts, events,
and Postgres persistence (idempotency + outbox) used by Slack, GitHub, and
WhatsApp providers.

## Canonical Runtime Flow

1. Inbound webhook arrives.
2. Signature and timestamp are verified on raw payload bytes.
3. Event receipt is claimed in Postgres with unique key.
4. Duplicate event exits early with success acknowledgement.
5. Decision pipeline computes action plan + risk tier.
6. Approved actions are persisted to outbox.
7. Dispatcher sends outbound actions with retries.
8. Delivery attempts and final outcome are persisted.

## Contract Keys (v1.0.0)

Commands:

- channel.inbound.ingest
- channel.decision.evaluate
- channel.action.enqueue
- channel.action.dispatch
- channel.feedback.record

Queries:

- channel.thread.get
- channel.action.status.get
- channel.capabilities.get

Events:

- channel.inbound.accepted
- channel.inbound.duplicate
- channel.inbound.rejected
- channel.decision.created
- channel.decision.blocked
- channel.action.enqueued
- channel.action.sent
- channel.action.retry.scheduled
- channel.action.dead.lettered
- channel.escalation.created
- channel.feedback.recorded

## Postgres Schema Skeleton

```sql
create table if not exists channel_event_receipts (
  id uuid primary key,
  workspace_id text not null,
  provider_key text not null,
  external_event_id text not null,
  event_type text not null,
  status text not null,
  signature_valid boolean not null default false,
  payload_hash text,
  trace_id text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  processed_at timestamptz,
  error_code text,
  error_message text,
  unique (workspace_id, provider_key, external_event_id)
);

create table if not exists channel_threads (
  id uuid primary key,
  workspace_id text not null,
  provider_key text not null,
  external_thread_id text not null,
  external_channel_id text,
  external_user_id text,
  state jsonb not null default '{}'::jsonb,
  last_provider_event_ts timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider_key, external_thread_id)
);

create table if not exists channel_ai_decisions (
  id uuid primary key,
  receipt_id uuid not null references channel_event_receipts (id),
  thread_id uuid not null references channel_threads (id),
  policy_mode text not null,
  risk_tier text not null,
  confidence numeric(5,4) not null,
  model_name text not null,
  prompt_version text not null,
  policy_version text not null,
  tool_trace jsonb not null default '[]'::jsonb,
  action_plan jsonb not null,
  requires_approval boolean not null default false,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists channel_outbox_actions (
  id uuid primary key,
  workspace_id text not null,
  provider_key text not null,
  decision_id uuid not null references channel_ai_decisions (id),
  thread_id uuid not null references channel_threads (id),
  action_type text not null,
  idempotency_key text not null unique,
  target jsonb not null,
  payload jsonb not null,
  status text not null,
  attempt_count integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  provider_message_id text,
  last_error_code text,
  last_error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz
);

create table if not exists channel_delivery_attempts (
  id bigserial primary key,
  action_id uuid not null references channel_outbox_actions (id),
  attempt integer not null,
  response_status integer,
  response_body text,
  latency_ms integer,
  created_at timestamptz not null default now(),
  unique (action_id, attempt)
);
```

## Idempotency and Outbox Rules

1. Inbound claim: `insert ... on conflict do nothing returning id`.
2. If claim returns no row, event is duplicate and must not trigger side effects.
3. Outbound send keys must be deterministic and unique per logical action.
4. Dispatcher updates status atomically per attempt.
5. Retryable failures schedule `next_attempt_at` with exponential backoff + jitter.
6. Non-retryable failures move to dead letter state.

## Autonomy Policy Matrix (v1)

- Low risk and confidence >= 0.85: autonomous send allowed.
- Medium risk or confidence < 0.85: assist mode (human review) only.
- High risk, compliance, or security indicators: no autonomous send.
- Always blocked in v1: refunds, account mutations, permission changes.

## Minimum SLO Targets

- Webhook ack p95 < 600ms.
- Duplicate outbound side effects < 0.1%.
- Outbox processing success >= 99.5% within 2 minutes.
- High-risk autonomous sends = 0.

## Rollout Sequence

1. Slack vertical slice.
2. GitHub PR/commit workflows.
3. WhatsApp Meta primary.
4. WhatsApp Twilio fallback.
