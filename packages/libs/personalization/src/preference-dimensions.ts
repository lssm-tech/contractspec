/**
 * Preference dimensions and bundle preference adapter.
 * Aligns with specs/contractspec_modules_bundle_spec_2026-03-08 (05_personalization_model.md)
 * and references/current_specs/01_preference_dimensions.md.
 *
 * Surface-runtime and other bundles may consume these types for 7-dimension personalization.
 */

/** 7-dimension preference model. Each dimension is independent. */
export interface PreferenceDimensions {
  guidance: 'none' | 'hints' | 'tooltips' | 'walkthrough' | 'wizard';
  density: 'minimal' | 'compact' | 'standard' | 'detailed' | 'dense';
  dataDepth: 'summary' | 'standard' | 'detailed' | 'exhaustive';
  control: 'restricted' | 'standard' | 'advanced' | 'full';
  media: 'text' | 'visual' | 'voice' | 'hybrid';
  pace: 'deliberate' | 'balanced' | 'rapid';
  narrative: 'top-down' | 'bottom-up' | 'adaptive';
}

/** Scope from which a preference value was resolved. Order: user → workspace-user → bundle → surface → entity → session. */
export type PreferenceScope =
  | 'user'
  | 'workspace-user'
  | 'bundle'
  | 'surface'
  | 'entity'
  | 'session';

/** Resolved preference profile with source attribution and constraint notes per dimension. */
export interface ResolvedPreferenceProfile {
  /** Canonical values after scope merge and constraint resolution. */
  canonical: PreferenceDimensions;
  /** Source scope per dimension (which layer provided the value). */
  sourceByDimension: Partial<
    Record<keyof PreferenceDimensions, PreferenceScope>
  >;
  /** Dimensions that were constrained (requested value not applied); value = reason. */
  constrained: Partial<Record<keyof PreferenceDimensions, string>>;
  /** Human-readable notes (e.g. constraint reasons, fallbacks). */
  notes: string[];
}

/** Minimal context for preference resolution. Bundle runtimes pass a broader context (e.g. BundleContext). */
export interface PreferenceResolutionContext {
  tenantId: string;
  workspaceId?: string;
  actorId?: string;
  preferences: PreferenceDimensions;
  capabilities: string[];
}

/** Adapter for resolving and persisting preferences in bundle runtimes. */
export interface BundlePreferenceAdapter {
  resolve(ctx: PreferenceResolutionContext): Promise<ResolvedPreferenceProfile>;
  savePreferencePatch(args: {
    actorId: string;
    workspaceId?: string;
    patch: Partial<PreferenceDimensions>;
    scope: 'user' | 'workspace-user' | 'surface';
  }): Promise<void>;
}
