export const CLAIM_EVENT_RECEIPT_SQL = `
with inserted as (
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
)
select id, true as inserted from inserted
union all
select id, false as inserted
from channel_event_receipts
where workspace_id = $2
  and provider_key = $3
  and external_event_id = $4
limit 1
`;

export const MARK_RECEIPT_DUPLICATE_SQL = `
update channel_event_receipts
set last_seen_at = now(), status = 'duplicate'
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
  requires_approval
)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12)
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
