import { getModelInfo } from '@contractspec/lib.ai-providers/models';
import {
	definePrompt,
	defineResourceTemplate,
	installOp,
	OperationSpecRegistry,
	PromptRegistry,
	ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import {
	BenchmarkIngestCommand,
	BenchmarkRunCustomCommand,
	RankingRefreshCommand,
} from '@contractspec/lib.contracts-spec/provider-ranking';
import { InMemoryProviderRankingStore } from '@contractspec/lib.provider-ranking/in-memory-store';
import { createDefaultIngesterRegistry } from '@contractspec/lib.provider-ranking/ingesters';
import {
	computeModelRankings,
	normalizeBenchmarkResults,
} from '@contractspec/lib.provider-ranking/scoring';
import type { ProviderRankingStore } from '@contractspec/lib.provider-ranking/store';
import type {
	ProviderAuthSupport,
	ProviderTransportSupport,
} from '@contractspec/lib.provider-ranking/types';
import z from 'zod';
import { appLogger } from '../../infrastructure/elysia/logger';
import { createMcpElysiaHandler } from './common';

const TransportFilterSchema = z
	.enum(['rest', 'mcp', 'webhook', 'sdk'])
	.optional();
const AuthFilterSchema = z
	.enum([
		'api-key',
		'oauth2',
		'bearer',
		'header',
		'basic',
		'webhook-signing',
		'service-account',
	])
	.optional();

const RANKING_TAGS = ['ranking', 'mcp', 'ai'];
const RANKING_OWNERS = ['platform.ai'];

let sharedStore: ProviderRankingStore | null = null;

function getStore(): ProviderRankingStore {
	if (!sharedStore) {
		sharedStore = new InMemoryProviderRankingStore();
	}
	return sharedStore;
}

function buildRankingResources() {
	const resources = new ResourceRegistry();

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'ranking://leaderboard',
				title: 'AI Model Leaderboard',
				description:
					'Current ranked list of AI models by composite score. Supports optional transport and authMethod query filters.',
				mimeType: 'application/json',
				tags: RANKING_TAGS,
			},
			input: z.object({
				transport: TransportFilterSchema,
				authMethod: AuthFilterSchema,
			}),
			resolve: async ({ transport, authMethod }) => {
				const store = getStore();
				const result = await store.listModelRankings({
					limit: 100,
					requiredTransport: transport as ProviderTransportSupport | undefined,
					requiredAuthMethod: authMethod as ProviderAuthSupport | undefined,
				});
				return {
					uri: 'ranking://leaderboard',
					mimeType: 'application/json',
					data: JSON.stringify(result, null, 2),
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'ranking://leaderboard/{dimension}',
				title: 'AI Model Leaderboard by Dimension',
				description:
					'Ranked list of AI models filtered by a specific dimension. Supports optional transport and authMethod query filters.',
				mimeType: 'application/json',
				tags: RANKING_TAGS,
			},
			input: z.object({
				dimension: z.string(),
				transport: TransportFilterSchema,
				authMethod: AuthFilterSchema,
			}),
			resolve: async ({ dimension, transport, authMethod }) => {
				const store = getStore();
				const result = await store.listModelRankings({
					dimension: dimension as
						| 'coding'
						| 'reasoning'
						| 'agentic'
						| 'cost'
						| 'latency'
						| 'context'
						| 'safety'
						| 'custom',
					limit: 100,
					requiredTransport: transport as ProviderTransportSupport | undefined,
					requiredAuthMethod: authMethod as ProviderAuthSupport | undefined,
				});
				return {
					uri: `ranking://leaderboard/${encodeURIComponent(dimension)}`,
					mimeType: 'application/json',
					data: JSON.stringify(result, null, 2),
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'ranking://model/{modelId}',
				title: 'AI Model Profile',
				description:
					'Detailed profile for a specific AI model including scores and benchmarks.',
				mimeType: 'application/json',
				tags: RANKING_TAGS,
			},
			input: z.object({ modelId: z.string() }),
			resolve: async ({ modelId }) => {
				const store = getStore();
				const profile = await store.getModelProfile(modelId);
				if (!profile) {
					return {
						uri: `ranking://model/${encodeURIComponent(modelId)}`,
						mimeType: 'application/json',
						data: JSON.stringify({ error: 'not_found', modelId }),
					};
				}
				// Enrich with cost from ai-providers when store has none
				const enriched =
					profile.costPerMillion == null
						? (() => {
								const info = getModelInfo(profile.modelId);
								return info?.costPerMillion
									? {
											...profile,
											costPerMillion: info.costPerMillion,
											displayName: info.name,
											contextWindow: info.contextWindow,
											capabilities: [
												...(info.capabilities.vision ? ['vision'] : []),
												...(info.capabilities.tools ? ['tools'] : []),
												...(info.capabilities.reasoning ? ['reasoning'] : []),
												...(info.capabilities.streaming ? ['streaming'] : []),
											],
										}
									: profile;
							})()
						: profile;
				return {
					uri: `ranking://model/${encodeURIComponent(modelId)}`,
					mimeType: 'application/json',
					data: JSON.stringify(enriched, null, 2),
				};
			},
		})
	);

	resources.register(
		defineResourceTemplate({
			meta: {
				uriTemplate: 'ranking://results',
				title: 'Benchmark Results',
				description: 'List of raw benchmark results from all ingested sources.',
				mimeType: 'application/json',
				tags: RANKING_TAGS,
			},
			input: z.object({}),
			resolve: async () => {
				const store = getStore();
				const result = await store.listBenchmarkResults({ limit: 200 });
				return {
					uri: 'ranking://results',
					mimeType: 'application/json',
					data: JSON.stringify(result, null, 2),
				};
			},
		})
	);

	return resources;
}

