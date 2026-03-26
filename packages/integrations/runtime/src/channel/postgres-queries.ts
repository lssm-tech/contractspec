export const CLAIM_EVENT_RECEIPT_SQL = `
insert into channel_event_receipts (
  id,
  workspace_id,
  provider_key,
  external_event_id,
  event_type,
  status,
  signature_valid,
  payload_hash,
  trace_id
)
values ($1, $2, $3, $4, $5, 'accepted', $6, $7, $8)
on conflict (workspace_id, provider_key, external_event_id)
do nothing
returning id
`;

export const RECOVER_REJECTED_RECEIPT_SQL = `
update channel_event_receipts
set
  status = 'accepted',
  signature_valid = $4,
  payload_hash = $5,
  trace_id = $6,
  error_code = null,
  error_message = null,
  processed_at = null,
  last_seen_at = now()
where workspace_id = $1
  and provider_key = $2
  and external_event_id = $3
  and (
    status = 'failed'
    or (
      $4 = true
      and status = 'rejected'
      and signature_valid = false
    )
  )
returning id
`;

export const GET_RECEIPT_ID_BY_EXTERNAL_EVENT_SQL = `
select id
from channel_event_receipts
where workspace_id = $1
  and provider_key = $2
  and external_event_id = $3
limit 1
`;

export const MARK_RECEIPT_DUPLICATE_SQL = `
update channel_event_receipts
set
  last_seen_at = now(),
  status = case when status = 'accepted' then 'duplicate' else status end
where id = $1
`;

export const UPDATE_RECEIPT_STATUS_SQL = `
update channel_event_receipts
set
  status = $2,
  error_code = $3,
  error_message = $4,
  last_seen_at = now(),
  processed_at = case when $2 = 'processed' then now() else processed_at end
where id = $1
`;

export const GET_RECEIPT_SQL = `
select
  id,
  workspace_id,
  provider_key,
  external_event_id,
  event_type,
  status,
  signature_valid,
  payload_hash,
  trace_id,
  first_seen_at,
  last_seen_at,
  processed_at,
  error_code,
  error_message
from channel_event_receipts
where id = $1
limit 1
`;

export const UPSERT_THREAD_SQL = `
insert into channel_threads (
  id,
  workspace_id,
  provider_key,
  external_thread_id,
  external_channel_id,
  external_user_id,
  state,
  last_provider_event_ts
)
values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
on conflict (workspace_id, provider_key, external_thread_id)
do update set
  external_channel_id = coalesce(excluded.external_channel_id, channel_threads.external_channel_id),
  external_user_id = coalesce(excluded.external_user_id, channel_threads.external_user_id),
  state = channel_threads.state || excluded.state,
  last_provider_event_ts = coalesce(excluded.last_provider_event_ts, channel_threads.last_provider_event_ts),
  updated_at = now()
returning
  id,
  workspace_id,
  provider_key,
  external_thread_id,
  external_channel_id,
  external_user_id,
  state,
  last_provider_event_ts,
  created_at,
  updated_at
`;

export const GET_THREAD_SQL = `
select
  id,
  workspace_id,
  provider_key,
  external_thread_id,
  external_channel_id,
  external_user_id,
  state,
  last_provider_event_ts,
  created_at,
  updated_at
from channel_threads
where id = $1
limit 1
`;

export const INSERT_DECISION_SQL = `
insert into channel_ai_decisions (
  id,
  receipt_id,
  thread_id,
  policy_mode,
  risk_tier,
  confidence,
  model_name,
  prompt_version,
  policy_version,
  tool_trace,
  action_plan,
  requires_approval,
  approval_status
)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12, $13)
`;

export const INSERT_TRACE_EVENT_SQL = `
insert into channel_trace_events (
  trace_id,
  receipt_id,
  decision_id,
  action_id,
  workspace_id,
  provider_key,
  stage,
  status,
  session_id,
  workflow_id,
  latency_ms,
  attempt,
  metadata
)
values ($1, $2::uuid, $3::uuid, $4::uuid, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
returning
  id,
  trace_id,
  receipt_id,
  decision_id,
  action_id,
  workspace_id,
  provider_key,
  stage,
  status,
  session_id,
  workflow_id,
  latency_ms,
  attempt,
  metadata,
  created_at
`;

export const GET_DECISION_SQL = `
select
  id,
  receipt_id,
  thread_id,
  policy_mode,
  risk_tier,
  confidence,
  model_name,
  prompt_version,
  policy_version,
  tool_trace,
  action_plan,
  requires_approval,
  approval_status,
  approval_updated_at,
  approval_context,
  approved_by,
  approved_at,
  rejected_by,
  rejected_at,
  rejection_reason,
  created_at
from channel_ai_decisions
where id = $1
limit 1
`;

