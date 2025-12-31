import { createContext, useContext } from 'react';
import type { ApolloClient } from '@apollo/client';
import type { TransformEngine } from '@contractspec/lib.contracts';
import type { TemplateDefinition, TemplateId } from './types';

// Generic interface for handlers to avoid circular dependencies
// Real types are defined in @contractspec/module.examples or specific example packages
export type GenericTemplateHandlers = any;

export interface TemplateRuntimeContextValue<
  THandlers = GenericTemplateHandlers,
> {
  template: TemplateDefinition;
  runtime: any; // LocalRuntimeServices
  installer: any; // TemplateInstaller
  client: ApolloClient;
  components?: any; // TemplateComponentRegistration
  /** @deprecated use template.id */
  templateId: TemplateId;
  projectId: string;
  engine: TransformEngine;
  fetchData: (presentationName: string) => Promise<{ data: unknown; metadata?: any }>;
  handlers: THandlers;
  resolvePresentation?: (presentationName: string) => any;
}

export const TemplateRuntimeContext = createContext<TemplateRuntimeContextValue | null>(
  null
);

export function useTemplateRuntime(): TemplateRuntimeContextValue {
  const context = useContext(TemplateRuntimeContext);
  if (!context) {
    throw new Error(
      'useTemplateRuntime must be used within a TemplateRuntimeProvider'
    );
  }
  return context;
}

export interface TemplateRuntimeProviderProps {
  templateId: TemplateId;
  projectId?: string;
  lazy?: boolean;
}
