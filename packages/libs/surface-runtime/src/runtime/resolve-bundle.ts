import { traceAsync } from '@contractspec/lib.observability/tracing';
import { Logger } from '@contractspec/lib.observability';
import type {
  ActionSpec,
  AppliedOverlayMeta,
  BundleContext,
  BundleScope,
  CommandSpec,
  DataRecipeSpec,
  LayoutBlueprintSpec,
  ModuleBundleSpec,
  RegionNode,
  ResolvedAdaptation,
  SurfaceSpec,
  SurfaceNode,
  SurfacePatchProposal,
  UiPolicyDecision,
  BundleAuditEmitter,
} from '../spec/types';
import { resolutionDurationMs, surfaceFallbackCounter } from '../telemetry';
import { resolvePreferenceProfile } from './resolve-preferences';
import { applySurfacePatch } from './apply-surface-patch';
import type { BundleOverrideStore } from './override-store';
import { buildOverrideTargetKey } from './override-store';
import type { SurfacePatchOp } from '../spec/types';

const logger = new Logger('@contractspec/lib.surface-runtime');

function getOpTarget(op: SurfacePatchOp): string | null {
  switch (op.op) {
    case 'hide-field':
    case 'reveal-field':
      return `field:${op.fieldId}`;
    case 'remove-node':
    case 'replace-node':
    case 'move-node':
      return `node:${op.nodeId}`;
    case 'insert-node':
      return op.slotId ? `slot:${op.slotId}` : null;
    default:
      return null;
  }
}

export interface OverlayConflict {
  targetKey: string;
  scopeA: BundleScope;
  scopeB: BundleScope;
  overlayIdA: string;
  overlayIdB: string;
}

export interface ResolvedSurfacePlan {
  bundleKey: string;
  surfaceId: string;
  layoutId: string;
  /** Resolved layout root for rendering. */
  layoutRoot: RegionNode;
  nodes: SurfaceNode[];
  actions: ActionSpec[];
  commands: CommandSpec[];
  bindings: Record<string, unknown>;
  adaptation: ResolvedAdaptation;
  overlays: AppliedOverlayMeta[];
  overlayConflicts?: OverlayConflict[];
  ai: {
    plannerId?: string;
    proposals?: SurfacePatchProposal[];
  };
  audit: {
    resolutionId: string;
    createdAt: string;
    reasons: string[];
  };
  /** Locale for i18n (from BundleContext). Used by UI components. */
  locale?: string;
}

/**
 * Matches ctx.route against a path pattern (e.g. "/operate/pm/issues/:issueId").
 * Supports :param segments.
 */
function matchRoute(pathPattern: string, route: string): boolean {
  if (pathPattern === route) return true;
  const patternParts = pathPattern.split('/');
  const routeParts = route.split('/');
  if (patternParts.length !== routeParts.length) return false;
  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const r = routeParts[i];
    if (p?.startsWith(':')) continue;
    if (p !== r) return false;
  }
  return true;
}

function selectSurface<C extends BundleContext>(
  spec: ModuleBundleSpec<C>,
  ctx: C
): { surface: SurfaceSpec<C>; routeId: string; fallback?: string } {
  const route =
    spec.routes.find((r) => matchRoute(r.path, ctx.route)) ?? spec.routes[0];
  if (!route) {
    throw new Error('No routes declared in bundle spec.');
  }
  const fallbackRoute = !spec.routes.find((r) => matchRoute(r.path, ctx.route));

  let surface = spec.surfaces[route.defaultSurface];
  let fallback: string | undefined;

  if (!surface && route.candidateSurfaces?.length) {
    for (const sid of route.candidateSurfaces) {
      surface = spec.surfaces[sid];
      if (surface) {
        fallback = `surface=${sid}`;
        break;
      }
    }
  }
  if (!surface) {
    const overview = Object.values(spec.surfaces).find(
      (s) => s.kind === 'overview'
    );
    if (overview) {
      surface = overview;
      fallback = 'surface=overview';
    }
  }
  if (!surface) {
    throw new Error(`Default surface "${route.defaultSurface}" was not found.`);
  }
  return {
    surface,
    routeId: route.routeId,
    fallback: fallback ?? (fallbackRoute ? 'route' : undefined),
  };
}

