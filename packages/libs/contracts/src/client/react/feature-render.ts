import React from 'react';
import {
  type ComponentMap,
  createDefaultTransformEngine,
  type PresentationDescriptorV2,
  type PresentationTarget,
  type ReactRenderDescriptor,
  registerBasicValidation,
  registerDefaultReactRenderer,
  TransformEngine,
} from '../../presentations/';
import { type FeatureModuleSpec, FeatureRegistry } from '../../features';
import type { BlockConfig } from '@blocknote/core';

export function createEngineWithDefaults(): TransformEngine {
  return registerBasicValidation(
    registerDefaultReactRenderer(createDefaultTransformEngine())
  );
}

export async function renderFeaturePresentation(
  engine: TransformEngine,
  target: PresentationTarget,
  desc: PresentationDescriptorV2,
  options?: {
    componentMap?: ComponentMap;
    reactProps?: Record<string, unknown>;
    renderBlockNote?: (
      docJson: unknown,
      blockConfig?: BlockConfig
    ) => React.ReactElement;
  }
): Promise<React.ReactElement | { mimeType: string; body: string } | null> {
  if (target === 'react') {
    const rd = await engine.render<ReactRenderDescriptor>('react', desc);
    if (rd.kind === 'react_component') {
      const map = options?.componentMap ?? {};
      const C = map[rd.componentKey];
      if (!C) return null;
      const merged = {
        ...(rd.props ?? {}),
        ...(options?.reactProps ?? {}),
      } as Record<string, unknown>;
      return React.createElement(C, merged);
    }
    if (rd.kind === 'blocknotejs') {
      if (options?.renderBlockNote)
        return options.renderBlockNote(rd.docJson, rd.blockConfig);
      return React.createElement(
        'div',
        {},
        '[BlockNote renderer not configured]'
      );
    }
    return null;
  }
  // Non-react targets
  if (target === 'markdown') return engine.render(target, desc);
  if (target === 'application/json') return engine.render(target, desc);
  if (target === 'application/xml') return engine.render(target, desc);
  return null;
}

export function createFeatureModule(
  meta: FeatureModuleSpec['meta'],
  refs: Partial<
    Pick<
      FeatureModuleSpec,
      'operations' | 'events' | 'presentations' | 'presentationsTargets'
    >
  >
): FeatureModuleSpec {
  return { meta, ...refs };
}

export function registerFeature(
  registry: FeatureRegistry,
  feature: FeatureModuleSpec
) {
  registry.register(feature);
  return registry;
}
