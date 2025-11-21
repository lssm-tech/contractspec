import type {
  OverlayInput,
  OverlayAppliesTo,
  OverlayScopeContext,
  OverlayTargetRef,
  SignedOverlaySpec,
} from './spec';
import type { OverlayValidator } from './validator';
import { defaultOverlayValidator } from './validator';

export interface OverlayRegistryOptions {
  validator?: OverlayValidator;
  allowUnsigned?: boolean;
}

export interface OverlayLookup extends OverlayScopeContext, OverlayTargetRef {}

interface StoredOverlay {
  overlay: SignedOverlaySpec;
  specificity: number;
  registeredAt: number;
}

const TARGET_KEYS: (keyof OverlayTargetRef)[] = [
  'capability',
  'workflow',
  'dataView',
  'presentation',
  'operation',
];

const SCOPE_WEIGHTS: Record<keyof OverlayScopeContext, number> = {
  tenantId: 8,
  role: 4,
  userId: 16,
  device: 2,
  tags: 1,
};

export class OverlayRegistry {
  private readonly overlays = new Map<string, StoredOverlay>();

  constructor(private readonly options: OverlayRegistryOptions = {}) {}

  register(overlay: OverlayInput, options?: { skipValidation?: boolean }): SignedOverlaySpec {
    if (!options?.skipValidation) {
      const validator = this.options.validator ?? defaultOverlayValidator;
      const result = validator(overlay as SignedOverlaySpec);
      if (!result.valid) {
        const reason = result.issues.map((issue) => `${issue.code}: ${issue.message}`).join('; ');
        throw new Error(`Overlay "${overlay.overlayId}" failed validation: ${reason}`);
      }
    }

    const normalized = this.ensureSigned(overlay);
    const key = this.getKey(normalized.overlayId, normalized.version);
    const stored: StoredOverlay = {
      overlay: normalized,
      specificity: computeSpecificity(normalized.appliesTo),
      registeredAt: Date.now(),
    };
    this.overlays.set(key, stored);
    return normalized;
  }

  unregister(overlayId: string, version?: string) {
    if (version) {
      this.overlays.delete(this.getKey(overlayId, version));
      return;
    }

    for (const key of Array.from(this.overlays.keys())) {
      if (key.startsWith(`${overlayId}@`)) {
        this.overlays.delete(key);
      }
    }
  }

  list(): SignedOverlaySpec[] {
    return Array.from(this.overlays.values()).map((entry) => entry.overlay);
  }

  get(overlayId: string, version: string): SignedOverlaySpec | undefined {
    return this.overlays.get(this.getKey(overlayId, version))?.overlay;
  }

  forContext(query: OverlayLookup): SignedOverlaySpec[] {
    return Array.from(this.overlays.values())
      .filter((entry) => matches(entry.overlay.appliesTo, query))
      .sort((a, b) => {
        if (a.specificity !== b.specificity) {
          return a.specificity - b.specificity;
        }
        return a.registeredAt - b.registeredAt;
      })
      .map((entry) => entry.overlay);
  }

  clear() {
    this.overlays.clear();
  }

  size(): number {
    return this.overlays.size;
  }

  private ensureSigned(input: OverlayInput): SignedOverlaySpec {
    if (isSignedOverlay(input)) {
      if (!input.signature?.signature && !this.options.allowUnsigned) {
        throw new Error(`Overlay "${input.overlayId}" is missing a signature.`);
      }
      return input;
    }

    if (!this.options.allowUnsigned) {
      throw new Error(`Overlay "${input.overlayId}" must be signed before registration.`);
    }

    return input as SignedOverlaySpec;
  }

  private getKey(overlayId: string, version: string) {
    return `${overlayId}@${version}`;
  }
}

function isSignedOverlay(spec: OverlayInput): spec is SignedOverlaySpec {
  return Boolean((spec as SignedOverlaySpec).signature);
}

function computeSpecificity(appliesTo: OverlayAppliesTo): number {
  let score = 0;
  (Object.keys(SCOPE_WEIGHTS) as (keyof OverlayScopeContext)[]).forEach((key) => {
    const hasValue =
      key === 'tags'
        ? Array.isArray(appliesTo.tags) && appliesTo.tags.length > 0
        : Boolean(appliesTo[key]);
    if (hasValue) {
      score += SCOPE_WEIGHTS[key];
    }
  });
  return score;
}

function matches(appliesTo: OverlayAppliesTo, ctx: OverlayLookup): boolean {
  for (const key of TARGET_KEYS) {
    const expected = appliesTo[key];
    if (expected && expected !== ctx[key]) {
      return false;
    }
  }

  if (appliesTo.tenantId && appliesTo.tenantId !== ctx.tenantId) {
    return false;
  }
  if (appliesTo.role && appliesTo.role !== ctx.role) {
    return false;
  }
  if (appliesTo.userId && appliesTo.userId !== ctx.userId) {
    return false;
  }
  if (appliesTo.device && appliesTo.device !== ctx.device) {
    return false;
  }
  if (appliesTo.tags?.length) {
    if (!ctx.tags?.length) {
      return false;
    }
    const ctxTags = new Set(ctx.tags);
    const satisfies = appliesTo.tags.every((tag) => ctxTags.has(tag));
    if (!satisfies) {
      return false;
    }
  }

  return true;
}

