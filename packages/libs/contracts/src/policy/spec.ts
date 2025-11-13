import type { OwnerShipMeta } from '../ownership';

export type PolicyEffect = 'allow' | 'deny';

export interface PolicyMeta extends OwnerShipMeta {
  /** Fully-qualified policy name (e.g., "sigil.core.default"). */
  name: string;
  /** Version of the policy; bump on breaking changes. */
  version: number;
  /** Optional scope hint used for discovery. */
  scope?: 'global' | 'feature' | 'operation';
}

export interface AttributeMatcher {
  equals?: unknown;
  oneOf?: unknown[];
  exists?: boolean;
}

export interface SubjectMatcher {
  roles?: string[];
  attributes?: Record<string, AttributeMatcher>;
}

export interface ResourceMatcher {
  type: string;
  fields?: string[];
  attributes?: Record<string, AttributeMatcher>;
}

export interface PolicyCondition {
  /** Simple expression evaluated against { subject, resource, context }. */
  expression: string;
}

export interface PolicyRule {
  effect: PolicyEffect;
  actions: string[];
  subject?: SubjectMatcher;
  resource?: ResourceMatcher;
  conditions?: PolicyCondition[];
  reason?: string;
}

export interface FieldPolicyRule {
  effect: PolicyEffect;
  field: string;
  actions: ('read' | 'write')[];
  subject?: SubjectMatcher;
  resource?: ResourceMatcher;
  conditions?: PolicyCondition[];
  reason?: string;
}

export interface PIIPolicy {
  fields: string[];
  consentRequired?: boolean;
  retentionDays?: number;
}

export interface PolicySpec {
  meta: PolicyMeta;
  rules: PolicyRule[];
  fieldPolicies?: FieldPolicyRule[];
  pii?: PIIPolicy;
}

export interface PolicyRef {
  name: string;
  version: number;
}

const policyKey = (name: string, version: number) => `${name}.v${version}`;

export class PolicyRegistry {
  private readonly items = new Map<string, PolicySpec>();

  register(spec: PolicySpec): this {
    const key = policyKey(spec.meta.name, spec.meta.version);
    if (this.items.has(key))
      throw new Error(`Duplicate policy ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): PolicySpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): PolicySpec | undefined {
    if (version != null) return this.items.get(policyKey(name, version));
    let candidate: PolicySpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.name !== name) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
        candidate = spec;
      }
    }
    return candidate;
  }
}

export function makePolicyKey(ref: PolicyRef) {
  return policyKey(ref.name, ref.version);
}

