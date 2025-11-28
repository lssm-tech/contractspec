/**
 * Fetch Presentation Data Utility
 *
 * Maps presentation names to their appropriate data handlers
 * and fetches data for schema-driven markdown rendering.
 */
import type { TemplateId } from '../../../../../templates/registry';

// Import handlers from example packages
import {
  mockGetPipelineStagesHandler,
  mockListDealsHandler,
} from '@lssm/example.crm-pipeline/handlers';
import {
  mockGetSubscriptionHandler,
  mockListProjectsHandler,
} from '@lssm/example.saas-boilerplate/handlers';
import {
  mockListAgentsHandler,
  mockListRunsHandler,
  mockListToolsHandler,
} from '@lssm/example.agent-console/handlers/index';

/**
 * Data fetcher result type
 */
export interface PresentationDataResult {
  data: unknown;
  metadata?: {
    total?: number;
    timestamp?: Date;
    source?: string;
  };
}

/**
 * Presentation data fetcher function type
 */
type PresentationDataFetcher = () => Promise<PresentationDataResult>;

/**
 * Map of presentation names to their data fetchers
 */
const presentationDataFetchers: Record<string, PresentationDataFetcher> = {
  // CRM Pipeline presentations
  'crm-pipeline.dashboard': async () => {
    const [dealsResult, stages] = await Promise.all([
      mockListDealsHandler({ pipelineId: 'pipeline-1', limit: 50 }),
      mockGetPipelineStagesHandler({ pipelineId: 'pipeline-1' }),
    ]);
    return {
      data: {
        deals: dealsResult.deals,
        stages,
        summary: {
          total: dealsResult.total,
          totalValue: dealsResult.totalValue,
        },
      },
      metadata: {
        total: dealsResult.total,
        timestamp: new Date(),
        source: 'crm-pipeline',
      },
    };
  },
  'crm-pipeline.deal.pipeline': async () => {
    const [dealsResult, stages] = await Promise.all([
      mockListDealsHandler({ pipelineId: 'pipeline-1', limit: 100 }),
      mockGetPipelineStagesHandler({ pipelineId: 'pipeline-1' }),
    ]);
    return {
      data: {
        deals: dealsResult.deals,
        stages,
        total: dealsResult.total,
        totalValue: dealsResult.totalValue,
      },
      metadata: {
        total: dealsResult.total,
        timestamp: new Date(),
        source: 'crm-pipeline',
      },
    };
  },

  // SaaS Boilerplate presentations
  'saas-boilerplate.dashboard': async () => {
    const [projectsResult, subscription] = await Promise.all([
      mockListProjectsHandler({ limit: 10 }),
      mockGetSubscriptionHandler(),
    ]);
    return {
      data: {
        projects: projectsResult.projects,
        subscription,
        summary: {
          totalProjects: projectsResult.total,
        },
      },
      metadata: {
        total: projectsResult.total,
        timestamp: new Date(),
        source: 'saas-boilerplate',
      },
    };
  },
  'saas-boilerplate.project.list': async () => {
    const result = await mockListProjectsHandler({ limit: 50 });
    return {
      data: result.projects,
      metadata: {
        total: result.total,
        timestamp: new Date(),
        source: 'saas-boilerplate',
      },
    };
  },
  'saas-boilerplate.billing.settings': async () => {
    const subscription = await mockGetSubscriptionHandler();
    return {
      data: subscription,
      metadata: {
        timestamp: new Date(),
        source: 'saas-boilerplate',
      },
    };
  },

  // Agent Console presentations
  'agent-console.dashboard': async () => {
    const [agentsResult, runsResult, toolsResult] = await Promise.all([
      mockListAgentsHandler({ organizationId: 'demo-org', limit: 10 }),
      mockListRunsHandler({ limit: 10 }),
      mockListToolsHandler({ organizationId: 'demo-org', limit: 10 }),
    ]);
    return {
      data: {
        agents: agentsResult.items,
        runs: runsResult.items,
        tools: toolsResult.items,
        summary: {
          totalAgents: agentsResult.total,
          totalRuns: runsResult.total,
          totalTools: toolsResult.total,
        },
      },
      metadata: {
        timestamp: new Date(),
        source: 'agent-console',
      },
    };
  },
  'agent-console.agent.list': async () => {
    const result = await mockListAgentsHandler({
      organizationId: 'demo-org',
      limit: 50,
    });
    return {
      data: result.items,
      metadata: {
        total: result.total,
        timestamp: new Date(),
        source: 'agent-console',
      },
    };
  },
  'agent-console.run.list': async () => {
    const result = await mockListRunsHandler({ limit: 50 });
    return {
      data: result.items,
      metadata: {
        total: result.total,
        timestamp: new Date(),
        source: 'agent-console',
      },
    };
  },
  'agent-console.tool.registry': async () => {
    const result = await mockListToolsHandler({
      organizationId: 'demo-org',
      limit: 50,
    });
    return {
      data: result.items,
      metadata: {
        total: result.total,
        timestamp: new Date(),
        source: 'agent-console',
      },
    };
  },
};

/**
 * Fetch data for a presentation using the appropriate contract handler.
 * Maps presentation names to their data sources.
 *
 * @param presentationName - The fully-qualified presentation name (e.g., 'crm-pipeline.dashboard')
 * @param templateId - The template ID for context
 * @returns The presentation data result
 */
export async function fetchPresentationData(
  presentationName: string,
  templateId: TemplateId
): Promise<PresentationDataResult> {
  // Try exact match first
  const fetcher = presentationDataFetchers[presentationName];
  if (fetcher) {
    return fetcher();
  }

  // Try template-prefixed match
  const prefixedName = `${templateId}.${presentationName.split('.').pop()}`;
  const prefixedFetcher = presentationDataFetchers[prefixedName];
  if (prefixedFetcher) {
    return prefixedFetcher();
  }

  // Return empty data with warning
  console.warn(
    `No data fetcher found for presentation: ${presentationName} (template: ${templateId})`
  );
  return {
    data: null,
    metadata: {
      timestamp: new Date(),
      source: 'unknown',
    },
  };
}

/**
 * Check if a presentation has a data fetcher registered
 */
export function hasPresentationDataFetcher(presentationName: string): boolean {
  return presentationName in presentationDataFetchers;
}

/**
 * Get list of all registered presentation data fetchers
 */
export function getRegisteredPresentationFetchers(): string[] {
  return Object.keys(presentationDataFetchers);
}
