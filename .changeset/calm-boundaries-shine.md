---
"@contractspec/lib.contracts-spec": major
"@contractspec/lib.contracts-integrations": patch
"@contractspec/lib.contracts-runtime-client-react": patch
---

Break the `contracts-spec` ⇄ `contracts-integrations` build cycle by restoring
`@contractspec/lib.contracts-spec` to spec-only surfaces.

Major changes in `@contractspec/lib.contracts-spec`:

- Remove runtime knowledge exports under `knowledge/ingestion*`,
  `knowledge/query*`, and `knowledge/runtime`.
- Remove runtime job exports under `jobs/handlers*`,
  `jobs/gcp-cloud-tasks`, `jobs/gcp-pubsub`, and `jobs/memory-queue`.
- Remove the direct dependency on `@contractspec/lib.contracts-integrations`.
- Make `app-config` the source of truth for `AppIntegrationBinding`,
  `IntegrationCategory`, and `IntegrationOwnershipMode`.
- Replace remaining integration and secret-provider dependencies with narrow
  local structural ports for feature install and workflow execution.

Patch changes:

- Update `@contractspec/lib.contracts-integrations` to re-export app-config
  binding and ownership/category types from `@contractspec/lib.contracts-spec`.
- Re-export the default transform-engine helpers from
  `@contractspec/lib.contracts-runtime-client-react/transform-engine`.

Migration notes:

- Import knowledge runtime helpers from `@contractspec/lib.knowledge/*`.
- Import job handlers and queue adapters from `@contractspec/lib.jobs/*`.
- Import app-config binding/category/mode types from
  `@contractspec/lib.contracts-spec/app-config` if you need the canonical
  contract source.
