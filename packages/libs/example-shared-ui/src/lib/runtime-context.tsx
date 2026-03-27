'use client';

import type { ApolloClient } from '@apollo/client';
import type { TransformEngine } from '@contractspec/lib.presentation-runtime-core/transform-engine';
import { createContext, useContext, type Context } from 'react';
import type {
	TemplateDefinition,
	TemplateId,
	TemplateInstaller,
} from './types';

// Generic interface for handlers to avoid circular dependencies
// Real types are defined in @contractspec/module.examples or specific example packages
export type GenericTemplateHandlers = unknown;

export interface TemplateRuntimeContextValue<
	THandlers = GenericTemplateHandlers,
> {
	template: TemplateDefinition;
	runtime: unknown; // LocalRuntimeServices
	installer: TemplateInstaller;
	client: ApolloClient;
	components?: unknown; // TemplateComponentRegistration
	/** @deprecated use template.id */
	templateId: TemplateId;
	projectId: string;
	engine: TransformEngine;
	fetchData: (
		presentationName: string
	) => Promise<{ data: unknown; metadata?: unknown }>;
	handlers: THandlers;
	resolvePresentation?: (presentationName: string) => unknown;
}

const TEMPLATE_RUNTIME_CONTEXT_KEY = Symbol.for(
	'@contractspec/lib.example-shared-ui/template-runtime-context'
);

type TemplateRuntimeContextStore = typeof globalThis & {
	[TEMPLATE_RUNTIME_CONTEXT_KEY]?: Context<TemplateRuntimeContextValue | null>;
};

function getTemplateRuntimeContextSingleton() {
	const store = globalThis as TemplateRuntimeContextStore;
	store[TEMPLATE_RUNTIME_CONTEXT_KEY] ??=
		createContext<TemplateRuntimeContextValue | null>(null);
	return store[TEMPLATE_RUNTIME_CONTEXT_KEY];
}

export const TemplateRuntimeContext = getTemplateRuntimeContextSingleton();

export function useTemplateRuntime<
	THandlers = GenericTemplateHandlers,
>(): TemplateRuntimeContextValue<THandlers> {
	const context = useContext(TemplateRuntimeContext);
	if (!context) {
		throw new Error(
			'useTemplateRuntime must be used within a TemplateRuntimeProvider'
		);
	}
	return context as TemplateRuntimeContextValue<THandlers>;
}

export interface TemplateRuntimeProviderProps {
	templateId: TemplateId;
	projectId?: string;
	lazy?: boolean;
}
