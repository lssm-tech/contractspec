# @contractspec/lib.contracts-integrations

`@contractspec/lib.contracts-integrations` defines provider-agnostic contracts for integration specs, connection/runtime handling, secret resolution, health and telemetry, and capability-level provider interfaces such as LLM, embeddings, vector stores, email, and storage.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.contracts-integrations`

or

`npm install @contractspec/lib.contracts-integrations`

## What belongs here

This package owns the contract layer for external integrations:

- Integration spec model and registries.
- Connection, auth, transport, versioning, and BYOK contracts.
- Runtime guards and health/telemetry helpers.
- Secret provider abstraction and secret-provider manager.
- Capability-level provider interfaces such as `LLMProvider` and `VectorStoreProvider`.
- Provider delta contracts for cursor, lease, webhook, replay, dedupe, idempotency, and tombstone state.
- Shipped provider/domain spec registrations.
- Integration connection operations contracts.

Use this package when you need shared integration contracts. Do not use it as the SDK-backed implementation layer or as the integration persistence runtime.

## Core workflows

### Define and register an integration spec

```ts
import {
  defineIntegration,
  IntegrationSpecRegistry,
} from "@contractspec/lib.contracts-integrations";

const registry = new IntegrationSpecRegistry();

const spec = defineIntegration({
  meta: {
    key: "payments.example",
    version: 1,
    title: "Example Payments",
    owners: ["@platform.integrations"],
    tags: ["payments"],
    category: "payments",
  },
  supportedModes: ["managed", "byok"],
  capabilities: {
    provides: [{ key: "payments.process" }],
  },
  configSchema: {
    schema: { type: "object" },
  },
  secretSchema: {
    schema: { type: "object" },
  },
});

registry.register(spec);
```

### Consume runtime contracts with secrets and guards

```ts
import {
  IntegrationCallGuard,
} from "@contractspec/lib.contracts-integrations/integrations/runtime";
import {
  EnvSecretProvider,
  SecretProviderManager,
} from "@contractspec/lib.contracts-integrations/integrations/secrets";

const secretProvider = new SecretProviderManager({
  providers: [
    { provider: new EnvSecretProvider(), priority: 100 },
  ],
});

const guard = new IntegrationCallGuard(secretProvider);

const result = await guard.executeWithGuards(
  "primary-llm",
  "chat",
  {},
  resolvedAppConfig,
  async (connection, secrets) => {
    return llmAdapter.chat(connection, secrets, input);
  }
);
```

Typical flow:

1. Declare an `IntegrationSpec` that describes config, secrets, auth, transport, and version policy.
2. Register specs in an `IntegrationSpecRegistry` or use `createDefaultIntegrationSpecRegistry()`.
3. Bind tenant connections and secret references outside this package.
4. Resolve secrets and execute guarded runtime calls through `IntegrationCallGuard`.

### Model provider delta sync state

```ts
import type {
  ProviderDeltaSyncState,
} from "@contractspec/lib.contracts-integrations/integrations/providers/provider-delta";

const delta: ProviderDeltaSyncState = {
  lease: {
    holder: "knowledge-sync-worker",
    expiresAt: "2026-04-30T13:00:00.000Z",
    renewalWindowMs: 60_000,
  },
  cursor: {
    cursor: "gmail-history-123",
    watermarkVersion: "history-v1",
  },
  webhookChannel: {
    channelId: "google-channel-1",
    resourceId: "google-resource-1",
    expiresAt: "2026-04-30T14:00:00.000Z",
  },
  providerEventId: "provider-event-1",
  dedupeKey: "gmail:provider-event-1",
  idempotencyKey: "tenant:gmail:provider-event-1",
  replayCheckpoint: {
    checkpointId: "replay-1",
  },
};
```

Delta-aware providers should attach this state before runtime sync starts so callers can renew leases, resume from provider cursors/watermarks, preserve webhook expiry, dedupe provider events, run idempotently, replay from checkpoints, and skip tombstoned source records.

## API map

### Spec model and registries

- `IntegrationSpec`: provider-agnostic contract for a shipped or custom integration.
- `IntegrationSpecRegistry`: registry for integration specs with category-based lookup.
- `defineIntegration`: helper for authoring specs.
- `makeIntegrationSpecKey`: canonical key formatter for spec identity.
- `createDefaultIntegrationSpecRegistry`: registry builder for shipped provider specs.
- `filterByTransport`, `filterByAuthMethod`, `filterVersioned`, `filterByokRotatable`: spec filtering helpers.

### Connections, auth, transport, versioning, and BYOK

- `IntegrationConnection` and `ConnectionStatus`: tenant-bound connection shape and readiness state.
- `IntegrationAuthConfig`, `findAuthConfig`, `supportsAuthMethod`: auth contract and helpers.
- `IntegrationTransportConfig`, `findTransportConfig`, `supportsTransport`: transport contract and helpers.
- `IntegrationVersionPolicy`, `resolveApiVersion`, `getVersionInfo`, `isVersionDeprecated`, `getActiveVersions`: API-version policy helpers.
- `ByokKeyLifecycle` and BYOK metadata/result types: key validation and rotation contracts.
- `IntegrationCredentialManifest` and helpers from `./integrations/credentials`: managed/BYOK credential requirements, env aliases, validation strategy, rotation policy, and compatibility mapping from legacy schemas.

### Runtime, health, and telemetry

- `IntegrationCallGuard`: guarded execution with secret resolution, retries, and telemetry. Exported from `./integrations/runtime`.
- `IntegrationCallResult`, `IntegrationCallError`, `IntegrationTelemetryEvent`: runtime result/telemetry contracts.
- `IntegrationHealthService`: structured health checks and telemetry emission.
- `resolveIntegrationRequestContext`, `resolveAuthMethod`, `DefaultTransportResolver`, and related helpers: runtime resolution utilities.

### Secrets

- `SecretProvider`: provider-agnostic secret backend interface. Exported from `./integrations/secrets/provider`.
- `SecretProviderManager`: priority-ordered composite secret provider. Exported from `./integrations/secrets` or `./integrations/secrets/manager`.
- `SecretProviderError`: structured secret-provider error.
- `parseSecretUri`: parse `provider://path?...` references.
- `normalizeSecretPayload`: normalize text/binary/base64 payloads before writes.

