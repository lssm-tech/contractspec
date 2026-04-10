import type {
	ApprovalRecord,
	CompletionLoopState,
	EvidenceBundleRef,
	LaneArtifactRecord,
	LaneEventRecord,
	LaneRunState,
	LaneRuntimeSnapshot,
	LaneRuntimeStore,
	LaneTransitionRecord,
	TeamRunState,
} from '@contractspec/lib.execution-lanes';
import type { Pool } from 'pg';
import { EXECUTION_LANE_RUNTIME_SCHEMA_STATEMENTS } from './execution-lanes-postgres-schema';

export class PostgresExecutionLaneRuntimeStore implements LaneRuntimeStore {
	constructor(private readonly pool: Pool) {}

	async initializeSchema(): Promise<void> {
		for (const statement of EXECUTION_LANE_RUNTIME_SCHEMA_STATEMENTS) {
			await this.pool.query(statement);
		}
	}

	async createRun(run: LaneRunState): Promise<void> {
		await this.pool.query(
			`insert into execution_lane_runs (run_id, lane_key, status, updated_at, run)
			 values ($1, $2, $3, $4, $5)
			 on conflict (run_id) do update
			 set lane_key = excluded.lane_key,
			     status = excluded.status,
			     updated_at = excluded.updated_at,
			     run = excluded.run`,
			[run.runId, run.lane, run.status, run.updatedAt, JSON.stringify(run)]
		);
	}

	async getRun(runId: string): Promise<LaneRunState | undefined> {
		return this.readOne<LaneRunState>(
			`select run from execution_lane_runs where run_id = $1`,
			'run',
			[runId]
		);
	}

	async updateRun(
		runId: string,
		updater: (current: LaneRunState) => LaneRunState
	): Promise<LaneRunState> {
		const current = await this.getRun(runId);
		if (!current) {
			throw new Error(`Lane run not found: ${runId}`);
		}
		const next = updater(current);
		await this.createRun(next);
		return next;
	}

	async listRuns(): Promise<LaneRunState[]> {
		return this.readMany<LaneRunState>(
			`select run from execution_lane_runs order by updated_at desc`,
			'run'
		);
	}

	async saveArtifact(artifact: LaneArtifactRecord): Promise<void> {
		await this.saveChild(
			'execution_lane_artifacts',
			artifact.id,
			artifact.runId,
			artifact.createdAt,
			'artifact_type',
			artifact.artifactType,
			'artifact',
			artifact
		);
	}

	async listArtifacts(runId: string): Promise<LaneArtifactRecord[]> {
		return this.readMany<LaneArtifactRecord>(
			`select artifact from execution_lane_artifacts where run_id = $1 order by created_at asc`,
			'artifact',
			[runId]
		);
	}

	async appendEvent(event: LaneEventRecord): Promise<void> {
		await this.saveChild(
			'execution_lane_events',
			event.id,
			event.runId,
			event.createdAt,
			'event_type',
			event.type,
			'event',
			event
		);
	}

	async listEvents(runId: string): Promise<LaneEventRecord[]> {
		return this.readMany<LaneEventRecord>(
			`select event from execution_lane_events where run_id = $1 order by created_at asc`,
			'event',
			[runId]
		);
	}

	async saveTransition(transition: LaneTransitionRecord): Promise<void> {
		await this.pool.query(
			`insert into execution_lane_transitions (id, run_id, from_lane, to_lane, created_at, transition)
			 values ($1, $2, $3, $4, $5, $6)
			 on conflict (id) do update
			 set from_lane = excluded.from_lane,
			     to_lane = excluded.to_lane,
			     created_at = excluded.created_at,
			     transition = excluded.transition`,
			[
				transition.id,
				transition.runId,
				transition.from ?? null,
				transition.to,
				transition.createdAt,
				JSON.stringify(transition),
			]
		);
	}

	async listTransitions(runId: string): Promise<LaneTransitionRecord[]> {
		return this.readMany<LaneTransitionRecord>(
			`select transition from execution_lane_transitions where run_id = $1 order by created_at asc`,
			'transition',
			[runId]
		);
	}

	async saveEvidence(bundle: EvidenceBundleRef): Promise<void> {
		await this.saveSimpleChild(
			'execution_lane_evidence',
			bundle.id,
			bundle.runId,
			bundle.createdAt,
			'bundle',
			bundle
		);
	}

