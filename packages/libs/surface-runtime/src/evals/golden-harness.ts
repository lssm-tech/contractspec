/**
 * Golden-context harness for resolver evals.
 * Runs resolver with golden contexts and snapshots ResolvedSurfacePlan.
 */

import type { ModuleBundleSpec } from '../spec/types';
import type { BundleContext } from '../spec/types';
import type { ResolvedSurfacePlan } from '../runtime/resolve-bundle';
import { resolveBundle } from '../runtime/resolve-bundle';
import { buildContext } from '../runtime/build-context';
import type { GoldenContext } from './golden-context';

/** Snapshot-friendly plan (deterministic fields only). */
export interface SnapshotPlan {
  bundleKey: string;
  surfaceId: string;
  layoutId: string;
  layoutRoot: unknown;
  nodeCount: number;
  actionCount: number;
  commandCount: number;
  bindingKeys: string[];
  reasons: string[];
  fallback: boolean;
}

/**
 * Redacts non-deterministic fields before snapshotting.
 */
export function toSnapshotPlan(plan: ResolvedSurfacePlan): SnapshotPlan {
  return {
    bundleKey: plan.bundleKey,
    surfaceId: plan.surfaceId,
    layoutId: plan.layoutId,
    layoutRoot: plan.layoutRoot,
    nodeCount: plan.nodes.length,
    actionCount: plan.actions.length,
    commandCount: plan.commands.length,
    bindingKeys: Object.keys(plan.bindings).sort(),
    reasons: [...plan.audit.reasons].sort(),
    fallback: plan.audit.reasons.some((r) => r.startsWith('fallback=')),
  };
}

/**
 * Runs resolver with golden context and returns snapshot plan.
 */
export async function runGoldenResolve<C extends BundleContext>(
  spec: ModuleBundleSpec<C>,
  ctx: GoldenContext
): Promise<SnapshotPlan> {
  const fullCtx = buildContext({
    route: ctx.route,
    params: ctx.params ?? {},
    device: ctx.device ?? 'desktop',
    preferences: ctx.preferences,
    capabilities: ctx.capabilities ?? [],
  });
  const plan = await resolveBundle(spec, fullCtx as C);
  return toSnapshotPlan(plan);
}
