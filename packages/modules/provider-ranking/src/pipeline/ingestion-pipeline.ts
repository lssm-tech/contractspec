import type {
	BenchmarkIngester,
	IngesterOptions,
	IngesterRegistry,
} from '@contractspec/lib.provider-ranking/ingesters';
import { normalizeBenchmarkResults } from '@contractspec/lib.provider-ranking/scoring';
import type { ProviderRankingStore } from '@contractspec/lib.provider-ranking/store';
import type {
	BenchmarkDimension,
	BenchmarkSource,
	IngestionRun,
} from '@contractspec/lib.provider-ranking/types';

export interface IngestionPipelineOptions {
	store: ProviderRankingStore;
	ingesterRegistry: IngesterRegistry;
	ingesterOptions?: IngesterOptions;
}

export interface IngestParams {
	fromDate?: string;
	toDate?: string;
	dimensions?: BenchmarkDimension[];
}

export interface IngestionPipelineResult {
	ingestionId: string;
	source: BenchmarkSource;
	resultsCount: number;
	status: IngestionRun['status'];
}

/**
 * Orchestrates the full ingestion flow:
 * 1. Create ingestion run record
 * 2. Fetch data via the appropriate ingester
 * 3. Normalize scores
 * 4. Store results
 * 5. Update ingestion run status
 */
export class IngestionPipeline {
	private readonly store: ProviderRankingStore;
	private readonly registry: IngesterRegistry;
	private readonly ingesterOptions?: IngesterOptions;

	constructor(options: IngestionPipelineOptions) {
		this.store = options.store;
		this.registry = options.ingesterRegistry;
		this.ingesterOptions = options.ingesterOptions;
	}

	async ingest(
		source: BenchmarkSource,
		params?: IngestParams
	): Promise<IngestionPipelineResult> {
		const ingester = this.registry.get(source);
		if (!ingester) {
			throw new Error(`No ingester registered for source: ${source}`);
		}

		return this.runIngester(ingester, params);
	}

	async ingestAll(params?: IngestParams): Promise<IngestionPipelineResult[]> {
		const results: IngestionPipelineResult[] = [];

		for (const ingester of this.registry.list()) {
			const result = await this.runIngester(ingester, params);
			results.push(result);
		}

		return results;
	}

	private mergeOptions(params?: IngestParams): IngesterOptions {
		const merged: IngesterOptions = { ...this.ingesterOptions };
		if (params?.fromDate) merged.fromDate = new Date(params.fromDate);
		if (params?.toDate) merged.toDate = new Date(params.toDate);
		if (params?.dimensions?.length) merged.dimensions = params.dimensions;
		return merged;
	}

	private async runIngester(
		ingester: BenchmarkIngester,
		params?: IngestParams
	): Promise<IngestionPipelineResult> {
		const ingestionId = `ingest-${ingester.source}-${Date.now()}`;
		const run: IngestionRun = {
			id: ingestionId,
			source: ingester.source,
			status: 'running',
			resultsCount: 0,
			startedAt: new Date(),
			completedAt: null,
			error: null,
		};

		await this.store.createIngestionRun(run);

		try {
			const opts = this.mergeOptions(params);
			const rawResults = await ingester.ingest(opts);
			const normalized = normalizeBenchmarkResults(rawResults);

			for (const result of normalized) {
				await this.store.upsertBenchmarkResult(result);
			}

			await this.store.updateIngestionRun(ingestionId, {
				status: 'completed',
				resultsCount: normalized.length,
				completedAt: new Date(),
			});

			return {
				ingestionId,
				source: ingester.source,
				resultsCount: normalized.length,
				status: 'completed',
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			await this.store.updateIngestionRun(ingestionId, {
				status: 'failed',
				completedAt: new Date(),
				error: errorMessage,
			});

			return {
				ingestionId,
				source: ingester.source,
				resultsCount: 0,
				status: 'failed',
			};
		}
	}
}
