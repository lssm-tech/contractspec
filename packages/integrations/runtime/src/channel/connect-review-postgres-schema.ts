export const CONNECT_REVIEW_QUEUE_SCHEMA_STATEMENTS: readonly string[] = [
	`
create table if not exists connect_review_queue (
  id text primary key,
  workspace_id text not null,
  queue text not null,
  source_decision_id text not null unique,
  runtime_decision_id text,
  trace_id text,
  lane_run_id text,
  next_lane text,
  canon_pack_refs jsonb not null default '[]'::jsonb,
  knowledge jsonb not null default '[]'::jsonb,
  config_refs jsonb not null default '[]'::jsonb,
  review_packet jsonb not null,
  context_pack jsonb,
  plan_packet jsonb,
  patch_verdict jsonb,
  decision_envelope jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  synced_at timestamptz not null default now()
)
`,
	`create index if not exists idx_connect_review_queue_queue on connect_review_queue (queue, updated_at desc)`,
	`create index if not exists idx_connect_review_queue_runtime_decision on connect_review_queue (runtime_decision_id)`,
	`create index if not exists idx_connect_review_queue_lane_run on connect_review_queue (lane_run_id)`,
];