### Operations and provider interfaces

- Integration connection operations: `CreateIntegrationConnection`, `UpdateIntegrationConnection`, `DeleteIntegrationConnection`, `ListIntegrationConnections`, `TestIntegrationConnection`.
- Frequently consumed provider contracts:
  - `LLMProvider`
  - `EmbeddingProvider`
  - `VectorStoreProvider`
  - `EmailInboundProvider`
  - `EmailOutboundProvider`
  - `GoogleDriveProvider`
  - `ObjectStorageProvider`
- Delta-aware provider contracts:
  - `ProviderDeltaSyncState`
  - `ProviderDeltaEnvelope`
  - `isProviderDeltaTombstoned`

## Public surface

The root barrel re-exports common integration contracts from:

- spec and registry helpers
- auth, binding, BYOK, connection, transport, and versioning
- health helpers
- operations contracts
- provider interfaces
- selected domain contracts such as `health`, `meeting-recorder`, and `openbanking`

Runtime and secret-management helpers live under `./integrations/runtime` and `./integrations/secrets*`.

The exhaustive public surface lives under `./integrations/*` in `package.json`.

Use the README as a guide to the main clusters. Use `package.json` as the authoritative export map for all subpaths, including the many provider and domain-specific entrypoints.

## Operational semantics and gotchas

- `IntegrationCallGuard` fails fast when a slot is missing or a connection is not ready.
- `IntegrationCallGuard` defaults to `3` attempts with `250 ms` backoff.
- Retry only happens when `shouldRetry()` returns true; the default implementation looks for a truthy `retryable` field on the error.
- `IntegrationSpec` carries config and secret schemas, but raw secrets live behind `secretRef` and `SecretProvider`.
- `SecretProviderManager` delegates in descending priority order and preserves registration order for ties.
- `resolveApiVersion()` uses connection override first, then policy default.
- `IntegrationHealthService.check()` returns structured results instead of throwing health failures upward.
- Registry filters only match specs that explicitly declare auth methods, transports, version policies, or BYOK support.
- Credential manifests describe required config and secret references per ownership mode; they do not carry raw credential values.
- `ProviderDeltaSyncState` is the shared contract for sync leases, provider cursors/watermarks, webhook channel expiry, replay checkpoints, dedupe/idempotency keys, provider event IDs, and tombstones.
- Gmail and Google Drive specs advertise `provider.delta.watch`; Drive also advertises `knowledge.ingestion.drive`.
- This package defines contracts and shipped spec registrations. SDK-backed implementations live elsewhere.

## When not to use this package

- Do not use it as a provider SDK implementation layer.
- Do not use it as the secret storage backend itself.
- Do not use it as the integration persistence database layer.
- Do not use it as the app-config slot/binding resolver.

## Related packages

- `@contractspec/lib.contracts-spec`: upstream spec system consumed by integration contracts and operations.
- `@contractspec/lib.schema`: schema types used by operation and config shapes.
- `@contractspec/integration.runtime`: runtime composition layer built on top of these contracts.
- `@contractspec/integration.providers-impls`: SDK-backed provider implementations for many of these interfaces.
- `@contractspec/lib.knowledge`: major consumer of embedding, vector-store, email, storage, and LLM provider interfaces.

## Local commands

- `bun run lint:check`
- `bun run typecheck`
- `bun test`
