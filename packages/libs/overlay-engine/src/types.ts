import type {
  SignedOverlaySpec,
  OverlayScopeContext,
  OverlayTargetRef,
} from './spec';

export interface OverlayRenderableField {
  key: string;
  label?: string;
  visible?: boolean;
  required?: boolean;
  helpText?: string;
  defaultValue?: unknown;
  metadata?: Record<string, unknown>;
  order?: number;
}

export interface OverlayLayoutConfig {
  kind?: 'form' | 'list' | 'table' | 'grid';
  columns?: number;
  density?: 'comfortable' | 'compact';
  [key: string]: unknown;
}

export interface OverlayRenderable<
  TField extends OverlayRenderableField = OverlayRenderableField,
> {
  fields: TField[];
  layout?: OverlayLayoutConfig;
  metadata?: Record<string, unknown>;
}

export interface OverlayMatchContext
  extends OverlayScopeContext, OverlayTargetRef {}

export interface OverlayAuditEvent {
  overlay: Pick<SignedOverlaySpec, 'overlayId' | 'version'>;
  context: OverlayScopeContext;
  timestamp: string;
}


