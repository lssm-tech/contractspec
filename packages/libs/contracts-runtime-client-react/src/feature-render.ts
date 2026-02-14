import React from 'react';
import type {
  PresentationSpec,
  PresentationTarget,
} from '@contractspec/lib.contracts-spec/presentations';
import {
  type ComponentMap,
  createDefaultTransformEngine,
  type ReactRenderDescriptor,
  registerBasicValidation,
  registerDefaultReactRenderer,
  TransformEngine,
} from '@contractspec/lib.contracts-spec/presentations/transform-engine';
import {
  type FeatureModuleSpec,
  FeatureRegistry,
} from '@contractspec/lib.contracts-spec/features';
import type { BlockConfig } from '@blocknote/core';

export function createEngineWithDefaults(): TransformEngine {
  return registerBasicValidation(
    registerDefaultReactRenderer(createDefaultTransformEngine())
  );
}

export async function renderFeaturePresentation(
  engine: TransformEngine,
  target: PresentationTarget,
  desc: PresentationSpec,
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
