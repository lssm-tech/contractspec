import type {
	DatabaseProvider,
	DatabaseStatementParam,
} from '@contractspec/lib.contracts-integrations';
import type { ProviderRankingStore } from '@contractspec/lib.provider-ranking/store';
import type {
	BenchmarkResult,
	BenchmarkResultListResult,
	BenchmarkResultQuery,
	IngestionRun,
	ModelProfile,
	ModelRanking,
	RankingListResult,
	RankingQuery,
} from '@contractspec/lib.provider-ranking/types';

export interface PostgresProviderRankingStoreOptions {
	database: DatabaseProvider;
	schema?: string;
	createTablesIfMissing?: boolean;
}

export class PostgresProviderRankingStore implements ProviderRankingStore {
	private readonly database: DatabaseProvider;
	private readonly schema: string;
	private readonly createTablesIfMissing: boolean;
	private ensured = false;

	constructor(options: PostgresProviderRankingStoreOptions) {
		this.database = options.database;
		this.schema = options.schema ?? 'lssm_ranking';
		this.createTablesIfMissing = options.createTablesIfMissing ?? true;
	}

	async upsertBenchmarkResult(result: BenchmarkResult): Promise<void> {
		await this.ensureTables();
		await this.database.execute(
			`INSERT INTO ${this.table('benchmark_result')}
        (id, model_id, provider_key, source, dimension, score, raw_score, metadata, measured_at, ingested_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10)
       ON CONFLICT (id)
       DO UPDATE SET
         score = EXCLUDED.score,
         raw_score = EXCLUDED.raw_score,
         metadata = EXCLUDED.metadata,
         measured_at = EXCLUDED.measured_at,
         ingested_at = EXCLUDED.ingested_at;`,
			[
				result.id,
				result.modelId,
				result.providerKey,
				result.source,
				result.dimension,
				result.score,
				JSON.stringify(result.rawScore),
				result.metadata ? JSON.stringify(result.metadata) : null,
				result.measuredAt.toISOString(),
				result.ingestedAt.toISOString(),
			]
		);
	}

