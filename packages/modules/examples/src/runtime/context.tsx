'use client';

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { web } from '@contractspec/lib.runtime-sandbox';

const { LocalRuntimeServices } = web;

import type { TransformEngine } from '@contractspec/lib.contracts-spec/presentations/transform-engine';

// Import handlers from example packages
import {
  createCrmHandlers,
  type CrmHandlers,
} from '@contractspec/example.crm-pipeline';
import {
  createSaasHandlers,
  type SaasHandlers,
} from '@contractspec/example.saas-boilerplate';
import {
  createAgentHandlers,
  type AgentHandlers,
} from '@contractspec/example.agent-console';
import {
  createWorkflowHandlers,
  type WorkflowHandlers,
} from '@contractspec/example.workflow-system';
import {
  createMarketplaceHandlers,
  type MarketplaceHandlers,
} from '@contractspec/example.marketplace';
import {
  createIntegrationHandlers,
  type IntegrationHandlers,
} from '@contractspec/example.integration-hub';
import {
  createAnalyticsHandlers,
  type AnalyticsHandlers,
} from '@contractspec/example.analytics-dashboard';
import {
  createPolicySafeKnowledgeAssistantHandlers,
  type PolicySafeKnowledgeAssistantHandlers,
} from '@contractspec/example.policy-safe-knowledge-assistant';

import { TemplateInstaller } from './installer';
import { getTemplate } from './registry';
import { getTemplateEngine } from './engine';

import {
  TemplateRuntimeContext,
  type TemplateRuntimeContextValue,
  type TemplateRuntimeProviderProps,
  useTemplateRuntime,
  useTemplateComponents,
} from '@contractspec/lib.example-shared-ui';

function logBootstrapFailure(error: unknown) {
  console.error(
    `
[TemplateRuntime] Bootstrap Failed
==================================

The runtime failed to initialize. This usually happens because:
1. The PostgreSQL Web environment (pglite) failed to load
2. The schema migration failed
3. The initial seed data could not be inserted

Check the console for specific database errors.
    `.trim(),
    error
  );
}

/**
 * Template-specific handlers created from the runtime database
 */
export class TemplateHandlers {
  crm!: CrmHandlers;
  saas!: SaasHandlers;
  agent!: AgentHandlers;
  workflow!: WorkflowHandlers;
  marketplace!: MarketplaceHandlers;
  integration!: IntegrationHandlers;
  analytics!: AnalyticsHandlers;
  policySafeKnowledgeAssistant!: PolicySafeKnowledgeAssistantHandlers;
}

