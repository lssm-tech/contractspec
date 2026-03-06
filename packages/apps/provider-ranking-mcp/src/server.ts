import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Logger, LogLevel } from '@contractspec/lib.logger';
import {
  installOp,
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
  definePrompt,
  defineResourceTemplate,
} from '@contractspec/lib.contracts-spec';
import {
  BenchmarkIngestCommand,
  BenchmarkRunCustomCommand,
  RankingRefreshCommand,
} from '@contractspec/lib.contracts-spec/provider-ranking';
import { createMcpServer } from '@contractspec/lib.contracts-runtime-server-mcp/provider-mcp';
import { PresentationRegistry } from '@contractspec/lib.contracts-spec/presentations';
import type { ProviderRankingStore } from '@contractspec/lib.provider-ranking/store';
import { InMemoryProviderRankingStore } from '@contractspec/lib.provider-ranking/in-memory-store';
import { createDefaultIngesterRegistry } from '@contractspec/lib.provider-ranking/ingesters';
import {
  normalizeBenchmarkResults,
  computeModelRankings,
} from '@contractspec/lib.provider-ranking/scoring';
import type { BenchmarkDimension } from '@contractspec/lib.provider-ranking/types';
import z from 'zod';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment:
    (process.env.NODE_ENV as
      | 'production'
      | 'development'
      | 'test'
      | undefined) ?? 'development',
  enableTracing: false,
  enableTiming: false,
  enableContext: false,
  enableColors: process.env.NODE_ENV !== 'production',
});

function createStore(): ProviderRankingStore {
  return new InMemoryProviderRankingStore();
}

const store = createStore();
const ingesterRegistry = createDefaultIngesterRegistry();

function buildOps(): OperationSpecRegistry {
  const registry = new OperationSpecRegistry();

  installOp(registry, BenchmarkIngestCommand, async (args) => {
    const source = args.source as string;
    const ingester = ingesterRegistry.get(
      source as Parameters<typeof ingesterRegistry.get>[0]
    );
    if (!ingester) {
      throw new Error(`No ingester registered for source: ${source}`);
    }

    const rawResults = await ingester.ingest({
      sourceUrl: args.sourceUrl as string | undefined,
      dimensions: args.dimensions as BenchmarkDimension[] | undefined,
      fromDate: args.fromDate ?? undefined,
      toDate: args.toDate ?? undefined,
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

  installOp(registry, RankingRefreshCommand, async (_args) => {
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

    const newRankings = computeModelRankings(
      allResults,
      undefined,
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

function buildResources(): ResourceRegistry {
  const resources = new ResourceRegistry();

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'ranking://leaderboard',
        title: 'AI Model Leaderboard',
        description: 'Current ranked list of AI models by composite score.',
        mimeType: 'application/json',
        tags: ['ranking', 'mcp'],
      },
      input: z.object({}),
      resolve: async () => {
        const result = await store.listModelRankings({ limit: 100 });
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
          'Ranked list of AI models filtered by a specific dimension.',
        mimeType: 'application/json',
        tags: ['ranking', 'mcp'],
      },
      input: z.object({ dimension: z.string() }),
      resolve: async ({ dimension }) => {
        const result = await store.listModelRankings({
          dimension: dimension as BenchmarkDimension,
          limit: 100,
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
        description: 'Detailed profile for a specific AI model.',
        mimeType: 'application/json',
        tags: ['ranking', 'mcp'],
      },
      input: z.object({ modelId: z.string() }),
      resolve: async ({ modelId }) => {
        const profile = await store.getModelProfile(modelId);
        return {
          uri: `ranking://model/${encodeURIComponent(modelId)}`,
          mimeType: 'application/json',
          data: profile
            ? JSON.stringify(profile, null, 2)
            : JSON.stringify({ error: 'not_found', modelId }),
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
        tags: ['ranking', 'mcp'],
      },
      input: z.object({}),
      resolve: async () => {
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

function buildPrompts(): PromptRegistry {
  const prompts = new PromptRegistry();

  prompts.register(
    definePrompt({
      meta: {
        key: 'ranking.advisor',
        version: '1.0.0',
        title: 'AI Model Advisor',
        description: 'Recommend the best AI model for a given task.',
        tags: ['ranking', 'mcp'],
        stability: 'beta',
        owners: ['platform.ai'],
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
      ],
      input: z.object({
        task: z.string(),
        priority: z.string().optional(),
      }),
      render: async ({ task, priority }) => [
        {
          type: 'text' as const,
          text: `Recommend the best AI model for: "${task}".${priority ? ` Prioritize: ${priority}.` : ''} Use the leaderboard data to justify your recommendation.`,
        },
        {
          type: 'resource' as const,
          uri: priority
            ? `ranking://leaderboard/${priority}`
            : 'ranking://leaderboard',
          title: 'Leaderboard',
        },
      ],
    })
  );

  return prompts;
}

const server = new McpServer(
  {
    name: process.env.RANKING_MCP_NAME ?? 'provider-ranking-mcp',
    version: process.env.RANKING_MCP_VERSION ?? '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      logging: {},
    },
  }
);

createMcpServer(server, buildOps(), buildResources(), buildPrompts(), {
  logger,
  toolCtx: () => ({
    actor: 'anonymous' as const,
    decide: async () => ({ effect: 'allow' as const }),
  }),
  promptCtx: () => ({ locale: 'en' }),
  resourceCtx: () => ({ locale: 'en' }),
  presentations: new PresentationRegistry(),
});

const transport = new StdioServerTransport();

server.connect(transport).then(() => {
  logger.info('provider-ranking-mcp.started', {
    transport: 'stdio',
    tools: ['benchmark.ingest', 'benchmark.run-custom', 'ranking.refresh'],
    resources: [
      'ranking://leaderboard',
      'ranking://model/{id}',
      'ranking://results',
    ],
    prompts: ['ranking.advisor'],
  });
});

const shutdown = async (signal: string) => {
  logger.info('provider-ranking-mcp.shutdown', { signal });
  await server.close();
  await logger.flush();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

export { server };
export type { ProviderRankingStore };
