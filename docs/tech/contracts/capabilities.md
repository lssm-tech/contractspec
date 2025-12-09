# CapabilitySpec Overview

## Purpose

Capability specs provide a canonical, versioned contract for what a module offers (`provides`) and what it depends on (`requires`). They enable safe composition across features, automated validation during `installFeature`, and consistent documentation for shared surfaces (APIs, events, workflows, UI, resources).

## Schema

Defined in `@lssm/lib.contracts/src/capabilities.ts`.

```ts
export interface CapabilitySpec {
  meta: CapabilityMeta;              // ownership metadata + { key, version, kind }
  provides?: CapabilitySurfaceRef[]; // what concrete surfaces this capability exposes
  requires?: CapabilityRequirement[];// capabilities that must already exist
}
```

- **CapabilityMeta**
  - `key`: stable slug (e.g., `payments.stripe`)
  - `version`: bump on breaking changes
  - `kind`: `'api' | 'event' | 'data' | 'ui' | 'integration'`
  - ownership fields (`title`, `description`, `domain`, `owners`, `tags`, `stability`)
- **CapabilitySurfaceRef**
  - `surface`: `'operation' | 'event' | 'workflow' | 'presentation' | 'resource'`
  - `name` / `version`: points to the declared contract (operation name, event name, etc.)
  - optional `description`
- **CapabilityRequirement**
  - `key`: capability slug to satisfy
  - `version?`: pin to an exact version when required (defaults to highest registered)
  - `kind?`: extra guard if the same key hosts multiple kinds
  - `optional?`: skip strict enforcement (informational requirement)
  - `reason?`: why this dependency exists (docs + tooling)

## Registry

`CapabilityRegistry` provides:

- `register(spec)`: register a capability (`key + version` must be unique)
- `get(key, version?)`: retrieve the exact or highest version
- `list()`: inspect all capabilities
- `satisfies(requirement, additional?)`: check if a requirement is met (includes locally provided capabilities passed via `additional`)

## Feature Integration

`FeatureModuleSpec` now accepts:

```ts
capabilities?: {
  provides?: CapabilityRef[];    // capabilities this feature exposes
  requires?: CapabilityRequirement[]; // capabilities the feature needs
};
```

During `installFeature`:

1. `provides` entries must exist in the `CapabilityRegistry`.
2. `requires` entries must be satisfied either by:
   - the same feature’s `provides`,
   - or existing capabilities already registered in the global registry.

Errors are thrown when dependencies cannot be satisfied, preventing unsafe module composition.

## Authoring Guidelines

1. **Register capability specs** in a shared package (e.g., `packages/.../capabilities`) before referencing them in features.
2. **Version consciously**: bump capability versions when the provided surfaces or contract semantics change.
3. **Document dependencies** via `reason` strings to help operators understand why a capability is required.
4. **Prefer stable keys** that map to business/technical domains (`billing.invoices`, `payments.stripe`, `cms.assets`).
5. When introducing new capability kinds, update the `CapabilityKind` union and accompanying docs/tests.

## Tooling (Roadmap)

- CLI validation warns when feature specs reference missing capabilities.
- Future build steps will leverage capability data to scaffold adapters and enforce policy in generated code.
- Capability metadata will surface in docs/LLM guides to describe module marketplaces and installation flows.

