import type { Pool } from 'pg';
import { CONNECT_REVIEW_QUEUE_SCHEMA_STATEMENTS } from './connect-review-postgres-schema';
import type { ConnectReviewQueueStore } from './connect-review-store';
import type {
	ConnectReviewQueueRecord,
	ListConnectReviewQueueItemsInput,
} from './connect-review-types';

type ConnectReviewRow = {
	id: string;
	workspace_id: string;
	queue: string;
	source_decision_id: string;
	runtime_decision_id: string | null;
	trace_id: string | null;
	lane_run_id: string | null;
	next_lane: ConnectReviewQueueRecord['nextLane'] | null;
	canon_pack_refs: ConnectReviewQueueRecord['canonPackRefs'];
	knowledge: ConnectReviewQueueRecord['knowledge'];
	config_refs: ConnectReviewQueueRecord['configRefs'];
	review_packet: ConnectReviewQueueRecord['reviewPacket'];
	context_pack: ConnectReviewQueueRecord['contextPack'] | null;
	plan_packet: ConnectReviewQueueRecord['planPacket'] | null;
	patch_verdict: ConnectReviewQueueRecord['patchVerdict'] | null;
	decision_envelope: ConnectReviewQueueRecord['decisionEnvelope'] | null;
	created_at: Date;
	updated_at: Date;
	synced_at: Date;
};

export class PostgresConnectReviewQueueStore
	implements ConnectReviewQueueStore
{
	constructor(private readonly pool: Pool) {}

	async initializeSchema(): Promise<void> {
		for (const statement of CONNECT_REVIEW_QUEUE_SCHEMA_STATEMENTS) {
			await this.pool.query(statement);
		}
	}

	async getConnectReview(id: string): Promise<ConnectReviewQueueRecord | null> {
		const result = await this.pool.query<ConnectReviewRow>(
			`select * from connect_review_queue where id = $1`,
			[id]
		);
		return mapConnectReviewRow(result.rows[0]);
	}

	async getConnectReviewBySourceDecisionId(
		sourceDecisionId: string
	): Promise<ConnectReviewQueueRecord | null> {
		const result = await this.pool.query<ConnectReviewRow>(
			`select * from connect_review_queue where source_decision_id = $1`,
			[sourceDecisionId]
		);
		return mapConnectReviewRow(result.rows[0]);
	}

	async listConnectReviews(
		input: Omit<ListConnectReviewQueueItemsInput, 'status'> = {}
	): Promise<ConnectReviewQueueRecord[]> {
		const result = await this.pool.query<ConnectReviewRow>(
			`select * from connect_review_queue
			 where ($1::text is null or queue = $1)
			   and ($2::text is null or source_decision_id = $2)
			 order by updated_at desc
			 limit $3`,
			[
				input.queue ?? null,
				input.sourceDecisionId ?? null,
				Math.max(1, input.limit ?? 100),
			]
		);
		return result.rows.map((row) => mapConnectReviewRow(row)!);
	}

	async upsertConnectReview(
		record: ConnectReviewQueueRecord
	): Promise<ConnectReviewQueueRecord> {
		const result = await this.pool.query<ConnectReviewRow>(
			`insert into connect_review_queue (
			   id, workspace_id, queue, source_decision_id, runtime_decision_id, trace_id,
			   lane_run_id, next_lane, canon_pack_refs, knowledge, config_refs, review_packet,
			   context_pack, plan_packet, patch_verdict, decision_envelope, created_at,
			   updated_at, synced_at
			 ) values (
			   $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb,
			   $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::timestamptz,
			   $18::timestamptz, $19::timestamptz
			 )
			 on conflict (source_decision_id) do update set
			   workspace_id = excluded.workspace_id,
			   queue = excluded.queue,
			   runtime_decision_id = excluded.runtime_decision_id,
			   trace_id = excluded.trace_id,
			   lane_run_id = excluded.lane_run_id,
			   next_lane = excluded.next_lane,
			   canon_pack_refs = excluded.canon_pack_refs,
			   knowledge = excluded.knowledge,
			   config_refs = excluded.config_refs,
			   review_packet = excluded.review_packet,
			   context_pack = excluded.context_pack,
			   plan_packet = excluded.plan_packet,
			   patch_verdict = excluded.patch_verdict,
			   decision_envelope = excluded.decision_envelope,
			   updated_at = excluded.updated_at,
			   synced_at = excluded.synced_at
			 returning *`,
			[
				record.id,
				record.workspaceId,
				record.queue,
				record.sourceDecisionId,
				record.runtimeDecisionId ?? null,
				record.traceId ?? null,
				record.laneRunId ?? null,
				record.nextLane ?? null,
				JSON.stringify(record.canonPackRefs),
				JSON.stringify(record.knowledge),
				JSON.stringify(record.configRefs),
				JSON.stringify(record.reviewPacket),
				JSON.stringify(record.contextPack ?? null),
				JSON.stringify(record.planPacket ?? null),
				JSON.stringify(record.patchVerdict ?? null),
				JSON.stringify(record.decisionEnvelope ?? null),
				record.createdAt,
				record.updatedAt,
				record.syncedAt,
			]
		);
		const row = result.rows[0];
		if (!row) {
			throw new Error('Failed to upsert Connect review queue record.');
		}
		return mapConnectReviewRow(row)!;
	}
}

function mapConnectReviewRow(
	row: ConnectReviewRow | undefined
): ConnectReviewQueueRecord | null {
	if (!row) {
		return null;
	}
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		queue: row.queue,
		sourceDecisionId: row.source_decision_id,
		runtimeDecisionId: row.runtime_decision_id ?? undefined,
		traceId: row.trace_id ?? undefined,
		laneRunId: row.lane_run_id ?? undefined,
		nextLane: row.next_lane ?? undefined,
		canonPackRefs: row.canon_pack_refs ?? [],
		knowledge: row.knowledge ?? [],
		configRefs: row.config_refs ?? [],
		reviewPacket: row.review_packet,
		contextPack: row.context_pack ?? undefined,
		planPacket: row.plan_packet ?? undefined,
		patchVerdict: row.patch_verdict ?? undefined,
		decisionEnvelope: row.decision_envelope ?? undefined,
		createdAt: row.created_at.toISOString(),
		updatedAt: row.updated_at.toISOString(),
		syncedAt: row.synced_at.toISOString(),
	};
}
