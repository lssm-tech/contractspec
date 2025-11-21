import { useMemo, type DependencyList } from 'react';
import type { OverlayRenderable } from './types';
import type { OverlayApplyParams, OverlayRuntimeResult } from './runtime';
import { OverlayEngine } from './runtime';

export function useOverlay<T extends OverlayRenderable>(
  engine: OverlayEngine | undefined,
  params: OverlayApplyParams<T>,
  deps: DependencyList = [],
): OverlayRuntimeResult<T> {
  return useMemo(() => {
    if (!engine) {
      return {
        target: params.target,
        overlaysApplied: [],
      };
    }
    return engine.apply(params);
  }, [engine, params, ...deps]);
}

export function useOverlayFields<T extends OverlayRenderable>(
  engine: OverlayEngine | undefined,
  params: OverlayApplyParams<T>,
  deps: DependencyList = [],
): T['fields'] {
  const result = useOverlay(engine, params, deps);
  return result.target.fields;
}

