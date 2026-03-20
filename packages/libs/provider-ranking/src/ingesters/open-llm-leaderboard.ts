import type { BenchmarkDimension, BenchmarkResult } from '../types';
import { fetchWithRetry, parseJsonSafe } from './fetch-utils';
import type { BenchmarkIngester, IngesterOptions } from './types';

const DEFAULT_HF_URL =
	'https://huggingface.co/api/spaces/open-llm-leaderboard/open_llm_leaderboard/results';

interface HFLeaderboardEntry {
	model_name: string;
	organization?: string;
	mmlu?: number;
	arc?: number;
	gpqa?: number;
	hellaswag?: number;
	truthfulqa?: number;
	average?: number;
}

interface BenchmarkMapping {
	field: keyof HFLeaderboardEntry;
	dimension: BenchmarkDimension;
	sourceKey: string;
}

const BENCHMARK_MAPPINGS: BenchmarkMapping[] = [
	{ field: 'mmlu', dimension: 'reasoning', sourceKey: 'mmlu' },
	{ field: 'arc', dimension: 'reasoning', sourceKey: 'arc' },
	{ field: 'gpqa', dimension: 'reasoning', sourceKey: 'gpqa' },
	{ field: 'truthfulqa', dimension: 'safety', sourceKey: 'truthfulqa' },
];

/**
 * Ingests HuggingFace Open LLM Leaderboard data.
 *
 * Maps individual benchmarks (MMLU, ARC, GPQA) to the "reasoning"
 * dimension and TruthfulQA to "safety".
 */
export const openLlmLeaderboardIngester: BenchmarkIngester = {
	source: 'mmlu',
	displayName: 'Open LLM Leaderboard',
	description:
		'Aggregated benchmark scores from the HuggingFace Open LLM Leaderboard.',

	async ingest(options?: IngesterOptions): Promise<BenchmarkResult[]> {
		const url = options?.sourceUrl ?? DEFAULT_HF_URL;
		const response = await fetchWithRetry(url, { fetch: options?.fetch });
		const text = await response.text();
		const data = parseJsonSafe<HFLeaderboardEntry[]>(
			text,
			'Open LLM Leaderboard'
		);
		const now = new Date();
		const results: BenchmarkResult[] = [];
		const dims = options?.dimensions
			? new Set<BenchmarkDimension>(options.dimensions)
			: null;

		let entries = data.filter((e) => e.model_name);

		if (options?.modelFilter?.length) {
			const filterSet = new Set(options.modelFilter);
			entries = entries.filter((e) =>
				filterSet.has(e.model_name.toLowerCase().replace(/\s+/g, '-'))
			);
		}

		for (const entry of entries) {
			const modelId = entry.model_name.toLowerCase().replace(/\s+/g, '-');
			const org = entry.organization?.toLowerCase() ?? 'unknown';
			const providerKey = mapOrganizationToProvider(org);

			for (const mapping of BENCHMARK_MAPPINGS) {
				if (dims && !dims.has(mapping.dimension)) continue;

				const value = entry[mapping.field];
				if (typeof value !== 'number') continue;

				results.push({
					id: `open-llm:${modelId}:${mapping.sourceKey}`,
					modelId,
					providerKey,
					source: mapping.sourceKey as BenchmarkResult['source'],
					dimension: mapping.dimension,
					score: Math.max(0, Math.min(100, value)),
					rawScore: value,
					metadata: {
						organization: entry.organization,
						leaderboard_average: entry.average,
					},
					measuredAt: now,
					ingestedAt: now,
				});
			}
		}

		return options?.maxResults ? results.slice(0, options.maxResults) : results;
	},
};

function mapOrganizationToProvider(org: string): string {
	const normalized = org.toLowerCase();
	if (normalized.includes('openai')) return 'openai';
	if (normalized.includes('anthropic')) return 'anthropic';
	if (normalized.includes('google') || normalized.includes('deepmind'))
		return 'gemini';
	if (normalized.includes('mistral')) return 'mistral';
	if (normalized.includes('meta')) return 'meta';
	return org;
}
