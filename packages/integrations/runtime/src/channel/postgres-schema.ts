export const CHANNEL_RUNTIME_SCHEMA_STATEMENTS: readonly string[] = [
  `
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
)
`,
  `
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
)
`,
  `
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
)
`,
  `
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
)
`,
  `
create table if not exists channel_delivery_attempts (
  id bigserial primary key,
  action_id uuid not null references channel_outbox_actions (id),
  attempt integer not null,
  response_status integer,
  response_body text,
  latency_ms integer,
  created_at timestamptz not null default now(),
  unique (action_id, attempt)
)
`,
];
