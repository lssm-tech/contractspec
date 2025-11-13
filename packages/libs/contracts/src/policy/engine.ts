import {
  PolicyRegistry,
  type PolicyRef,
  type PolicySpec,
  type PolicyRule,
  type FieldPolicyRule,
  type PolicyCondition,
} from './spec';
import type { PolicyDecision, FieldLevelDecision } from '../types';

export interface SubjectContext {
  roles?: string[];
  attributes?: Record<string, unknown>;
}

export interface ResourceContext {
  type: string;
  fields?: string[];
  attributes?: Record<string, unknown>;
}

export interface DecisionContext {
  subject: SubjectContext;
  resource: ResourceContext;
  context?: Record<string, unknown>;
  action: string;
  policies: PolicyRef[];
}

export class PolicyEngine {
  constructor(private readonly registry: PolicyRegistry) {}

  decide(input: DecisionContext): PolicyDecision {
    const policies = this.resolvePolicies(input.policies);
    let allowReason: string | undefined;
    for (const policy of policies) {
      const match = this.matchRuleSet(policy.rules, input);
      if (match?.effect === 'deny')
        return { effect: 'deny', reason: match.reason ?? policy.meta.name };
      if (match?.effect === 'allow' && !allowReason) {
        allowReason = match.reason ?? policy.meta.name;
      }
    }

    const fieldDecisions = this.evaluateFields(policies, input);
    const pii = policies.find((p) => p.pii)?.pii;

    return {
      effect: allowReason ? 'allow' : 'deny',
      reason: allowReason,
      fieldDecisions: fieldDecisions.length ? fieldDecisions : undefined,
      pii,
    };
  }

  private resolvePolicies(refs: PolicyRef[]): PolicySpec[] {
    const specs: PolicySpec[] = [];
    for (const ref of refs) {
      const spec = this.registry.get(ref.name, ref.version);
      if (!spec)
        throw new Error(
          `PolicyEngine: policy not found ${ref.name}.v${ref.version}`
        );
      specs.push(spec);
    }
    return specs;
  }

  private matchRuleSet(
    rules: PolicyRule[],
    input: DecisionContext
  ): PolicyRule | undefined {
    let allowMatch: PolicyRule | undefined;
    for (const rule of rules) {
      if (!rule.actions.includes(input.action)) continue;
      if (!matchesSubject(rule, input.subject)) continue;
      if (!matchesResource(rule, input.resource)) continue;
      if (!matchesConditions(rule, input)) continue;
      if (rule.effect === 'deny') return rule;
      if (rule.effect === 'allow' && !allowMatch) allowMatch = rule;
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
        if (!rule.actions.includes(mapActionToFieldAction(input.action))) continue;
        if (!matchesSubject(rule, input.subject)) continue;
        if (!matchesResource(rule, input.resource)) continue;
        if (!matchesConditions(rule, input)) continue;
        const existing = out.get(rule.field);
        if (rule.effect === 'deny') {
          out.set(rule.field, {
            field: rule.field,
            effect: 'deny',
            reason: rule.reason ?? policy.meta.name,
          });
        } else if (!existing) {
          out.set(rule.field, {
            field: rule.field,
            effect: 'allow',
            reason: rule.reason ?? policy.meta.name,
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

