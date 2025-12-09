# PolicySpec & PolicyEngine

## Purpose

`PolicySpec` gives a declarative, typed home for access-control logic covering:
- **Who** can perform an action (ABAC/ReBAC style rules)
- **What** they can access (resources + optional field-level overrides)
- **When** special conditions apply (contextual expressions)
- **How** PII should be handled (consent/retention hints)

`PolicyEngine` evaluates one or more policies and returns an `allow`/`deny` decision, field-level outcomes, and PII metadata suitable for downstream enforcement (`SpecRegistry` → `ctx.decide`).

## Location

- Types & registry: `packages/libs/contracts/src/policy/spec.ts`
- Runtime evaluation: `packages/libs/contracts/src/policy/engine.ts`
- Tests: `packages/.../policy/engine.test.ts`

## `PolicySpec`

```ts
export interface PolicySpec {
  meta: PolicyMeta;          // ownership metadata + { name, version, scope? }
  rules: PolicyRule[];       // allow/deny rules for actions
  fieldPolicies?: FieldPolicyRule[];
  pii?: { fields: string[]; consentRequired?: boolean; retentionDays?: number };
  relationships?: RelationshipDefinition[];
  consents?: ConsentDefinition[];
  rateLimits?: RateLimitDefinition[];
  opa?: { package: string; decision?: string };
}
```

- `PolicyRule`
  - `effect`: `'allow' | 'deny'`
  - `actions`: e.g., `['read', 'write', 'delete']` (string namespace is flexible)
  - `subject`: `{ roles?: string[]; attributes?: { attr: matcher } }`
  - `resource`: `{ type: string; fields?: string[]; attributes?: {...} }`
  - `relationships`: `{ relation, objectId?, objectType? }[]` → ReBAC checks (use `objectId: '$resource'` to target the current resource)
  - `requiresConsent`: `['consent_id']` → references spec-level consent definitions
  - `flags`: feature flags that must be enabled (`DecisionContext.flags`)
  - `rateLimit`: string reference to `rateLimits` entry or inline object `{ rpm, key?, windowSeconds?, burst? }`
  - `escalate`: `'human_review' | null` to indicate manual approval
  - `conditions`: optional expression snippets evaluated against `{ subject, resource, context }`
- `FieldPolicyRule`
  - `field`: dot-path string (e.g., `contact.email`)
  - `actions`: subset of `['read', 'write']`
  - Same `subject` / `resource` / `conditions` shape
  - Useful for redacting specific fields, even when the global action is allowed
- `RelationshipDefinition`
  - Canonical tuples for relationship graph (`subjectType`, `relation`, `objectType`, `transitive?`)
- `ConsentDefinition`
  - `{ id, scope, purpose, lawfulBasis?, expiresInDays?, required? }`
- `RateLimitDefinition`
  - `{ id, rpm, key?, windowSeconds?, burst? }`
- `PolicyRef`
  - `{ name: string; version: number }` → attach to contract specs / workflows

## Registry

```ts
const registry = new PolicyRegistry();
registry.register(CorePolicySpec);
const spec = registry.get('core.default', 1);
```

Guarantees uniqueness per `(name, version)` and exposes helpers to resolve highest versions.

## Engine

```ts
const engine = new PolicyEngine(policyRegistry);

const decision = engine.decide({
  action: 'read',
  subject: { roles: ['admin'] },
  resource: { type: 'resident', fields: ['contact.email'] },
  policies: [{ name: 'core.default', version: 1 }],
});
/*
{
  effect: 'allow',
  reason: 'core.default',
  fieldDecisions: [{ field: 'contact.email', effect: 'allow' }],
  pii: { fields: ['contact.email'], consentRequired: true }
}
*/
```

- First matching **deny** wins; otherwise the first **allow** is returned.
- Field policies are aggregated across referenced policies:
  - Later denies override earlier allows for a given field.
  - Returned as `fieldDecisions` to simplify downstream masking.
- PII metadata is surfaced when defined to help adapt logging/telemetry.

### Expression Support

Conditions accept small JS snippets (e.g., `subject.attributes.orgId === context.orgId`). The engine runs them in a constrained scope (`subject`, `resource`, `context`) without access to global state.

### ReBAC & Relationships

- Provide relationship tuples via `PolicySpec.relationships` for documentation/validation.
- Reference them inside rules with `relationships: [{ relation: 'manager_of', objectType: 'resident', objectId: '$resource' }]`.
- The execution context must populate `subject.relationships` (`[{ relation, object, objectType }]`) for the engine to evaluate ReBAC guards.

### Consent & Rate Limits

- Declare reusable consent definitions under `consents`. Rules list the IDs they require; if a user session lacks the consent (`DecisionContext.consents`), the engine returns `effect: 'deny'` with `reason: 'consent_required'` and enumerates missing consents.
- Attach rate limits either inline or via `rateLimits` references. When a rule matches, the engine surfaces `{ rpm, key, windowSeconds?, burst? }` so callers can feed it to shared limiters.

### OPA Adapter

- `OPAPolicyAdapter` bridges engine decisions to Open Policy Agent (OPA). It forwards the evaluation context + policies to OPA and merges any override result (`effect`, `reason`, `fieldDecisions`, `requiredConsents`).
- Use when migrating to OPA policies or running defense-in-depth: call `engine.decide()`, then pass the preliminary decision to `adapter.evaluate(...)`. The adapter marks merged decisions with `evaluatedBy: 'opa'`.
- OPA inputs include meta, rules, relationships, rate limits, and consent catalogs to simplify policy authoring on the OPA side.

## Contract Integration

`ContractSpec.policy` now supports:

```ts
policy: {
  auth: 'anonymous' | 'user' | 'admin';
  ...
  policies?: PolicyRef[];                // policies evaluated before execution
  fieldPolicies?: {                      // field hints (read/write) per policy
    field: string;
    actions: ('read' | 'write')[];
    policy?: PolicyRef;
  }[];
}
```

Adapters can resolve refs through a shared `PolicyEngine` and populate `ctx.decide` so `SpecRegistry.execute` benefits from centralized enforcement.

## Authoring Guidelines

1. Prefer **allow-by-default** policies but explicitly deny sensitive flows (defense-in-depth).
2. Keep rule scopes narrow (per feature/operation) and compose multiple `PolicyRef`s when necessary.
3. Store PII field lists here to avoid duplication across logs/telemetry.
4. Use explicit rule reasons for auditability and better developer feedback.
5. Treat versioning seriously; bump `meta.version` whenever behavior changes.

## Future Enhancements

- Richer expression language (composable predicates, time-based conditions).
- Multi-tenant relationship graph services (store/resolve relationships at scale).
- Tooling that auto-generates docs/tests for policies referenced in specs.