export const LIST_PENDING_APPROVALS_SQL = `
select
  id,
  receipt_id,
  thread_id,
  policy_mode,
  risk_tier,
  confidence,
  model_name,
  prompt_version,
  policy_version,
  tool_trace,
  action_plan,
  requires_approval,
  approval_status,
  approval_updated_at,
  approval_context,
  approved_by,
  approved_at,
  rejected_by,
  rejected_at,
  rejection_reason,
  created_at
from channel_ai_decisions
where approval_status = 'pending'
  and ($1::text is null or (action_plan ->> 'workspaceId') = $1)
  and ($2::text is null or (action_plan ->> 'providerKey') = $2)
order by created_at asc
limit $3
`;

export const LIST_DECISIONS_SQL = `
select
  id,
  receipt_id,
  thread_id,
  policy_mode,
  risk_tier,
  confidence,
  model_name,
  prompt_version,
  policy_version,
  tool_trace,
  action_plan,
  requires_approval,
  approval_status,
  approval_updated_at,
  approval_context,
  approved_by,
  approved_at,
  rejected_by,
  rejected_at,
  rejection_reason,
  created_at
from channel_ai_decisions
where ($1::text is null or (action_plan ->> 'workspaceId') = $1)
  and ($2::text is null or (action_plan ->> 'providerKey') = $2)
  and ($3::text is null or (action_plan ->> 'traceId') = $3)
  and ($4::text is null or receipt_id = $4::uuid)
  and ($5::text is null or (action_plan -> 'intent' ->> 'externalEventId') = $5)
  and ($6::text is null or approval_status = $6)
  and ($7::text is null or (action_plan -> 'actor' ->> 'id') = $7)
  and ($8::text is null or (action_plan -> 'audit' ->> 'sessionId') = $8)
  and ($9::text is null or (action_plan -> 'audit' ->> 'workflowId') = $9)
  and ($10::timestamptz is null or created_at >= $10)
  and ($11::timestamptz is null or created_at <= $11)
order by created_at desc
limit $12
`;

export const LIST_TRACE_EVENTS_SQL = `
select
  id,
  trace_id,
  receipt_id,
  decision_id,
  action_id,
  workspace_id,
  provider_key,
  stage,
  status,
  session_id,
  workflow_id,
  latency_ms,
  attempt,
  metadata,
  created_at
from channel_trace_events
where ($1::text is null or trace_id = $1)
  and ($2::text is null or receipt_id = $2::uuid)
  and ($3::text is null or decision_id = $3::uuid)
  and ($4::text is null or action_id = $4::uuid)
order by created_at asc, id asc
limit $5
`;

export const RESOLVE_DECISION_APPROVAL_SQL = `
update channel_ai_decisions
set
  approval_status = $2,
  approval_updated_at = $3,
  approval_context = $6::jsonb,
  approved_by = case when $2 = 'approved' then $4 else approved_by end,
  approved_at = case when $2 = 'approved' then $3 else approved_at end,
  rejected_by = case when $2 in ('rejected', 'expired') then $4 else rejected_by end,
  rejected_at = case when $2 in ('rejected', 'expired') then $3 else rejected_at end,
  rejection_reason = case when $2 in ('rejected', 'expired') then $5 else rejection_reason end,
  action_plan = $7::jsonb,
  tool_trace = $8::jsonb
where id = $1
  and approval_status = 'pending'
returning
  id,
  receipt_id,
  thread_id,
  policy_mode,
  risk_tier,
  confidence,
  model_name,
  prompt_version,
  policy_version,
  tool_trace,
  action_plan,
  requires_approval,
  approval_status,
  approval_updated_at,
  approval_context,
  approved_by,
  approved_at,
  rejected_by,
  rejected_at,
  rejection_reason,
  created_at
`;

export const UPSERT_SKILL_INSTALLATION_SQL = `
insert into control_plane_skill_installations (
  id,
  skill_key,
  version,
  artifact_digest,
  manifest,
  verification_report,
  status,
  installed_by,
  installed_at,
  disabled_by,
  disabled_at
)
values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9, $10, $11)
on conflict (skill_key, version)
do update set
  artifact_digest = excluded.artifact_digest,
  manifest = excluded.manifest,
  verification_report = excluded.verification_report,
  status = excluded.status,
  installed_by = excluded.installed_by,
  installed_at = excluded.installed_at,
  disabled_by = excluded.disabled_by,
  disabled_at = excluded.disabled_at
returning
  id,
  skill_key,
  version,
  artifact_digest,
  manifest,
  verification_report,
  status,
  installed_by,
  installed_at,
  disabled_by,
  disabled_at
`;

export const GET_SKILL_INSTALLATION_SQL = `
select
  id,
  skill_key,
  version,
  artifact_digest,
  manifest,
  verification_report,
  status,
  installed_by,
  installed_at,
  disabled_by,
  disabled_at
from control_plane_skill_installations
where id = $1::uuid
limit 1
`;

