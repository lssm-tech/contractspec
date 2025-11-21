import { applyOverlayModifications, type ApplyOverlayOptions } from './merger';
import { OverlayRegistry, type OverlayLookup } from './registry';
import type { SignedOverlaySpec } from './spec';
import type { OverlayRenderable, OverlayAuditEvent } from './types';

export interface OverlayEngineOptions {
  registry: OverlayRegistry;
  audit?: (event: OverlayAuditEvent) => void;
}

export interface OverlayApplyParams<
  T extends OverlayRenderable,
> extends OverlayLookup {
  target: T;
  overlays?: SignedOverlaySpec[];
  strict?: ApplyOverlayOptions['strict'];
}

export interface OverlayRuntimeResult<T extends OverlayRenderable> {
  target: T;
  overlaysApplied: SignedOverlaySpec[];
}

export class OverlayEngine {
  private readonly registry: OverlayRegistry;
  private readonly audit?: (event: OverlayAuditEvent) => void;

  constructor(options: OverlayEngineOptions) {
    this.registry = options.registry;
    this.audit = options.audit;
  }

  apply<T extends OverlayRenderable>(
    params: OverlayApplyParams<T>
  ): OverlayRuntimeResult<T> {
    const overlays =
      params.overlays ??
      this.registry.forContext({
        capability: params.capability,
        workflow: params.workflow,
        dataView: params.dataView,
        presentation: params.presentation,
        operation: params.operation,
        tenantId: params.tenantId,
        role: params.role,
        userId: params.userId,
        device: params.device,
        tags: params.tags,
      });

    const merged = applyOverlayModifications(params.target, overlays, {
      strict: params.strict,
    });

    const context = extractContext(params);
    overlays.forEach((overlay) => {
      this.audit?.({
        overlay: {
          overlayId: overlay.overlayId,
          version: overlay.version,
        },
        context,
        timestamp: new Date().toISOString(),
      });
    });

    return {
      target: merged,
      overlaysApplied: overlays,
    };
  }
}

function extractContext(params: OverlayLookup): OverlayAuditEvent['context'] {
  return {
    tenantId: params.tenantId,
    role: params.role,
    userId: params.userId,
    device: params.device,
    tags: params.tags,
  };
}

