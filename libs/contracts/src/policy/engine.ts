import {
  type PolicyRef,
  type PolicySpec,
  type PolicyRule,
  type FieldPolicyRule,
  type PolicyCondition,
  type ConsentDefinition,
  type RateLimitDefinition,
  type RelationshipMatcher,
} from './spec';
import { PolicyRegistry } from './registry';
import type { PolicyDecision, FieldLevelDecision } from '../types';

export interface SubjectRelationship {
  relation: string;
  object: string;
  objectType?: string;
}

export interface SubjectContext {
  roles?: string[];
  attributes?: Record<string, unknown>;
  relationships?: SubjectRelationship[];
}

export interface ResourceContext {
  type: string;
  id?: string;
  fields?: string[];
  attributes?: Record<string, unknown>;
}

export interface DecisionContext {
  subject: SubjectContext;
  resource: ResourceContext;
  context?: Record<string, unknown>;
  action: string;
  policies: PolicyRef[];
  consents?: string[];
  flags?: string[];
}

interface RuleEvaluation {
  rule: PolicyRule;
  missingConsents: ConsentDefinition[];
  rateLimit?: PolicyDecision['rateLimit'];
}

export class PolicyEngine {
  constructor(private readonly registry: PolicyRegistry) {}

  decide(input: DecisionContext): PolicyDecision {
    const policies = this.resolvePolicies(input.policies);
    let allowReason: string | undefined;
    let appliedRateLimit: PolicyDecision['rateLimit'];
    let escalate: 'human_review' | null | undefined;

    for (const policy of policies) {
      const match = this.matchRuleSet(policy, input);
      if (!match) continue;
      if (match.rule.effect === 'deny') {
        return {
          effect: 'deny',
          reason: match.rule.reason ?? policy.meta.key,
          requiredConsents: match.missingConsents.length
            ? match.missingConsents
            : undefined,
          evaluatedBy: 'engine',
        };
      }
      if (match.rule.effect === 'allow') {
        if (match.missingConsents.length) {
          return {
            effect: 'deny',
            reason: 'consent_required',
            requiredConsents: match.missingConsents,
            evaluatedBy: 'engine',
          };
        }
        if (!allowReason) {
          allowReason = match.rule.reason ?? policy.meta.key;
        }
        if (!appliedRateLimit && match.rateLimit) {
          appliedRateLimit = match.rateLimit;
        }
        if (!escalate && match.rule.escalate) {
          escalate = match.rule.escalate;
        }
      }
    }

    const fieldDecisions = this.evaluateFields(policies, input);
    const pii = policies.find((p) => p.pii)?.pii;
    const escalateValue =
      typeof escalate === 'undefined' ? undefined : escalate;

    return {
      effect: allowReason ? 'allow' : 'deny',
      reason: allowReason,
      rateLimit: appliedRateLimit,
      escalate: escalateValue,
      fieldDecisions: fieldDecisions.length ? fieldDecisions : undefined,
      pii,
      evaluatedBy: 'engine',
    };
  }

  private resolvePolicies(refs: PolicyRef[]): PolicySpec[] {
    const specs: PolicySpec[] = [];
    for (const ref of refs) {
      const spec = this.registry.get(ref.key, ref.version);
      if (!spec)
        throw new Error(
          `PolicyEngine: policy not found ${ref.key}.v${ref.version}`
        );
      specs.push(spec);
    }
    return specs;
  }

