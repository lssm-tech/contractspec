import type { PolicyDecision } from '../types';
import type { PolicySpec, ConsentDefinition } from './spec';
import type { DecisionContext } from './engine';

export interface OPAClient {
  evaluate<T>(decisionPath: string, input: unknown): Promise<T>;
}

export interface OPAEvaluationResult {
  effect?: 'allow' | 'deny';
  reason?: string;
  fieldDecisions?: PolicyDecision['fieldDecisions'];
  requiredConsents?: string[];
}

export interface OPAAdapterOptions<Result = OPAEvaluationResult | null> {
  /**
   * Path fed to the OPA client (e.g., "sigil/authz/allow").
   */
  decisionPath: string;
  /**
   * Optional mapper when the OPA client returns a non-standard payload.
   */
  mapResult?: (value: unknown) => Result;
}

export class OPAPolicyAdapter<Result = OPAEvaluationResult | null> {
  constructor(
    private readonly client: OPAClient,
    private readonly options: OPAAdapterOptions<Result>
  ) {}

  async evaluate(
    context: DecisionContext,
    policies: PolicySpec[],
    engineDecision: PolicyDecision
  ): Promise<PolicyDecision> {
    const input = buildOPAInput(context, policies, engineDecision);
    const raw = await this.client.evaluate<unknown>(
      this.options.decisionPath,
      input
    );
    const resolved = this.options.mapResult
      ? this.options.mapResult(raw)
      : (raw as OPAEvaluationResult | null);

    if (!resolved) {
      return {
        ...engineDecision,
        evaluatedBy: engineDecision.evaluatedBy ?? 'engine',
      };
    }

    const opaResult = resolved as OPAEvaluationResult;
    const mergedRequiredConsents = mergeRequiredConsents(
      policies,
      engineDecision.requiredConsents ?? [],
      opaResult.requiredConsents ?? []
    );

    return {
      ...engineDecision,
      effect: opaResult.effect ?? engineDecision.effect,
      reason: opaResult.reason ?? engineDecision.reason,
      fieldDecisions: opaResult.fieldDecisions ?? engineDecision.fieldDecisions,
      requiredConsents: mergedRequiredConsents.length
        ? mergedRequiredConsents
        : undefined,
      evaluatedBy: 'opa',
    };
  }
}

export function buildOPAInput(
  context: DecisionContext,
  policies: PolicySpec[],
  engineDecision: PolicyDecision
) {
  return {
    context,
    decision: engineDecision,
    policies: policies.map((policy) => ({
      meta: policy.meta,
      rules: policy.rules,
      fieldPolicies: policy.fieldPolicies,
      pii: policy.pii,
      relationships: policy.relationships,
      consents: policy.consents,
      rateLimits: policy.rateLimits,
    })),
  };
}

function mergeRequiredConsents(
  policies: PolicySpec[],
  existing: ConsentDefinition[],
  incomingIds: string[]
): ConsentDefinition[] {
  if (incomingIds.length === 0) return existing;
  const existingIds = new Set(existing.map((consent) => consent.id));
  const merged = [...existing];

  for (const id of incomingIds) {
    if (existingIds.has(id)) continue;
    const resolved = resolveConsentAcrossPolicies(policies, id);
    if (resolved) {
      merged.push(resolved);
      existingIds.add(resolved.id);
    }
  }

  return merged;
}

function resolveConsentAcrossPolicies(
  policies: PolicySpec[],
  id: string
): ConsentDefinition | null {
  for (const policy of policies) {
    const match = policy.consents?.find((consent) => consent.id === id);
    if (match) return match;
  }

  return {
    id,
    scope: 'unspecified',
    purpose: 'unspecified',
    description: `Consent "${id}" returned by OPA`,
    required: true,
  };
}