	async getBenchmarkResult(id: string): Promise<BenchmarkResult | null> {
		await this.ensureTables();
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('benchmark_result')} WHERE id = $1;`,
			[id]
		);
		return rows.rows[0] ? this.mapBenchmarkResult(rows.rows[0]) : null;
	}

	async listBenchmarkResults(
		query: BenchmarkResultQuery
	): Promise<BenchmarkResultListResult> {
		await this.ensureTables();
		const limit = query.limit ?? 50;
		const offset = query.offset ?? 0;

		const countFilters: string[] = [];
		const countParams: DatabaseStatementParam[] = [];

		if (query.source) {
			countParams.push(query.source);
			countFilters.push(`source = $${countParams.length}`);
		}
		if (query.modelId) {
			countParams.push(query.modelId);
			countFilters.push(`model_id = $${countParams.length}`);
		}
		if (query.dimension) {
			countParams.push(query.dimension);
			countFilters.push(`dimension = $${countParams.length}`);
		}
		if (query.providerKey) {
			countParams.push(query.providerKey);
			countFilters.push(`provider_key = $${countParams.length}`);
		}

		const where = countFilters.length
			? `WHERE ${countFilters.join(' AND ')}`
			: '';

		const countResult = await this.database.query(
			`SELECT COUNT(*)::int as total FROM ${this.table('benchmark_result')} ${where};`,
			countParams
		);
		const total = Number(countResult.rows[0]?.total ?? 0);

		const dataParams: DatabaseStatementParam[] = [
			limit,
			offset,
			...countParams,
		];
		const dataFilters = countFilters.map((_f, i) =>
			_f.replace(`$${i + 1}`, `$${i + 3}`)
		);
		const dataWhere = dataFilters.length
			? `WHERE ${dataFilters.join(' AND ')}`
			: '';

		const rows = await this.database.query(
			`SELECT * FROM ${this.table('benchmark_result')}
       ${dataWhere}
       ORDER BY ingested_at DESC
       LIMIT $1 OFFSET $2;`,
			dataParams
		);

		const results = rows.rows.map((row) => this.mapBenchmarkResult(row));
		const nextOffset =
			offset + results.length < total ? offset + results.length : undefined;

		return { results, total, nextOffset };
	}

	async upsertModelRanking(ranking: ModelRanking): Promise<void> {
		await this.ensureTables();
		await this.database.execute(
			`INSERT INTO ${this.table('model_ranking')}
        (model_id, provider_key, composite_score, dimension_scores, rank, previous_rank, updated_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
       ON CONFLICT (model_id)
       DO UPDATE SET
         provider_key = EXCLUDED.provider_key,
         composite_score = EXCLUDED.composite_score,
         dimension_scores = EXCLUDED.dimension_scores,
         rank = EXCLUDED.rank,
         previous_rank = EXCLUDED.previous_rank,
         updated_at = EXCLUDED.updated_at;`,
			[
				ranking.modelId,
				ranking.providerKey,
				ranking.compositeScore,
				JSON.stringify(ranking.dimensionScores),
				ranking.rank,
				ranking.previousRank,
				ranking.updatedAt.toISOString(),
			]
		);
	}

	async getModelRanking(modelId: string): Promise<ModelRanking | null> {
		await this.ensureTables();
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('model_ranking')} WHERE model_id = $1;`,
			[modelId]
		);
		return rows.rows[0] ? this.mapModelRanking(rows.rows[0]) : null;
	}

	async listModelRankings(query: RankingQuery): Promise<RankingListResult> {
		await this.ensureTables();
		const limit = query.limit ?? 50;
		const offset = query.offset ?? 0;

		const countFilters: string[] = [];
		const countParams: DatabaseStatementParam[] = [];

		if (query.providerKey) {
			countParams.push(query.providerKey);
			countFilters.push(`provider_key = $${countParams.length}`);
		}

		const where = countFilters.length
			? `WHERE ${countFilters.join(' AND ')}`
			: '';

		const countResult = await this.database.query(
			`SELECT COUNT(*)::int as total FROM ${this.table('model_ranking')} ${where};`,
			countParams
		);
		const total = Number(countResult.rows[0]?.total ?? 0);

		const dataParams: DatabaseStatementParam[] = [
			limit,
			offset,
			...countParams,
		];
		const dataFilters = countFilters.map((_f, i) =>
			_f.replace(`$${i + 1}`, `$${i + 3}`)
		);
		const dataWhere = dataFilters.length
			? `WHERE ${dataFilters.join(' AND ')}`
			: '';

		const orderBy = query.dimension
			? `(dimension_scores->>'${query.dimension}')::jsonb->>'score' DESC NULLS LAST`
			: 'rank ASC';

		const rows = await this.database.query(
			`SELECT * FROM ${this.table('model_ranking')}
       ${dataWhere}
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2;`,
			dataParams
		);

		const rankings = rows.rows.map((row) => this.mapModelRanking(row));
		const nextOffset =
			offset + rankings.length < total ? offset + rankings.length : undefined;

		return { rankings, total, nextOffset };
	}

	async getModelProfile(modelId: string): Promise<ModelProfile | null> {
		await this.ensureTables();
		const ranking = await this.getModelRanking(modelId);

		const benchResults = await this.database.query(
			`SELECT * FROM ${this.table('benchmark_result')}
       WHERE model_id = $1
       ORDER BY ingested_at DESC;`,
			[modelId]
		);

		if (!ranking && benchResults.rows.length === 0) return null;

		return {
			modelId,
			providerKey:
				ranking?.providerKey ??
				String(benchResults.rows[0]?.provider_key ?? 'unknown'),
			displayName: modelId,
			contextWindow: 0,
			costPerMillion: null,
			capabilities: [],
			ranking: ranking ?? null,
			benchmarkResults: benchResults.rows.map((row) =>
				this.mapBenchmarkResult(row)
			),
		};
	}

	async createIngestionRun(run: IngestionRun): Promise<void> {
		await this.ensureTables();
		await this.database.execute(
			`INSERT INTO ${this.table('ingestion_run')}
        (id, source, status, results_count, started_at, completed_at, error)
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
			[
				run.id,
				run.source,
				run.status,
				run.resultsCount,
				run.startedAt.toISOString(),
				run.completedAt?.toISOString() ?? null,
				run.error,
			]
		);
	}

	async updateIngestionRun(
		id: string,
		update: Partial<IngestionRun>
	): Promise<void> {
		await this.ensureTables();
		const sets: string[] = [];
		const params: DatabaseStatementParam[] = [id];

		if (update.status !== undefined) {
			params.push(update.status);
			sets.push(`status = $${params.length}`);
		}
		if (update.resultsCount !== undefined) {
			params.push(update.resultsCount);
			sets.push(`results_count = $${params.length}`);
		}
		if (update.completedAt !== undefined) {
			params.push(update.completedAt?.toISOString() ?? null);
			sets.push(`completed_at = $${params.length}`);
		}
		if (update.error !== undefined) {
			params.push(update.error);
			sets.push(`error = $${params.length}`);
		}

		if (sets.length === 0) return;

		await this.database.execute(
			`UPDATE ${this.table('ingestion_run')} SET ${sets.join(', ')} WHERE id = $1;`,
			params
		);
	}

	async getIngestionRun(id: string): Promise<IngestionRun | null> {
		await this.ensureTables();
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('ingestion_run')} WHERE id = $1;`,
			[id]
		);
		return rows.rows[0] ? this.mapIngestionRun(rows.rows[0]) : null;
	}

	private async ensureTables(): Promise<void> {
		if (this.ensured || !this.createTablesIfMissing) return;

		await this.database.execute(`CREATE SCHEMA IF NOT EXISTS ${this.schema};`);

		await this.database.execute(
			`CREATE TABLE IF NOT EXISTS ${this.table('benchmark_result')} (
        id text PRIMARY KEY,
        model_id text NOT NULL,
        provider_key text NOT NULL,
        source text NOT NULL,
        dimension text NOT NULL,
        score double precision NOT NULL,
        raw_score jsonb,
        metadata jsonb,
        measured_at timestamptz NOT NULL,
        ingested_at timestamptz NOT NULL
      );`
		);

		await this.database.execute(
			`CREATE INDEX IF NOT EXISTS benchmark_result_model_idx
       ON ${this.table('benchmark_result')} (model_id);`
		);
		await this.database.execute(
			`CREATE INDEX IF NOT EXISTS benchmark_result_source_idx
       ON ${this.table('benchmark_result')} (source);`
		);
		await this.database.execute(
			`CREATE INDEX IF NOT EXISTS benchmark_result_dimension_idx
       ON ${this.table('benchmark_result')} (dimension);`
		);

		await this.database.execute(
			`CREATE TABLE IF NOT EXISTS ${this.table('model_ranking')} (
        model_id text PRIMARY KEY,
        provider_key text NOT NULL,
        composite_score double precision NOT NULL,
        dimension_scores jsonb NOT NULL,
        rank int NOT NULL,
        previous_rank int,
        updated_at timestamptz NOT NULL
      );`
		);

		await this.database.execute(
			`CREATE INDEX IF NOT EXISTS model_ranking_rank_idx
       ON ${this.table('model_ranking')} (rank);`
		);

		await this.database.execute(
			`CREATE TABLE IF NOT EXISTS ${this.table('ingestion_run')} (
        id text PRIMARY KEY,
        source text NOT NULL,
        status text NOT NULL,
        results_count int NOT NULL DEFAULT 0,
        started_at timestamptz NOT NULL,
        completed_at timestamptz,
        error text
      );`
		);

		this.ensured = true;
	}

	private table(name: string): string {
		return `${this.schema}.${name}`;
	}

	private mapBenchmarkResult(row: Record<string, unknown>): BenchmarkResult {
		return {
			id: String(row.id),
			modelId: String(row.model_id),
			providerKey: String(row.provider_key),
			source: String(row.source) as BenchmarkResult['source'],
			dimension: String(row.dimension) as BenchmarkResult['dimension'],
			score: Number(row.score),
			rawScore: parseJson(row.raw_score),
			metadata: (parseJson(row.metadata) as Record<string, unknown>) ?? {},
			measuredAt: new Date(String(row.measured_at)),
			ingestedAt: new Date(String(row.ingested_at)),
		};
	}

	private mapModelRanking(row: Record<string, unknown>): ModelRanking {
		return {
			modelId: String(row.model_id),
			providerKey: String(row.provider_key),
			compositeScore: Number(row.composite_score),
			dimensionScores:
				(parseJson(row.dimension_scores) as ModelRanking['dimensionScores']) ??
				{},
			rank: Number(row.rank),
			previousRank:
				row.previous_rank != null ? Number(row.previous_rank) : null,
			updatedAt: new Date(String(row.updated_at)),
		};
	}

	private mapIngestionRun(row: Record<string, unknown>): IngestionRun {
		return {
			id: String(row.id),
			source: String(row.source) as IngestionRun['source'],
			status: String(row.status) as IngestionRun['status'],
			resultsCount: Number(row.results_count),
			startedAt: new Date(String(row.started_at)),
			completedAt: row.completed_at ? new Date(String(row.completed_at)) : null,
			error: row.error ? String(row.error) : null,
		};
	}
}

function parseJson(value: unknown): unknown {
	if (value == null) return null;
	if (typeof value === 'object') return value;
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return null;
		}
	}
	return value;
}
