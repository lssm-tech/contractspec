# AI Agent Guide — `@contractspec/lib.contracts-integrations`

Scope: `packages/libs/contracts-integrations/*`

Mission: keep `@contractspec/lib.contracts-integrations` a stable contract layer for external integrations. This package owns provider-agnostic spec types, runtime-facing connection and secret contracts, health/telemetry helpers, provider interfaces, and shipped integration spec registrations.

## Public surface

Treat these clusters as compatibility surface:

- spec model and registries
- auth, transport, versioning, and BYOK
- runtime and health
- secrets
- provider interfaces
- provider delta contracts
- shipped provider and domain subpaths
- integration connection operations

Stable APIs readers are likely to depend on:

- `IntegrationSpec`, `IntegrationSpecRegistry`, `defineIntegration`, `makeIntegrationSpecKey`
- `IntegrationConnection`, `ConnectionStatus`, runtime result and telemetry types
- `IntegrationAuthConfig`, `supportsAuthMethod`
- `IntegrationTransportConfig`, `supportsTransport`
- `IntegrationVersionPolicy`, `resolveApiVersion`
- `ByokKeyLifecycle`
- `IntegrationCallGuard`, `IntegrationHealthService`
- `SecretProvider`, `SecretProviderManager`, `SecretProviderError`
- `parseSecretUri`, `normalizeSecretPayload`
- `createDefaultIntegrationSpecRegistry` and registry filter helpers
- `ProviderDeltaSyncState`, `ProviderDeltaEnvelope`, `isProviderDeltaTombstoned`
- `CreateIntegrationConnection`, `UpdateIntegrationConnection`, `DeleteIntegrationConnection`, `ListIntegrationConnections`, `TestIntegrationConnection`
- key provider interfaces such as `LLMProvider`, `EmbeddingProvider`, `VectorStoreProvider`, `EmailInboundProvider`, `EmailOutboundProvider`, `GoogleDriveProvider`, and `ObjectStorageProvider`

## Change boundaries

- Exported interfaces, helper functions, operations, and subpaths are compatibility surface.
- Keep `exports` and `publishConfig.exports` aligned.
- Prefer grouped documentation and grouped reasoning over exhaustive file inventories.
- Do not document behaviors that are not implemented in `src/`.
- Adding new subpaths must not break existing imports or silently change root-barrel expectations.

## Package invariants

- `IntegrationSpec` shape is a long-lived compatibility surface.
- Auth and transport discriminated unions must stay backward-compatible.
- `IntegrationConnection`, runtime context, and runtime result types are consumed by downstream runtime packages.
- `SecretProvider` contract and URI parsing behavior must stay stable.
- `IntegrationCallGuard` retry, telemetry, and connection-readiness semantics must remain predictable.
- Version negotiation semantics stay `connection override -> policy default`.
- Shipped provider registration helpers must not silently drop or rename existing providers.
- Delta-aware providers must model lease holder/expiry, renewal windows, cursor/watermark versions, webhook channel/resource expiry, provider event IDs, dedupe keys, idempotency keys, replay checkpoints, and tombstones before runtime sync starts.
- This package defines contracts and shipped spec registrations, not SDK-backed implementations.

## Editing guidance by area

### Spec model and registries

- Preserve registry behavior and helper ergonomics around `defineIntegration()` and `IntegrationSpecRegistry`.
- Treat changes to spec fields as high-blast-radius work.
- If default shipped registrations change, update docs and call out downstream impact.

### Auth, transport, versioning, and BYOK

- Maintain discriminated-union ergonomics and helper semantics.
- Keep defaults and resolution order explicit.
- Do not narrow allowed values without checking existing provider specs and consumers.

### Runtime and health

- Protect secret fetch, retry, telemetry, and status checks with regression tests when behavior changes.
- Keep failure modes structured and explainable.
- Preserve the distinction between runtime contract helpers here and runtime implementations in `@contractspec/integration.runtime`.

### Secrets

- Preserve provider priority ordering and error composition semantics in `SecretProviderManager`.
- Keep `SecretProvider` backend-agnostic.
- Be careful with URI parsing, content encoding, and provider-selection behavior.

### Provider interfaces

- Treat provider interface changes as contract work with broad downstream impact.
- Keep capability-level interfaces provider-agnostic.
- Avoid leaking implementation-specific SDK details into shared interfaces.
- Keep provider delta state generic enough for Gmail, Drive, messaging, storage, and future providers.
- Tombstone helpers must fail closed for deleted records so ingestion layers can skip indexing before runtime sync continues.

### Domain contracts and operations

- For domain contracts such as `health`, `openbanking`, and `meeting-recorder`, keep models, capability surfaces, and telemetry consistent.
- Keep operation keys and IO contracts deliberate and stable.
- If contract keys or schema shapes change, update docs and downstream consumers together.

## Docs maintenance rules

- Keep `README.md` grouped, practical, and focused on key entry contracts.
- Keep `AGENTS.md` focused on compatibility hotspots and package-specific risks.
- If a new public cluster is added, document it explicitly.
- Do not turn README guidance into an exhaustive 121-subpath listing.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- `bun test`
- Confirm `README.md` examples still match exported imports and current semantics.
- Confirm `package.json` exports still match the documented public surface.
