'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import type { TransformEngine } from '@lssm/lib.contracts';

import {
  type AgentHandlers,
  type AnalyticsHandlers,
  createAgentHandlers,
  createAnalyticsHandlers,
  createCrmHandlers,
  createIntegrationHandlers,
  createMarketplaceHandlers,
  createSaasHandlers,
  createWorkflowHandlers,
  type CrmHandlers,
  type IntegrationHandlers,
  LocalRuntimeServices,
  type MarketplaceHandlers,
  type SaasHandlers,
  type WorkflowHandlers,
} from '../infrastructure/runtime-local-web';

import { TemplateInstaller } from './installer';
import {
  getTemplate,
  type TemplateDefinition,
  type TemplateId,
} from './registry';
import { getTemplateEngine } from './engine';

export type { TemplateId };

/**
 * Template-specific handlers created from the runtime database
 */
export interface TemplateHandlers {
  crm: CrmHandlers;
  saas: SaasHandlers;
  agent: AgentHandlers;
  workflow: WorkflowHandlers;
  marketplace: MarketplaceHandlers;
  integration: IntegrationHandlers;
  analytics: AnalyticsHandlers;
}

export interface TemplateRuntimeContextValue {
  template: TemplateDefinition;
  runtime: LocalRuntimeServices;
  installer: TemplateInstaller;
  client: ApolloClient;
  components?: TemplateComponentRegistration;
  templateId: TemplateId;
  projectId: string;
  /** TransformEngine for rendering presentations */
  engine: TransformEngine;
  /** Database-backed handlers for template operations */
  handlers: TemplateHandlers;
}

const TemplateRuntimeContext =
  createContext<TemplateRuntimeContextValue | null>(null);

export interface TemplateRuntimeProviderProps extends PropsWithChildren {
  templateId: TemplateId;
  projectId?: string;
  lazy?: boolean;
}

export function TemplateRuntimeProvider({
  templateId,
  projectId,
  lazy = false,
  children,
}: TemplateRuntimeProviderProps) {
  const [value, setValue] = useState<TemplateRuntimeContextValue | null>(null);

  useEffect(() => {
    let cancelled = false;
    const runtime = new LocalRuntimeServices();
    const installer = new TemplateInstaller({ runtime });
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Unknown template: ${templateId}`);
    }

    const bootstrap = async () => {
      await installer.init();
      const resolvedProjectId = projectId ?? 'local-project';
      if (!lazy) {
        await installer.install(templateId, { projectId: resolvedProjectId });
      }
      if (cancelled) return;

      // Get the shared TransformEngine
      const engine = getTemplateEngine();

      // Create database-backed handlers
      const handlers: TemplateHandlers = {
        crm: createCrmHandlers(runtime.db),
        saas: createSaasHandlers(runtime.db),
        agent: createAgentHandlers(runtime.db),
        workflow: createWorkflowHandlers(runtime.db),
        marketplace: createMarketplaceHandlers(runtime.db),
        integration: createIntegrationHandlers(runtime.db),
        analytics: createAnalyticsHandlers(runtime.db),
      };

      setValue({
        template,
        runtime,
        installer,
        client: runtime.graphql.apollo,
        components: templateComponentRegistry.get(templateId),
        templateId,
        projectId: resolvedProjectId,
        engine,
        handlers,
      });
    };

    const unsubscribe = templateComponentRegistry.subscribe(
      (changedTemplateId) => {
        if (changedTemplateId !== templateId) return;
        setValue((previous) =>
          previous
            ? {
                ...previous,
                components: templateComponentRegistry.get(templateId),
              }
            : previous
        );
      }
    );

    bootstrap().catch((error) => {
      console.error('Failed to bootstrap template runtime', error);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [templateId, projectId, lazy]);

  const memoizedValue = useMemo(() => value, [value]);

  if (!memoizedValue) {
    return null;
  }

  return (
    <TemplateRuntimeContext.Provider value={memoizedValue}>
      <ApolloProvider client={memoizedValue.client}>{children}</ApolloProvider>
    </TemplateRuntimeContext.Provider>
  );
}

export function useTemplateRuntime(): TemplateRuntimeContextValue {
  const context = useContext(TemplateRuntimeContext);
  if (!context) {
    throw new Error(
      'useTemplateRuntime must be used within a TemplateRuntimeProvider'
    );
  }
  return context;
}

/**
 * Hook to access the TransformEngine for rendering presentations
 */
export function useTemplateEngine(): TransformEngine {
  const context = useTemplateRuntime();
  return context.engine;
}

/**
 * Hook to access the database-backed template handlers
 */
export function useTemplateHandlers(): TemplateHandlers {
  const context = useTemplateRuntime();
  return context.handlers;
}

/**
 * Hook to access CRM-specific handlers
 */
export function useCrmHandlers(): CrmHandlers {
  const context = useTemplateRuntime();
  return context.handlers.crm;
}

/**
 * Hook to access SaaS-specific handlers
 */
export function useSaasHandlers(): SaasHandlers {
  const context = useTemplateRuntime();
  return context.handlers.saas;
}

/**
 * Hook to access Agent Console-specific handlers
 */
export function useAgentHandlers(): AgentHandlers {
  const context = useTemplateRuntime();
  return context.handlers.agent;
}

/**
 * Hook to access Workflow-specific handlers
 */
export function useWorkflowHandlers(): WorkflowHandlers {
  const context = useTemplateRuntime();
  return context.handlers.workflow;
}

/**
 * Hook to access Marketplace-specific handlers
 */
export function useMarketplaceHandlers(): MarketplaceHandlers {
  const context = useTemplateRuntime();
  return context.handlers.marketplace;
}

/**
 * Hook to access Integration Hub-specific handlers
 */
export function useIntegrationHandlers(): IntegrationHandlers {
  const context = useTemplateRuntime();
  return context.handlers.integration;
}

/**
 * Hook to access Analytics Dashboard-specific handlers
 */
export function useAnalyticsHandlers(): AnalyticsHandlers {
  const context = useTemplateRuntime();
  return context.handlers.analytics;
}

export type TemplateComponentRegistration = Partial<{
  list: React.ComponentType<any>;
  detail: React.ComponentType<any>;
  form: React.ComponentType<any>;
}>;

class TemplateComponentRegistry {
  private readonly components = new Map<
    TemplateId,
    TemplateComponentRegistration
  >();
  private readonly listeners = new Set<(templateId: TemplateId) => void>();

  register(
    templateId: TemplateId,
    registration: TemplateComponentRegistration
  ) {
    this.components.set(templateId, registration);
    this.listeners.forEach((listener) => listener(templateId));
  }

  get(templateId: TemplateId) {
    return this.components.get(templateId);
  }

  subscribe(listener: (templateId: TemplateId) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const templateComponentRegistry = new TemplateComponentRegistry();

export function registerTemplateComponents(
  templateId: TemplateId,
  components: TemplateComponentRegistration
) {
  templateComponentRegistry.register(templateId, components);
}