export function TemplateRuntimeProvider({
  templateId,
  projectId = 'default-project',
  lazy = false,
  children,
}: PropsWithChildren<TemplateRuntimeProviderProps>) {
  const [context, setContext] = useState<TemplateRuntimeContextValue | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        if (lazy) return;

        // Load definition
        const template = getTemplate(templateId);
        if (!template) {
          throw new Error(`Template not found: ${templateId}`);
        }

        // Initialize runtime
        const runtime = new LocalRuntimeServices();
        await runtime.init({
          // In real app, we might persist to IndexedDB
          // dataDir: projectId // If persistence needed
        });

        // Initialize installer and run migrations/seeds
        const installer = new TemplateInstaller({ runtime });
        await installer.install(templateId, { projectId });

        // Create Apollo Client linked to local schema
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = (web as any).createLocalGraphqlClient(runtime);

        // Get or create transform engine
        const engine = await getTemplateEngine();

        // Initialize Handlers
        const handlers = new TemplateHandlers();
        handlers.crm = createCrmHandlers(runtime.db);
        handlers.saas = createSaasHandlers(runtime.db);
        handlers.agent = createAgentHandlers(runtime.db);
        handlers.workflow = createWorkflowHandlers(runtime.db);
        handlers.marketplace = createMarketplaceHandlers(runtime.db);
        handlers.integration = createIntegrationHandlers(runtime.db);
        handlers.analytics = createAnalyticsHandlers(runtime.db);
        handlers.policySafeKnowledgeAssistant =
          createPolicySafeKnowledgeAssistantHandlers(runtime.db);

        // Create data fetcher using the initialized handlers
        const fetchData = async (presentationName: string) => {
          // CRM Pipeline
          if (presentationName === 'crm-pipeline.dashboard') {
            const [dealsResult, stages] = await Promise.all([
              handlers.crm.listDeals({
                projectId,
                pipelineId: 'pipeline-1',
                limit: 50,
              }),
              handlers.crm.getPipelineStages({ pipelineId: 'pipeline-1' }),
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
          }
          if (presentationName === 'crm-pipeline.deal.pipeline') {
            const [dealsResult, stages] = await Promise.all([
              handlers.crm.listDeals({
                projectId,
                pipelineId: 'pipeline-1',
                limit: 100,
              }),
              handlers.crm.getPipelineStages({ pipelineId: 'pipeline-1' }),
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
          }

          // SaaS Boilerplate
          if (presentationName === 'saas-boilerplate.dashboard') {
            const [projectsResult, subscription] = await Promise.all([
              handlers.saas.listProjects({ projectId, limit: 10 }),
              handlers.saas.getSubscription({ projectId }),
            ]);
            return {
              data: {
                projects: projectsResult.items,
                subscription,
                summary: { totalProjects: projectsResult.total },
              },
              metadata: {
                total: projectsResult.total,
                timestamp: new Date(),
                source: 'saas-boilerplate',
              },
            };
          }
          if (presentationName === 'saas-boilerplate.project.list') {
            const result = await handlers.saas.listProjects({
              projectId,
              limit: 50,
            });
            return {
              data: result.items,
              metadata: {
                total: result.total,
                timestamp: new Date(),
                source: 'saas-boilerplate',
              },
            };
          }
          if (presentationName === 'saas-boilerplate.billing.settings') {
            const subscription = await handlers.saas.getSubscription({
              projectId,
            });
            return {
              data: subscription,
              metadata: { timestamp: new Date(), source: 'saas-boilerplate' },
            };
          }

          // Agent Console
          if (presentationName === 'agent-console.dashboard') {
            const [agentsResult, runsResult, toolsResult] = await Promise.all([
              handlers.agent.listAgents({
                projectId,
                organizationId: 'demo-org',
                limit: 10,
              }),
              handlers.agent.listRuns({ projectId, limit: 10 }),
              handlers.agent.listTools({
                projectId,
                organizationId: 'demo-org',
                limit: 10,
              }),
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
              metadata: { timestamp: new Date(), source: 'agent-console' },
            };
          }
          if (presentationName === 'agent-console.agent.list') {
            const result = await handlers.agent.listAgents({
              projectId,
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
          }
          if (presentationName === 'agent-console.run.list') {
            const result = await handlers.agent.listRuns({
              projectId,
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
          }
          if (presentationName === 'agent-console.tool.registry') {
            const result = await handlers.agent.listTools({
              projectId,
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
          }

          // Default fallback
          console.warn(
            `No data fetcher found for presentation: ${presentationName}`
          );
          return {
            data: null,
            metadata: { timestamp: new Date(), source: 'unknown' },
          };
        };

        if (mounted) {
          setContext({
            template,
            runtime,
            installer,
            client,
            templateId,
            projectId,
            engine,
            handlers,
            fetchData,
          });
        }
      } catch (err) {
        logBootstrapFailure(err);
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error('Unknown runtime error')
          );
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [templateId, projectId, lazy]);

  // Load registered components
  const components = useTemplateComponents(templateId);

  // Combine context with components
  const contextValue = useMemo(() => {
    if (!context) return null;
    return {
      ...context,
      components,
    };
  }, [context, components]);

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-500">
        <h3 className="font-bold">Runtime Error</h3>
        <pre className="mt-2 overflow-auto text-xs">{error.message}</pre>
      </div>
    );
  }

  if (!contextValue) {
    return (
      <div className="animate-pulse p-12 text-center text-gray-400">
        Initializing runtime environment...
      </div>
    );
  }

  return (
    <ApolloProvider client={contextValue.client}>
      <TemplateRuntimeContext.Provider value={contextValue}>
        {children}
      </TemplateRuntimeContext.Provider>
    </ApolloProvider>
  );
}

// Hook to access the TransformEngine for rendering presentations
export function useTemplateEngine(): TransformEngine {
  return useTemplateRuntime().engine;
}

// Hook to access the database-backed template handlers
export function useTemplateHandlers(): TemplateHandlers {
  return useTemplateRuntime<TemplateHandlers>().handlers;
}

// Hook to access CRM-specific handlers
export function useCrmHandlers(): CrmHandlers {
  return useTemplateHandlers().crm;
}

// Hook to access SaaS-specific handlers
export function useSaasHandlers(): SaasHandlers {
  return useTemplateHandlers().saas;
}

// Hook to access Agent Console-specific handlers
export function useAgentHandlers(): AgentHandlers {
  return useTemplateHandlers().agent;
}

// Hook to access Workflow-specific handlers
export function useWorkflowHandlers(): WorkflowHandlers {
  return useTemplateHandlers().workflow;
}

// Hook to access Marketplace-specific handlers
export function useMarketplaceHandlers(): MarketplaceHandlers {
  return useTemplateHandlers().marketplace;
}

// Hook to access Integration Hub-specific handlers
export function useIntegrationHandlers(): IntegrationHandlers {
  return useTemplateHandlers().integration;
}

// Hook to access Analytics Dashboard-specific handlers
export function useAnalyticsHandlers(): AnalyticsHandlers {
  return useTemplateHandlers().analytics;
}

// End of file
