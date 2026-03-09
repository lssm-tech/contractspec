/**
 * Overlay alignment: maps surface runtime types to lib.overlay-engine.
 * Aligns with 09_extension_and_override_model.md.
 *
 * OverlayTargetRef: capability, workflow, dataView, presentation, operation.
 * OverlayRenderableField: key, label, visible, required, helpText, defaultValue, order.
 * OverlayScopeContext: tenantId, role, userId, device, tags.
 */

import { applyOverlayModifications } from '@contractspec/lib.overlay-engine/merger';
import type {
  OverlayTargetRef,
  OverlayScopeContext,
  OverlayAppliesTo,
  SignedOverlaySpec,
} from '@contractspec/lib.overlay-engine/spec';
import type { OverlayRenderableField } from '@contractspec/lib.overlay-engine/types';
import type { BundleContext, ResolvedField, BundleScope } from '../spec/types';

/** Surface-specific target ref extensions for overlay matching. */
export interface SurfaceOverlayTargetRef extends OverlayTargetRef {
  /** Bundle key (e.g. "workspace.pm"). */
  bundleKey?: string;
  /** Surface ID (e.g. "issue-detail"). */
  surfaceId?: string;
  /** Route ID (e.g. "issue-detail"). */
  routeId?: string;
  /** Entity type when targeting entity surfaces (e.g. "pm.issue"). */
  entityType?: string;
}

/** Build OverlayScopeContext from BundleContext. */
export function toOverlayScopeContext(ctx: BundleContext): OverlayScopeContext {
  return {
    tenantId: ctx.tenantId,
    userId: ctx.actorId,
    device: ctx.device,
    tags: ctx.featureFlags,
  };
}

/** Build OverlayTargetRef from BundleContext and surface target. */
export function toOverlayTargetRef(
  _ctx: BundleContext,
  target: {
    bundleKey?: string;
    surfaceId?: string;
    routeId?: string;
    entityType?: string;
  }
): SurfaceOverlayTargetRef {
  return {
    presentation: target.surfaceId ?? target.routeId,
    bundleKey: target.bundleKey,
    surfaceId: target.surfaceId,
    routeId: target.routeId,
    entityType: target.entityType,
  };
}

/** Build OverlayAppliesTo for surface overlays. */
export function toOverlayAppliesTo(
  ctx: BundleContext,
  target: SurfaceOverlayTargetRef,
  scope: BundleScope
): OverlayAppliesTo {
  const scopeCtx = toOverlayScopeContext(ctx);
  return {
    ...scopeCtx,
    ...target,
    ...(scope === 'user' && ctx.actorId ? { userId: ctx.actorId } : {}),
    ...(scope === 'workspace' && ctx.workspaceId
      ? { tags: [...(scopeCtx.tags ?? []), `workspace:${ctx.workspaceId}`] }
      : {}),
  };
}

/** Map ResolvedField to OverlayRenderableField. */
export function toOverlayRenderableField(
  field: ResolvedField
): OverlayRenderableField {
  return {
    key: field.fieldId,
    label: field.title,
    visible: field.visible,
    required: field.required,
    order: 0,
  };
}

/** Map OverlayRenderableField back to partial ResolvedField (for merge result). */
export function fromOverlayRenderableField(
  overlay: OverlayRenderableField
): Partial<ResolvedField> {
  return {
    fieldId: overlay.key,
    title: overlay.label ?? overlay.key,
    visible: overlay.visible ?? true,
    required: overlay.required ?? false,
  };
}

/** Convert ResolvedEntitySchema fields to OverlayRenderable for overlay-engine merger. */
export function toOverlayRenderable(fields: ResolvedField[]): {
  fields: OverlayRenderableField[];
} {
  return {
    fields: fields.map(toOverlayRenderableField),
  };
}

/** Apply overlay-engine merger result back to ResolvedField[]. */
export function mergeOverlayResultIntoFields(
  fields: ResolvedField[],
  merged: { fields: OverlayRenderableField[] }
): ResolvedField[] {
  const fieldMap = new Map(fields.map((f) => [f.fieldId, { ...f }]));
  const result: ResolvedField[] = [];
  for (const overlay of merged.fields) {
    const existing = fieldMap.get(overlay.key);
    if (existing) {
      result.push({
        ...existing,
        title: overlay.label ?? existing.title,
        visible: overlay.visible ?? existing.visible,
        required: overlay.required ?? existing.required,
      });
    }
  }
  return result;
}

/** Apply overlay-engine merger to entity fields. Returns merged ResolvedField[]. */
export function applyEntityFieldOverlays(
  fields: ResolvedField[],
  overlays: SignedOverlaySpec[],
  options?: { strict?: boolean }
): ResolvedField[] {
  if (!overlays.length) return fields;
  const target = toOverlayRenderable(fields);
  const merged = applyOverlayModifications(target, overlays, options);
  return mergeOverlayResultIntoFields(fields, merged);
}
