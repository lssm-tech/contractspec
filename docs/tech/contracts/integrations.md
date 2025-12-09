# ContractSpec Integrations

This document describes the integration architecture that powers the
Pocket Family Office vertical and other ContractSpec-based apps. It
focuses on provider-agnostic contracts, secret management, health
checking, and runtime guards.

## Core Concepts

- **IntegrationSpec** – declarative description of a provider that lists
  supported ownership modes, capability mappings, configuration schema,
  secret schema, health check policy, and documentation metadata.
- **IntegrationConnection** – tenant/environment binding to a provider
  (`meta` + ownership mode + config + `secretRef`). Secrets are never
  embedded in specs or configs.
- **AppIntegrationSlot** – blueprint-level requirement that declares
  which integration categories/capabilities must be satisfied at runtime
  (e.g. `primaryLLM`, `primaryVectorDb`).
- **AppIntegrationBinding** – tenant-level slot → connection mapping.
- **ResolvedIntegration** – runtime view containing slot metadata,
  connection details, and the resolved IntegrationSpec.

## Registered Providers

The Pocket Family Office reference registers ten priority providers in
`packages/libs/contracts/src/integrations/providers`:

| Category      | Provider         | Key                         | Notes                                             |
| ------------- | ---------------- | --------------------------- | ------------------------------------------------- |
| payments      | Stripe           | `payments.stripe`           | Card + invoice flows, managed or BYOK credentials |
| email (out)   | Postmark         | `email.postmark`            | Transactional email delivery                      |
| email (in)    | Gmail API        | `email.gmail`               | Thread ingestion (OAuth BYOK or service account)  |
| calendar      | Google Calendar  | `calendar.google`           | Event scheduling via service account              |
| vector-db     | Qdrant           | `vectordb.qdrant`           | Embedding storage & search                        |
| storage       | Google Cloud     | `storage.gcs`               | S3-compatible object storage                      |
| ai-llm        | Mistral          | `ai-llm.mistral`            | Primary chat + embedding provider                 |
| ai-voice      | ElevenLabs       | `ai-voice.elevenlabs`       | Text-to-speech synthesis                          |
| sms           | Twilio SMS       | `sms.twilio`                | Urgent and fallback reminders                     |
| open-banking  | Powens           | `openbanking.powens`        | Read-only account, transaction, and balance sync  |

Each provider ships with:

- Strongly typed adapter interfaces (`payments.ts`, `llm.ts`, etc.).
- A concrete SDK-backed implementation under `providers/impls`.
- Unit tests validating adapter behaviour and health checks.

## Secret Management

All integrations rely on the `SecretProvider` abstraction defined in
`integrations/secrets`. Two providers ship with the contracts library and
are orchestrated by the `SecretProviderManager` composite:

- **EnvSecretProvider (`env-secret-provider.ts`)** – high-priority,
  read-only overrides backed by environment variables. Supports the
  `env://VARIABLE_NAME` scheme as well as overrides for other schemes via
  `?env=ALIAS` or derived uppercase keys (e.g.
  `gcp://.../stripe-secret-key` → `PROJECTS_DEMO_SECRETS_STRIPE_SECRET_KEY`).
- **GcpSecretManagerProvider (`gcp-secret-manager.ts`)** – production
  backend for versioned, auditable secrets stored in Google Cloud Secret
  Manager.

The manager attempts providers in priority order (environment first,
then GCP). Key points:

- `secretRef` uses a URI scheme (examples: `env://LOCAL_API_TOKEN`,
  `gcp://projects/demo/secrets/stripe-key/versions/latest`).
- `IntegrationCallGuard` fetches and parses secrets before executing a
  provider adapter.
- Providers never accept raw secrets in constructors; they expect a map
  of resolved string values from the guard.
- Local development can rely on `.env` files, while staging/production
  reference long-lived GCP secrets without changing the integration
  specs.

## Health Checks & Telemetry

- Each IntegrationSpec optionally declares `healthCheck.method` and
  timeouts.
- `IntegrationCallGuard` enforces connection status, wraps retries with
  exponential back-off, and emits telemetry events tagged with tenant,
  app, blueprint, config version, and slot id.
- Validation rules (`app-config/validation.ts`) surface issues at
  publish time (slot mismatch, unsupported ownership modes, missing
  capabilities, etc.).

## Runtime Usage

1. Blueprint defines slots (`primaryLLM`, `primaryVectorDb`, ...).
2. Tenant binds connections referencing the integration ids above.
3. `composeAppConfig` merges blueprint + tenant, resolving specs,
   connections, and knowledge bindings.
4. Workflow runner fetches providers via `IntegrationCallGuard` and
   executes operations with full guardrails.

See `packages/verticals/pocket-family-office` for
examples of how the blueprint, tenant config, and workflows pull these
pieces together.