function buildRankingPrompts() {
	const prompts = new PromptRegistry();

	prompts.register(
		definePrompt({
			meta: {
				key: 'ranking.advisor',
				version: '1.0.0',
				title: 'AI Model Advisor',
				description:
					'Which AI model is best for a given task? Uses the leaderboard to recommend.',
				tags: RANKING_TAGS,
				stability: 'beta',
				owners: RANKING_OWNERS,
			},
			args: [
				{
					name: 'task',
					description: 'The task or use case to recommend a model for.',
					required: true,
					schema: z.string(),
				},
				{
					name: 'priority',
					description:
						'Priority dimension (coding, reasoning, cost, latency, etc.).',
					required: false,
					schema: z.string().optional(),
				},
				{
					name: 'transport',
					description: 'Required transport type (rest, mcp, webhook, sdk).',
					required: false,
					schema: TransportFilterSchema,
				},
				{
					name: 'authMethod',
					description: 'Required auth method (api-key, oauth2, bearer, etc.).',
					required: false,
					schema: AuthFilterSchema,
				},
			],
			input: z.object({
				task: z.string(),
				priority: z.string().optional(),
				transport: TransportFilterSchema,
				authMethod: AuthFilterSchema,
			}),
			render: async ({ task, priority, transport, authMethod }) => {
				const constraints: string[] = [];
				if (priority) constraints.push(`Prioritize: ${priority}.`);
				if (transport) constraints.push(`Required transport: ${transport}.`);
				if (authMethod) constraints.push(`Required auth: ${authMethod}.`);

				return [
					{
						type: 'text' as const,
						text: `Recommend the best AI model for: "${task}".${constraints.length ? ` ${constraints.join(' ')}` : ''} Use the leaderboard data to justify your recommendation.`,
					},
					{
						type: 'resource' as const,
						uri: priority
							? `ranking://leaderboard/${priority}`
							: 'ranking://leaderboard',
						title: 'Leaderboard',
					},
				];
			},
		})
	);

	return prompts;
}

function buildRankingOps() {
	const registry = new OperationSpecRegistry();
	const ingesterRegistry = createDefaultIngesterRegistry();

	installOp(registry, BenchmarkIngestCommand, async (args) => {
		const store = getStore();
		const source = args.source as string;
		const ingester = ingesterRegistry.get(
			source as Parameters<typeof ingesterRegistry.get>[0]
		);
		if (!ingester) {
			throw new Error(`No ingester registered for source: ${source}`);
		}

		const rawResults = await ingester.ingest({
			sourceUrl: args.sourceUrl as string | undefined,
			dimensions: args.dimensions as string[] | undefined as Parameters<
				typeof ingester.ingest
			>[0] extends undefined
				? never
				: NonNullable<Parameters<typeof ingester.ingest>[0]>['dimensions'],
		});
		const normalized = normalizeBenchmarkResults(rawResults);

		for (const result of normalized) {
			await store.upsertBenchmarkResult(result);
		}

		return {
			ingestionId: `ingest-${source}-${Date.now()}`,
			source,
			resultsCount: normalized.length,
			status: 'completed',
			ingestedAt: new Date(),
		};
	});

	installOp(registry, BenchmarkRunCustomCommand, async (args) => {
		return {
			runId: `custom-${Date.now()}`,
			evalSuiteKey: args.evalSuiteKey,
			modelId: args.modelId,
			status: 'started',
			startedAt: new Date(),
		};
	});

	installOp(registry, RankingRefreshCommand, async (args) => {
		const store = getStore();
		const allResults = [];
		let offset = 0;
		const pageSize = 500;

		while (true) {
			const page = await store.listBenchmarkResults({
				limit: pageSize,
				offset,
			});
			allResults.push(...page.results);
			if (allResults.length >= page.total || page.results.length < pageSize)
				break;
			offset += pageSize;
		}

		const existingRankings = new Map(
			(await store.listModelRankings({ limit: 10000 })).rankings.map((r) => [
				r.modelId,
				r,
			])
		);

		const weightOverrides = args.weightOverrides
			? Array.isArray(args.weightOverrides)
				? args.weightOverrides
				: [args.weightOverrides]
			: undefined;

		const newRankings = computeModelRankings(
			allResults,
			weightOverrides
				? {
						weightOverrides: weightOverrides as Parameters<
							typeof computeModelRankings
						>[1] extends undefined
							? never
							: NonNullable<
									Parameters<typeof computeModelRankings>[1]
								>['weightOverrides'],
					}
				: undefined,
			existingRankings
		);

		for (const ranking of newRankings) {
			await store.upsertModelRanking(ranking);
		}

		return {
			modelsRanked: newRankings.length,
			updatedAt: new Date(),
			status: 'completed',
		};
	});

	return registry;
}

export function createProviderRankingMcpHandler(path = '/api/mcp/ranking') {
	return createMcpElysiaHandler({
		logger: appLogger,
		path,
		serverName: 'contractspec-ranking-mcp',
		ops: buildRankingOps(),
		resources: buildRankingResources(),
		prompts: buildRankingPrompts(),
	});
}

/**
 * Allows external callers to inject a custom store
 * (e.g. PostgresProviderRankingStore from the module layer).
 */
export function setProviderRankingStore(store: ProviderRankingStore): void {
	sharedStore = store;
}