  private matchRuleSet(
    policy: PolicySpec,
    input: DecisionContext
  ): RuleEvaluation | undefined {
    let allowMatch: RuleEvaluation | undefined;
    for (const rule of policy.rules) {
      if (!rule.actions.includes(input.action)) continue;
      if (!matchesSubject(rule, input.subject)) continue;
      if (!matchesResource(rule, input.resource)) continue;
      if (!matchesFlags(rule, input)) continue;
      if (!matchesRelationships(rule.relationships, input)) continue;
      if (!matchesConditions(rule, input)) continue;
      const missingConsents = collectMissingConsents(rule, policy, input);
      const rateLimit = resolveRateLimit(rule, policy, input);
      const evaluation: RuleEvaluation = {
        rule,
        missingConsents,
        rateLimit,
      };
      if (rule.effect === 'deny') return evaluation;
      if (rule.effect === 'allow' && !allowMatch) allowMatch = evaluation;
    }
    return allowMatch;
  }

  private evaluateFields(
    policies: PolicySpec[],
    input: DecisionContext
  ): FieldLevelDecision[] {
    const out = new Map<string, FieldLevelDecision>();
    for (const policy of policies) {
      if (!policy.fieldPolicies) continue;
      for (const rule of policy.fieldPolicies) {
        if (!rule.actions.includes(mapActionToFieldAction(input.action)))
          continue;
        if (!matchesSubject(rule, input.subject)) continue;
        if (!matchesResource(rule, input.resource)) continue;
        if (!matchesConditions(rule, input)) continue;
        const existing = out.get(rule.field);
        if (rule.effect === 'deny') {
          out.set(rule.field, {
            field: rule.field,
            effect: 'deny',
            reason: rule.reason ?? policy.meta.key,
          });
        } else if (!existing) {
          out.set(rule.field, {
            field: rule.field,
            effect: 'allow',
            reason: rule.reason ?? policy.meta.key,
          });
        }
      }
    }
    return [...out.values()];
  }
}

function mapActionToFieldAction(action: string): 'read' | 'write' {
  if (action.startsWith('write')) return 'write';
  return 'read';
}

function matchesSubject(
  rule: { subject?: PolicyRule['subject'] | FieldPolicyRule['subject'] },
  subject: SubjectContext
): boolean {
  const matcher = rule.subject;
  if (!matcher) return true;
  if (matcher.roles?.length) {
    const roles = subject.roles ?? [];
    const hasRole = matcher.roles.some((role) => roles.includes(role));
    if (!hasRole) return false;
  }
  if (matcher.attributes) {
    const attributes = subject.attributes ?? {};
    if (!matchAttributes(matcher.attributes, attributes)) return false;
  }
  return true;
}

function matchesResource(
  rule: { resource?: PolicyRule['resource'] | FieldPolicyRule['resource'] },
  resource: ResourceContext
): boolean {
  const matcher = rule.resource;
  if (!matcher) return true;
  if (matcher.type && matcher.type !== resource.type) return false;
  if (matcher.fields?.length) {
    const targetFields = resource.fields ?? [];
    if (!matcher.fields.some((field) => targetFields.includes(field)))
      return false;
  }
  if (matcher.attributes) {
    const attributes = resource.attributes ?? {};
    if (!matchAttributes(matcher.attributes, attributes)) return false;
  }
  return true;
}

function matchesFlags(rule: PolicyRule, input: DecisionContext): boolean {
  if (!rule.flags?.length) return true;
  const available = new Set<string>();
  if (input.flags) {
    for (const flag of input.flags) available.add(flag);
  }
  const attributeFlags = input.subject.attributes?.featureFlags;
  if (Array.isArray(attributeFlags)) {
    for (const flag of attributeFlags) available.add(flag);
  }
  return rule.flags.every((flag) => available.has(flag));
}

function matchesRelationships(
  matchers: RelationshipMatcher[] | undefined,
  input: DecisionContext
): boolean {
  if (!matchers || matchers.length === 0) return true;
  const relationships = input.subject.relationships ?? [];
  const resourceId = getResourceId(input.resource);
  const resourceType = input.resource.type;

  return matchers.every((matcher) =>
    relationships.some((relation) => {
      if (relation.relation !== matcher.relation) return false;

      const typeMatches =
        !matcher.objectType ||
        relation.objectType === matcher.objectType ||
        matcher.objectType === resourceType;

      if (!typeMatches) return false;

      if (!matcher.objectId) return true;

      if (matcher.objectId === '$resource') {
        if (resourceId) {
          return relation.object === resourceId;
        }
        return (
          relation.object === resourceType ||
          relation.objectType === resourceType
        );
      }

      return relation.object === matcher.objectId;
    })
  );
}

