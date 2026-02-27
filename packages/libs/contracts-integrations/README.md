# @contractspec/lib.contracts-integrations

Integration contract definitions, provider catalogs, and secret/runtime integration primitives.

Website: https://contractspec.io/

## Why this package exists

`@contractspec/lib.contracts-integrations` is the integration-focused slice split from `@contractspec/lib.contracts`.

It groups everything related to external systems (payments, messaging, health, vector stores, etc.) so projects can depend on integration contracts without pulling all runtime adapters.

## Package boundary (important)

Use this package for:

- Integration metadata contracts (`IntegrationSpec`, `IntegrationSpecRegistry`, `defineIntegration`).
- Provider catalogs and registration helpers (`createDefaultIntegrationSpecRegistry`).
- Integration connection operations (`CreateIntegrationConnection`, `TestIntegrationConnection`, ...).
- Connection/binding data contracts (`IntegrationConnection`, `AppIntegrationBinding`).
- Secret provider abstraction and implementations (AWS, GCP, Scaleway, env).
- Integration call reliability utilities (`IntegrationCallGuard`).

Use other packages for:

- Base operation/event/form/policy contract primitives -> `@contractspec/lib.contracts-spec`
- REST/GraphQL/MCP/React adapters -> runtime split packages

## Installation

```bash
npm install @contractspec/lib.contracts-integrations @contractspec/lib.contracts-spec
# or
bun add @contractspec/lib.contracts-integrations @contractspec/lib.contracts-spec
```

## What you get

Top-level exports include:

- Integration contracts and registries.
- Provider domain contracts.
- Integration connection operations and registration helpers.

Important subpath exports include:

- `@contractspec/lib.contracts-integrations/integrations/providers/registry`
- `@contractspec/lib.contracts-integrations/integrations/runtime`
- `@contractspec/lib.contracts-integrations/integrations/secrets/*`

## Quick start

### 1) Build integration spec and operation registries

```ts
import { OperationSpecRegistry } from "@contractspec/lib.contracts-spec";
import {
  createDefaultIntegrationSpecRegistry,
  registerIntegrationContracts,
} from "@contractspec/lib.contracts-integrations";

const integrationSpecs = createDefaultIntegrationSpecRegistry();
const integrationOps = registerIntegrationContracts(new OperationSpecRegistry());

console.log("integration specs", integrationSpecs.count());
console.log("integration ops", integrationOps.count());
```

### 2) Compose secret providers with priority

```ts
import { SecretProviderManager } from "@contractspec/lib.contracts-integrations/integrations/secrets/manager";
import { EnvSecretProvider } from "@contractspec/lib.contracts-integrations/integrations/secrets/env-secret-provider";
import { GcpSecretManagerProvider } from "@contractspec/lib.contracts-integrations/integrations/secrets/gcp-secret-manager";

const secrets = new SecretProviderManager()
  .register(new EnvSecretProvider(), { priority: 100 })
  .register(new GcpSecretManagerProvider({ projectId: "my-project" }), {
    priority: 10,
  });

console.log(secrets.canHandle("env://OPENAI_API_KEY"));
```

### 3) Guard provider calls with retries + telemetry hooks

```ts
import { IntegrationCallGuard } from "@contractspec/lib.contracts-integrations/integrations/runtime";
import type { ResolvedAppConfig } from "@contractspec/lib.contracts-spec/app-config/runtime";

declare const resolvedConfig: ResolvedAppConfig;

const guard = new IntegrationCallGuard(secrets, {
  maxAttempts: 3,
  backoffMs: 250,
});

const result = await guard.executeWithGuards(
  "payments-primary",
  "charge.create",
  { amount: 2000, currency: "usd" },
  resolvedConfig,
  async (connection, secretValues) => {
    return {
      provider: connection.meta.integrationKey,
      apiKeyPresent: Boolean(secretValues.apiKey || secretValues.secret),
    };
  }
);

console.log(result.success, result.metadata.attempts);
```

## Integration architecture notes

- `IntegrationSpec` describes provider capabilities and configuration/secret schema.
- `IntegrationConnection` models tenant-specific binding to a provider account.
- `AppIntegrationBinding` maps app slots/features to actual connections.
- `IntegrationCallGuard` centralizes resiliency (retry/backoff) and telemetry.

This separation lets you keep provider concerns explicit and testable.

## AI assistant guidance

When generating code:

- Use this package when the task mentions providers, credentials, integrations, or external platform bindings.
- Prefer modeling with `IntegrationSpec` first, then wire `IntegrationConnection` flows.
- Use `SecretProviderManager` instead of hardcoding one secret backend.

When reading code:

- Distinguish contract-level definitions (`spec.ts`, `connection.ts`) from runtime execution utilities (`runtime.ts`).
- Check subpath imports for secret provider implementations.

## Split migration from deprecated monolith

- `@contractspec/lib.contracts/integrations/*` -> `@contractspec/lib.contracts-integrations/integrations/*`
- Provider contracts and secret abstractions are now isolated from non-integration runtime surfaces