	async listEvidence(runId: string): Promise<EvidenceBundleRef[]> {
		return this.readMany<EvidenceBundleRef>(
			`select bundle from execution_lane_evidence where run_id = $1 order by created_at asc`,
			'bundle',
			[runId]
		);
	}

	async saveApproval(approval: ApprovalRecord): Promise<void> {
		await this.saveSimpleChild(
			'execution_lane_approvals',
			approval.id,
			approval.runId,
			approval.requestedAt,
			'approval',
			approval
		);
	}

	async listApprovals(runId: string): Promise<ApprovalRecord[]> {
		return this.readMany<ApprovalRecord>(
			`select approval from execution_lane_approvals where run_id = $1 order by created_at asc`,
			'approval',
			[runId]
		);
	}

	async saveCompletion(state: CompletionLoopState): Promise<void> {
		await this.saveState(
			'execution_lane_completion',
			state.runId,
			state.updatedAt,
			state
		);
	}

	async getCompletion(runId: string): Promise<CompletionLoopState | undefined> {
		return this.readOne<CompletionLoopState>(
			`select state from execution_lane_completion where run_id = $1`,
			'state',
			[runId]
		);
	}

	async saveTeam(state: TeamRunState): Promise<void> {
		await this.saveState(
			'execution_lane_team',
			state.runId,
			state.updatedAt,
			state
		);
	}

	async getTeam(runId: string): Promise<TeamRunState | undefined> {
		return this.readOne<TeamRunState>(
			`select state from execution_lane_team where run_id = $1`,
			'state',
			[runId]
		);
	}

	async getSnapshot(runId: string): Promise<LaneRuntimeSnapshot | undefined> {
		const run = await this.getRun(runId);
		if (!run) {
			return undefined;
		}
		const [
			artifacts,
			events,
			transitions,
			evidence,
			approvals,
			completion,
			team,
		] = await Promise.all([
			this.listArtifacts(runId),
			this.listEvents(runId),
			this.listTransitions(runId),
			this.listEvidence(runId),
			this.listApprovals(runId),
			this.getCompletion(runId),
			this.getTeam(runId),
		]);
		return {
			run,
			artifacts,
			events,
			transitions,
			evidence,
			approvals,
			completion,
			team,
		};
	}

	private async saveState(
		table: string,
		runId: string,
		updatedAt: string,
		state: unknown
	) {
		await this.pool.query(
			`insert into ${table} (run_id, updated_at, state)
			 values ($1, $2, $3)
			 on conflict (run_id) do update
			 set updated_at = excluded.updated_at, state = excluded.state`,
			[runId, updatedAt, JSON.stringify(state)]
		);
	}

	private async saveSimpleChild(
		table: string,
		id: string,
		runId: string,
		createdAt: string,
		column: string,
		value: unknown
	) {
		await this.pool.query(
			`insert into ${table} (id, run_id, created_at, ${column}) values ($1, $2, $3, $4)
			 on conflict (id) do update set ${column} = excluded.${column}, created_at = excluded.created_at`,
			[id, runId, createdAt, JSON.stringify(value)]
		);
	}

	private async saveChild(
		table: string,
		id: string,
		runId: string,
		createdAt: string,
		typeColumn: string,
		typeValue: string,
		payloadColumn: string,
		payload: unknown
	) {
		await this.pool.query(
			`insert into ${table} (id, run_id, ${typeColumn}, created_at, ${payloadColumn})
			 values ($1, $2, $3, $4, $5)
			 on conflict (id) do update
			 set ${typeColumn} = excluded.${typeColumn},
			     created_at = excluded.created_at,
			     ${payloadColumn} = excluded.${payloadColumn}`,
			[id, runId, typeValue, createdAt, JSON.stringify(payload)]
		);
	}

	private async readOne<T>(
		sql: string,
		column: string,
		params: unknown[] = []
	) {
		const result = await this.pool.query<Record<string, T>>(sql, params);
		return result.rows[0]?.[column];
	}

	private async readMany<T>(
		sql: string,
		column: string,
		params: unknown[] = []
	) {
		const result = await this.pool.query<Record<string, T>>(sql, params);
		return result.rows
			.map((row) => row[column])
			.filter((value): value is T => value !== undefined);
	}
}