export const FIND_SKILL_INSTALLATION_SQL = `
select
  id,
  skill_key,
  version,
  artifact_digest,
  manifest,
  verification_report,
  status,
  installed_by,
  installed_at,
  disabled_by,
  disabled_at
from control_plane_skill_installations
where skill_key = $1
  and version = $2
limit 1
`;

export const LIST_SKILL_INSTALLATIONS_SQL = `
select
  id,
  skill_key,
  version,
  artifact_digest,
  manifest,
  verification_report,
  status,
  installed_by,
  installed_at,
  disabled_by,
  disabled_at,
  count(*) over() as total_count
from control_plane_skill_installations
where ($1::boolean is true or status <> 'disabled')
  and ($2::text is null or skill_key = $2)
order by installed_at desc, id desc
limit $3
offset $4
`;

export const COUNT_SKILL_INSTALLATIONS_SQL = `
select count(*) as total_count
from control_plane_skill_installations
where ($1::boolean is true or status <> 'disabled')
  and ($2::text is null or skill_key = $2)
`;

export const DISABLE_SKILL_INSTALLATION_SQL = `
update control_plane_skill_installations
set
  status = 'disabled',
  disabled_by = $2,
  disabled_at = $3
where id = $1::uuid
  and status = 'installed'
returning
  id,
  skill_key,
  version,
  artifact_digest,
  manifest,
  verification_report,
  status,
  installed_by,
  installed_at,
  disabled_by,
  disabled_at
`;

export const ENQUEUE_OUTBOX_SQL = `
with inserted as (
  insert into channel_outbox_actions (
    id,
    workspace_id,
    provider_key,
    decision_id,
    thread_id,
    action_type,
    idempotency_key,
    target,
    payload,
    status
  )
  values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, 'pending')
  on conflict (idempotency_key)
  do nothing
  returning id
)
select id, true as inserted from inserted
union all
select id, false as inserted
from channel_outbox_actions
where idempotency_key = $7
limit 1
`;

export const CLAIM_PENDING_OUTBOX_SQL = `
with candidates as (
  select id
  from channel_outbox_actions
  where status in ('pending', 'retryable')
    and next_attempt_at <= $2
  order by next_attempt_at asc
  limit $1
  for update skip locked
)
update channel_outbox_actions as actions
set
  status = 'sending',
  attempt_count = actions.attempt_count + 1,
  updated_at = now()
from candidates
where actions.id = candidates.id
returning
  actions.id,
  actions.workspace_id,
  actions.provider_key,
  actions.decision_id,
  actions.thread_id,
  actions.action_type,
  actions.idempotency_key,
  actions.target,
  actions.payload,
  actions.status,
  actions.attempt_count,
  actions.next_attempt_at,
  actions.provider_message_id,
  actions.last_error_code,
  actions.last_error_message,
  actions.created_at,
  actions.updated_at,
  actions.sent_at
`;

export const LIST_OUTBOX_ACTIONS_FOR_DECISION_SQL = `
select
  id,
  workspace_id,
  provider_key,
  decision_id,
  thread_id,
  action_type,
  idempotency_key,
  target,
  payload,
  status,
  attempt_count,
  next_attempt_at,
  provider_message_id,
  last_error_code,
  last_error_message,
  created_at,
  updated_at,
  sent_at
from channel_outbox_actions
where decision_id = $1
order by created_at asc
`;

export const INSERT_DELIVERY_ATTEMPT_SQL = `
insert into channel_delivery_attempts (
  action_id,
  attempt,
  response_status,
  response_body,
  latency_ms
)
values ($1, $2, $3, $4, $5)
on conflict (action_id, attempt)
do update set
  response_status = excluded.response_status,
  response_body = excluded.response_body,
  latency_ms = excluded.latency_ms,
  created_at = now()
returning
  id,
  action_id,
  attempt,
  response_status,
  response_body,
  latency_ms,
  created_at
`;

export const LIST_DELIVERY_ATTEMPTS_FOR_ACTION_SQL = `
select
  id,
  action_id,
  attempt,
  response_status,
  response_body,
  latency_ms,
  created_at
from channel_delivery_attempts
where action_id = $1
order by attempt asc
`;

export const MARK_OUTBOX_SENT_SQL = `
update channel_outbox_actions
set
  status = 'sent',
  provider_message_id = $2,
  sent_at = now(),
  updated_at = now(),
  last_error_code = null,
  last_error_message = null
where id = $1
`;

export const MARK_OUTBOX_RETRY_SQL = `
update channel_outbox_actions
set
  status = 'retryable',
  next_attempt_at = $2,
  last_error_code = $3,
  last_error_message = $4,
  updated_at = now()
where id = $1
`;

export const MARK_OUTBOX_DEAD_LETTER_SQL = `
update channel_outbox_actions
set
  status = 'dead_letter',
  last_error_code = $2,
  last_error_message = $3,
  updated_at = now()
where id = $1
`;
