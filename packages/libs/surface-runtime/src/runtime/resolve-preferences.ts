import type {
  BundleContext,
  PreferenceDimensions,
  PreferenceScope,
  ResolvedPreferenceProfile,
} from '../spec/types';

const DIMENSION_KEYS: (keyof PreferenceDimensions)[] = [
  'guidance',
  'density',
  'dataDepth',
  'control',
  'media',
  'pace',
  'narrative',
];

const SCOPE_ORDER: PreferenceScope[] = [
  'user',
  'workspace-user',
  'bundle',
  'surface',
  'entity',
  'session',
];

/**
 * Merges preference layers by scope order. Later scopes override earlier.
 * Stub: only ctx.preferences (session) available; full layers deferred to adapter.
 */
function mergeByScope(
  layers: Partial<Record<PreferenceScope, Partial<PreferenceDimensions>>>,
  ctx: BundleContext
): {
  canonical: PreferenceDimensions;
  sourceByDimension: Partial<
    Record<keyof PreferenceDimensions, PreferenceScope>
  >;
} {
  const merged: PreferenceDimensions = { ...ctx.preferences };
  const sourceByDimension: Partial<
    Record<keyof PreferenceDimensions, PreferenceScope>
  > = {};

  for (const scope of SCOPE_ORDER) {
    const layer = layers[scope];
    if (!layer) continue;
    for (const dim of DIMENSION_KEYS) {
      const val = layer[dim];
      if (val !== undefined) {
        (
          merged as Record<
            keyof PreferenceDimensions,
            PreferenceDimensions[keyof PreferenceDimensions]
          >
        )[dim] = val;
        sourceByDimension[dim] = scope;
      }
    }
  }

  for (const dim of DIMENSION_KEYS) {
    if (sourceByDimension[dim] === undefined) {
      sourceByDimension[dim] = 'session';
    }
  }

  return { canonical: merged, sourceByDimension };
}

/**
 * Stub constraint resolver. Returns empty; full impl (capability gates, device, performance) deferred.
 */
function resolveConstraints(
  _canonical: PreferenceDimensions,
  _ctx: BundleContext
): {
  constrained: Partial<Record<keyof PreferenceDimensions, string>>;
  notes: string[];
} {
  return { constrained: {}, notes: [] };
}

/**
 * Resolves preferences by scope order (user → workspace-user → bundle → surface → entity → session)
 * and applies constraint resolution stub.
 *
 * @param ctx - Bundle context with preferences
 * @returns Resolved preference profile with canonical values and source attribution
 */
export function resolvePreferenceProfile<C extends BundleContext>(
  ctx: C
): ResolvedPreferenceProfile {
  const layers: Partial<
    Record<PreferenceScope, Partial<PreferenceDimensions>>
  > = {
    session: ctx.preferences,
  };

  const { canonical, sourceByDimension } = mergeByScope(layers, ctx);
  const { constrained, notes } = resolveConstraints(canonical, ctx);

  return {
    canonical,
    sourceByDimension,
    constrained,
    notes,
  };
}