function selectLayout<C extends BundleContext>(
  surface: SurfaceSpec<C>,
  ctx: C,
  spec?: ModuleBundleSpec<C>
): { layout: LayoutBlueprintSpec<C>; layoutFallback?: boolean } {
  let preferredLayoutId: string | undefined;

  if (ctx.activeViewId && ctx.entity?.type && spec?.entities?.viewKinds) {
    const viewKind = spec.entities.viewKinds[ctx.activeViewId];
    const entityType = spec.entities.entityTypes[ctx.entity.type];
    if (
      viewKind?.defaultLayoutId &&
      entityType?.supportedViews?.includes(ctx.activeViewId)
    ) {
      preferredLayoutId = viewKind.defaultLayoutId;
    }
  }

  const matching = surface.layouts.filter(
    (candidate) => candidate.when?.(ctx) ?? true
  );

  let layout: LayoutBlueprintSpec<C> | undefined;
  if (preferredLayoutId) {
    layout =
      matching.find((l) => l.layoutId === preferredLayoutId) ??
      surface.layouts.find((l) => l.layoutId === preferredLayoutId) ??
      matching[matching.length - 1] ??
      surface.layouts[0];
  } else {
    layout = matching[matching.length - 1] ?? surface.layouts[0];
  }

  if (!layout) {
    throw new Error(`Surface "${surface.surfaceId}" has no layouts.`);
  }
  const layoutFallback = matching.length === 0 && surface.layouts.length > 0;
  return { layout, layoutFallback: layoutFallback || undefined };
}

function resolveDataRecipes<C extends BundleContext>(
  recipes: DataRecipeSpec<C>[],
  ctx: C
): Record<string, unknown> {
  const bindings: Record<string, unknown> = {};
  for (const r of recipes) {
    if (r.when?.(ctx) ?? true) {
      const key = r.hydrateInto ?? r.recipeId;
      bindings[key] = { recipeId: r.recipeId, source: r.source, _stub: true };
    }
  }
  return bindings;
}

/** Policy effect for patch proposal evaluation. */
export type PatchPolicyEffect = 'allow' | 'deny' | 'require-approval';

/** Policy hooks for PDP integration. Stub PDP returns allow by default. */
export interface PolicyHooks<C extends BundleContext> {
  /** Evaluate node visibility. Return allow/deny/redact. Stub: allow all. */
  evaluateNode?: (node: SurfaceNode, ctx: C) => UiPolicyDecision;
  /** Redact binding value. Stub: pass-through. */
  redactBinding?: (key: string, ctx: C) => unknown;
  /** Evaluate patch proposal before approval. Stub: allow. */
  evaluatePatchProposal?: (
    ops: import('../spec/types').SurfacePatchOp[],
    ctx: C
  ) => PatchPolicyEffect;
}

/** Legacy allowNode: true if evaluateNode returns allow. */
function allowFromDecision(decision: UiPolicyDecision | undefined): boolean {
  if (!decision) return true;
  return (
    decision.effect === 'allow' || decision.effect === 'allow-session-only'
  );
}

