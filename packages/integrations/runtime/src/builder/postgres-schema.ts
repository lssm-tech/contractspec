export const BUILDER_RUNTIME_SCHEMA_STATEMENTS: readonly string[] = [
	`
create table if not exists builder_workspaces (
  id text primary key,
  tenant_id text not null,
  record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
`,
	`
create table if not exists builder_records (
  kind text not null,
  id text not null,
  workspace_id text not null,
  scope_id text,
  record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (kind, id)
)
`,
	`create index if not exists idx_builder_records_workspace_kind on builder_records (workspace_id, kind, updated_at desc)`,
	`create index if not exists idx_builder_records_scope on builder_records (scope_id, kind, updated_at desc)`,
];