function matchesConditions(
  rule: { conditions?: PolicyCondition[] },
  input: DecisionContext
): boolean {
  if (!rule.conditions || rule.conditions.length === 0) return true;
  return rule.conditions.every((condition) =>
    evaluateCondition(condition.expression, input)
  );
}

function matchAttributes(
  matcher: Record<string, import('./spec').AttributeMatcher>,
  actual: Record<string, unknown>
): boolean {
  for (const [key, attrMatcher] of Object.entries(matcher)) {
    const value = actual[key];
    if (attrMatcher.exists && typeof value === 'undefined') return false;
    if (typeof attrMatcher.equals !== 'undefined') {
      if (value !== attrMatcher.equals) return false;
    }
    if (attrMatcher.oneOf && !attrMatcher.oneOf.includes(value)) return false;
  }
  return true;
}

function collectMissingConsents(
  rule: PolicyRule,
  policy: PolicySpec,
  input: DecisionContext
): ConsentDefinition[] {
  if (!rule.requiresConsent?.length) return [];
  const granted = new Set(input.consents ?? []);
  const missingIds = rule.requiresConsent.filter((id) => !granted.has(id));
  if (missingIds.length === 0) return [];
  return resolveConsentDefinitions(policy, missingIds);
}

function resolveConsentDefinitions(
  policy: PolicySpec,
  ids: string[]
): ConsentDefinition[] {
  const catalog = policy.consents ?? [];
  return ids.map((id) => {
    const found = catalog.find((consent) => consent.id === id);
    return (
      found ?? {
        id,
        scope: 'unspecified',
        purpose: 'unspecified',
        description: `Consent "${id}" required by ${policy.meta.key}`,
        required: true,
      }
    );
  });
}

function resolveRateLimit(
  rule: PolicyRule,
  policy: PolicySpec,
  input: DecisionContext
): PolicyDecision['rateLimit'] | undefined {
  if (!rule.rateLimit) return undefined;
  const definition: RateLimitDefinition | undefined =
    typeof rule.rateLimit === 'string'
      ? (policy.rateLimits ?? []).find((item) => item.id === rule.rateLimit)
      : rule.rateLimit;

  if (!definition) {
    throw new Error(
      `PolicyEngine: rate limit "${String(
        rule.rateLimit
      )}" not declared in ${policy.meta.key}`
    );
  }

  return {
    rpm: definition.rpm,
    key: definition.key ?? input.resource.type,
    windowSeconds: definition.windowSeconds,
    burst: definition.burst,
  };
}

function evaluateCondition(
  expression: string,
  input: DecisionContext
): boolean {
  const trimmed = expression.trim();
  if (!trimmed) return true;

  const context = {
    subject: input.subject,
    resource: input.resource,
    context: input.context ?? {},
  };

  try {
    // very small whitelist of expressions
    // Supports subject/resource/context dot paths, comparisons, and logical operators.
    const fn = new Function(
      'subject',
      'resource',
      'context',
      `return (${transformExpression(trimmed)});`
    );
    const result = fn(context.subject, context.resource, context.context);
    return Boolean(result);
  } catch (_error) {
    return false;
  }
}

function transformExpression(expression: string): string {
  return expression.replace(/&&/g, '&&').replace(/\|\|/g, '||');
}

function getResourceId(resource: ResourceContext): string | undefined {
  if (resource.id) return resource.id;
  const candidate = resource.attributes?.id;
  if (typeof candidate === 'string') return candidate;
  if (typeof candidate === 'number') return String(candidate);
  return undefined;
}
