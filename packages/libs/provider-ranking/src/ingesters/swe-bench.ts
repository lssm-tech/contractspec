import type { BenchmarkResult } from '../types';
import { fetchWithRetry, parseJsonSafe } from './fetch-utils';
import type { BenchmarkIngester, IngesterOptions } from './types';

const DEFAULT_SWE_BENCH_URL =
	'https://raw.githubusercontent.com/princeton-nlp/SWE-bench/main/docs/leaderboard.json';

interface SweBenchEntry {
	model: string;
	organization?: string;
	resolved_rate: number;
	date?: string;
}

/**
 * Ingests SWE-bench leaderboard data.
 *
 * SWE-bench measures real-world software engineering task completion,
 * mapped to the "coding" dimension.
 */
export const sweBenchIngester: BenchmarkIngester = {
	source: 'swe-bench',
	displayName: 'SWE-bench',
	description: 'Software engineering task completion rates from SWE-bench.',

	async ingest(options?: IngesterOptions): Promise<BenchmarkResult[]> {
		if (options?.dimensions?.length && !options.dimensions.includes('coding')) {
			return [];
		}

		const url = options?.sourceUrl ?? DEFAULT_SWE_BENCH_URL;
		const response = await fetchWithRetry(url, { fetch: options?.fetch });
		const text = await response.text();
		const data = parseJsonSafe<SweBenchEntry[]>(text, 'SWE-bench');
		const now = new Date();

		let entries = data.filter(
			(entry) => entry.model && entry.resolved_rate != null
		);

		if (options?.modelFilter?.length) {
			const filterSet = new Set(options.modelFilter);
			entries = entries.filter((e) =>
				filterSet.has(e.model.toLowerCase().replace(/\s+/g, '-'))
			);
		}

		if (options?.maxResults) {
			entries = entries.slice(0, options.maxResults);
		}

		let results = entries.map((entry): BenchmarkResult => {
			const modelId = entry.model.toLowerCase().replace(/\s+/g, '-');
			const org = entry.organization?.toLowerCase() ?? 'unknown';

			return {
				id: `swe-bench:${modelId}:coding`,
				modelId,
				providerKey: mapOrganizationToProvider(org),
				source: 'swe-bench',
				dimension: 'coding',
				score: Math.max(0, Math.min(100, entry.resolved_rate)),
				rawScore: entry.resolved_rate,
				metadata: {
					organization: entry.organization,
					date: entry.date,
				},
				measuredAt: entry.date ? new Date(entry.date) : now,
				ingestedAt: now,
			};
		});

		const { fromDate, toDate } = options ?? {};
		if (fromDate) {
			results = results.filter((r) => r.measuredAt >= fromDate);
		}
		if (toDate) {
			results = results.filter((r) => r.measuredAt <= toDate);
		}

		return results;
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
