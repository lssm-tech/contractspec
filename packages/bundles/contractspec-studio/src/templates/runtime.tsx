import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  ApolloProvider,
  type ApolloClient,
  type NormalizedCacheObject,
} from '@apollo/client';

import { LocalRuntimeServices } from '@lssm/lib.runtime-local';

import { TemplateInstaller } from './installer';
import {
  getTemplate,
  type TemplateDefinition,
  type TemplateId,
} from './registry';

export interface TemplateRuntimeContextValue {
  template: TemplateDefinition;
  runtime: LocalRuntimeServices;
  installer: TemplateInstaller;
  client: ApolloClient<NormalizedCacheObject>;
  components?: TemplateComponentRegistration;
  templateId: TemplateId;
  projectId: string;
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
  const [value, setValue] =
    useState<TemplateRuntimeContextValue | null>(null);

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
      setValue({
        template,
        runtime,
        installer,
        client: runtime.graphql.apollo,
        components: templateComponentRegistry.get(templateId),
        templateId,
        projectId: resolvedProjectId,
      });
    };

    const unsubscribe = templateComponentRegistry.subscribe(
      (changedTemplateId) => {
        if (changedTemplateId !== templateId) return;
        setValue((previous) =>
          previous
            ? {
                ...previous,
                components:
                  templateComponentRegistry.get(templateId),
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
      <ApolloProvider client={memoizedValue.client}>
        {children}
      </ApolloProvider>
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

export type TemplateComponentRegistration = Partial<{
  list: React.ComponentType;
  detail: React.ComponentType;
  form: React.ComponentType;
}>;

class TemplateComponentRegistry {
  private readonly components = new Map<
    TemplateId,
    TemplateComponentRegistration
  >();
  private readonly listeners = new Set<
    (templateId: TemplateId) => void
  >();

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

export const templateComponentRegistry =
  new TemplateComponentRegistry();

export function registerTemplateComponents(
  templateId: TemplateId,
  components: TemplateComponentRegistration
) {
  templateComponentRegistry.register(templateId, components);
}