function generateResolutionId(): string {
  return `res_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Overlay merge order: base → system → workspace → user → session → AI proposals. */
const OVERLAY_SCOPE_ORDER: BundleScope[] = [
  'system',
  'workspace',
  'team',
  'user',
  'session',
];

export interface OverlayMergeOptions {
  overrideStore: BundleOverrideStore;
  /** Scopes to fetch (default: system, workspace, user, session). */
  scopes?: BundleScope[];
}

export interface ResolveBundleOptions<C extends BundleContext> {
  /** Optional policy hooks for allow/deny/redact. Stub PDP returns allow. */
  policy?: PolicyHooks<C>;
  /** Optional audit emitter. Emits surface.resolved on resolution. */
  audit?: BundleAuditEmitter;
  /** Optional overlay merge. Applies stored overlays in precedence order. */
  overlayMerge?: OverlayMergeOptions;
}

/**
 * Builds adaptation metadata from resolved preference profile.
 * Stub: maps dimensions to layout/render hints; full impl deferred to 03_personalization.
 */
function buildAdaptation<C extends BundleContext>(ctx: C): ResolvedAdaptation {
  const profile = resolvePreferenceProfile(ctx);
  const notes = [...profile.notes];
  const constrainedEntries = Object.entries(profile.constrained);
  if (constrainedEntries.length > 0) {
    notes.push(
      `constrained: ${constrainedEntries.map(([k, v]) => `${k}=${v}`).join(', ')}`
    );
  }
  return {
    appliedDimensions: profile.canonical,
    notes,
  };
}

/**
 * Resolves a bundle spec and context into a concrete surface plan.
 * Fallback chain: surface → simpler layout → overview → error surface.
 *
 * @param spec - The module bundle spec
 * @param ctx - The bundle context (route, preferences, etc.)
 * @param options - Optional policy hooks
 * @returns Resolved surface plan with layout, nodes, bindings, and audit
 */
export async function resolveBundle<C extends BundleContext>(
  spec: ModuleBundleSpec<C>,
  ctx: C,
  options?: ResolveBundleOptions<C>
): Promise<ResolvedSurfacePlan> {
  return traceAsync(
    'surface.resolveBundle',
    async (span) => {
      const start = performance.now();
      try {
        const plan = await resolveBundleInternal(spec, ctx, options);
        const durationMs = performance.now() - start;
        resolutionDurationMs.record(durationMs, {
          bundleKey: spec.meta.key,
          surfaceId: plan.surfaceId,
          fallback:
            plan.surfaceId === '_error'
              ? 'error'
              : plan.audit.reasons.some((r) => r.startsWith('fallback='))
                ? 'yes'
                : 'no',
        });
        span.setAttribute('bundle.key', spec.meta.key);
        span.setAttribute('surface.id', plan.surfaceId);
        span.setAttribute('resolution.duration_ms', durationMs);
        logger.info('bundle.surface.resolved', {
          bundleKey: spec.meta.key,
          surfaceId: plan.surfaceId,
          layoutId: plan.layoutId,
          resolutionMs: Math.round(durationMs),
          fallback: plan.audit.reasons.some((r) => r.startsWith('fallback=')),
          nodeCount: plan.nodes.length,
        });
        return plan;
      } catch (err) {
        const durationMs = performance.now() - start;
        resolutionDurationMs.record(durationMs, {
          bundleKey: spec.meta.key,
          surfaceId: '_error',
          fallback: 'error',
        });
        return createErrorPlan(spec, ctx, err);
      }
    },
    '@contractspec/lib.surface-runtime'
  );
}

async function resolveBundleInternal<C extends BundleContext>(
  spec: ModuleBundleSpec<C>,
  ctx: C,
  options?: ResolveBundleOptions<C>
): Promise<ResolvedSurfacePlan> {
  const {
    surface,
    routeId,
    fallback: surfaceFallback,
  } = selectSurface(spec, ctx);
  const { layout, layoutFallback } = selectLayout(surface, ctx, spec);

  let bindings = resolveDataRecipes(surface.data, ctx);
  const redactBinding = options?.policy?.redactBinding;
  if (redactBinding) {
    const redacted: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(bindings)) {
      redacted[k] = redactBinding(k, ctx) ?? v;
    }
    bindings = redacted;
  }

  let nodes: SurfaceNode[] = [];
  const evaluateNode = options?.policy?.evaluateNode;
  if (evaluateNode) {
    nodes = nodes.filter((n) => allowFromDecision(evaluateNode(n, ctx)));
  }

  const reasons: string[] = [
    `surface=${surface.surfaceId}`,
    `layout=${layout.layoutId}`,
    `density=${ctx.preferences.density}`,
    `narrative=${ctx.preferences.narrative}`,
  ];
  if (surfaceFallback) {
    reasons.push(`fallback=${surfaceFallback}`);
    surfaceFallbackCounter.add(1, {
      bundleKey: spec.meta.key,
      type: 'surface',
    });
  }
  if (layoutFallback) {
    reasons.push('fallback=layout');
    surfaceFallbackCounter.add(1, { bundleKey: spec.meta.key, type: 'layout' });
  }

  const resolutionId = generateResolutionId();
  const plan: ResolvedSurfacePlan = {
    bundleKey: spec.meta.key,
    surfaceId: surface.surfaceId,
    layoutId: layout.layoutId,
    layoutRoot: layout.root,
    nodes,
    actions: surface.actions ?? [],
    commands: surface.commands ?? [],
    bindings,
    adaptation: buildAdaptation(ctx),
    overlays: [],
    ai: {
      plannerId: spec.ai?.plannerId,
    },
    audit: {
      resolutionId,
      createdAt: new Date().toISOString(),
      reasons,
    },
    locale: ctx.locale,
  };

  options?.audit?.emit({
    eventId: `evt_${resolutionId}`,
    at: new Date().toISOString(),
    actorId: ctx.actorId,
    source: 'system',
    bundleKey: spec.meta.key,
    surfaceId: surface.surfaceId,
    eventType: 'surface.resolved',
    payload: {
      resolutionId,
      layoutId: layout.layoutId,
      reasons,
      nodeCount: nodes.length,
    },
  });

  let finalPlan = plan;

  if (options?.overlayMerge) {
    const { overrideStore, scopes = OVERLAY_SCOPE_ORDER } =
      options.overlayMerge;
    const targetKey = buildOverrideTargetKey(
      spec.meta.key,
      surface.surfaceId,
      routeId
    );
    const appliedOverlays: AppliedOverlayMeta[] = [];
    const conflicts: OverlayConflict[] = [];
    const seenTargets = new Map<string, { scope: BundleScope; overlayId: string }>();
    const conflictKeys = new Set<string>();

    for (const scope of scopes) {
      if (scope === 'session') continue;
      const stored = await overrideStore.list(scope, targetKey);
      for (const ov of stored) {
        if (ov.patch.length === 0) continue;
        for (const op of ov.patch) {
          const opTarget = getOpTarget(op);
          if (opTarget) {
            const prev = seenTargets.get(opTarget);
            if (prev && prev.scope !== scope) {
              const ck = [opTarget, prev.scope, scope].sort().join(':');
              if (!conflictKeys.has(ck)) {
                conflictKeys.add(ck);
                conflicts.push({
                  targetKey: opTarget,
                  scopeA: prev.scope,
                  scopeB: scope,
                  overlayIdA: prev.overlayId,
                  overlayIdB: ov.overrideId,
                });
              }
            }
            seenTargets.set(opTarget, { scope, overlayId: ov.overrideId });
          }
        }
        try {
          const { plan: next } = applySurfacePatch(finalPlan, ov.patch);
          finalPlan = next;
          appliedOverlays.push({
            overlayId: ov.overrideId,
            scope,
            appliedOps: ov.patch.length,
          });
        } catch (err) {
          logger.warn('bundle.overlay.apply.failed', {
            overlayId: ov.overrideId,
            scope,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    finalPlan = {
      ...finalPlan,
      overlays: appliedOverlays,
      overlayConflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  }

  return finalPlan;
}

function createErrorPlan<C extends BundleContext>(
  spec: ModuleBundleSpec<C>,
  ctx: C,
  err: unknown
): ResolvedSurfacePlan {
  const message = err instanceof Error ? err.message : String(err);
  const errorLayoutRoot: RegionNode = {
    type: 'stack',
    direction: 'vertical',
    children: [{ type: 'slot', slotId: 'primary' }],
  };
  return {
    bundleKey: spec.meta.key,
    surfaceId: '_error',
    layoutId: '_error',
    layoutRoot: errorLayoutRoot,
    nodes: [],
    actions: [],
    commands: [],
    bindings: {},
    adaptation: {
      appliedDimensions: ctx.preferences,
      notes: [`resolution failed: ${message}`],
    },
    overlays: [],
    ai: {},
    audit: {
      resolutionId: generateResolutionId(),
      createdAt: new Date().toISOString(),
      reasons: ['fallback=error', `error=${message}`],
    },
    locale: ctx.locale,
  };
}
