export const EXECUTION_LANE_RUNTIME_SCHEMA_STATEMENTS: readonly string[] = [
	`
create table if not exists execution_lane_runs (
  run_id text primary key,
  lane_key text not null,
  status text not null,
  updated_at timestamptz not null default now(),
  run jsonb not null
)
`,
	`
create table if not exists execution_lane_artifacts (
  id text primary key,
  run_id text not null references execution_lane_runs (run_id) on delete cascade,
  artifact_type text not null,
  created_at timestamptz not null default now(),
  artifact jsonb not null
)
`,
	`
create table if not exists execution_lane_events (
  id text primary key,
  run_id text not null references execution_lane_runs (run_id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now(),
  event jsonb not null
)
`,
	`
create table if not exists execution_lane_transitions (
  id text primary key,
  run_id text not null references execution_lane_runs (run_id) on delete cascade,
  from_lane text,
  to_lane text not null,
  created_at timestamptz not null default now(),
  transition jsonb not null
)
`,
	`
create table if not exists execution_lane_evidence (
  id text primary key,
  run_id text not null references execution_lane_runs (run_id) on delete cascade,
  created_at timestamptz not null default now(),
  bundle jsonb not null
)
`,
	`
create table if not exists execution_lane_approvals (
  id text primary key,
  run_id text not null references execution_lane_runs (run_id) on delete cascade,
  created_at timestamptz not null default now(),
  approval jsonb not null
)
`,
	`
create table if not exists execution_lane_completion (
  run_id text primary key references execution_lane_runs (run_id) on delete cascade,
  updated_at timestamptz not null default now(),
  state jsonb not null
)
`,
	`
create table if not exists execution_lane_team (
  run_id text primary key references execution_lane_runs (run_id) on delete cascade,
  updated_at timestamptz not null default now(),
  state jsonb not null
)
`,
	`create index if not exists idx_execution_lane_runs_status on execution_lane_runs (status, updated_at desc)`,
	`create index if not exists idx_execution_lane_runs_lane_key on execution_lane_runs (lane_key, updated_at desc)`,
	`create index if not exists idx_execution_lane_artifacts_run_id on execution_lane_artifacts (run_id, created_at)`,
	`create index if not exists idx_execution_lane_events_run_id on execution_lane_events (run_id, created_at)`,
	`create index if not exists idx_execution_lane_transitions_run_id on execution_lane_transitions (run_id, created_at)`,
];
