import type { OwnerShipMeta } from '../ownership';
import type { VersionedSpecRef } from '../versioning';

/** Effect of a policy rule: allow or deny access. */
export type PolicyEffect = 'allow' | 'deny';

export interface RelationshipDefinition {
  subjectType: string;
  relation: string;
  objectType: string;
  description?: string;
  transitive?: boolean;
}

export interface RelationshipMatcher {
  relation: string;
  objectType?: string;
  objectId?: string;
}

export interface ConsentDefinition {
  id: string;
  scope: string;
  purpose: string;
  description?: string;
  lawfulBasis?:
    | 'consent'
    | 'contract'
    | 'legal_obligation'
    | 'legitimate_interest';
  expiresInDays?: number;
  required?: boolean;
}

export interface RateLimitDefinition {
  id: string;
  rpm: number;
  key?: string;
  windowSeconds?: number;
  burst?: number;
}

export interface PolicyOPAConfig {
  /** Fully-qualified package, e.g. "sigil.authz" */
  package: string;
  /** Optional rule within package (defaults to "allow") */
  decision?: string;
}

export interface PolicyMeta extends OwnerShipMeta {
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
  relationships?: RelationshipMatcher[];
  requiresConsent?: string[];
  flags?: string[];
  rateLimit?: string | RateLimitDefinition;
  escalate?: 'human_review' | null;
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
  relationships?: RelationshipDefinition[];
  consents?: ConsentDefinition[];
  rateLimits?: RateLimitDefinition[];
  opa?: PolicyOPAConfig;
}

/**
 * Reference to a policy spec.
 * Uses key and version to identify a specific policy.
 */
export type PolicyRef = VersionedSpecRef;
