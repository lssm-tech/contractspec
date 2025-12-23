import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../docs/registry';

export const tech_contracts_integrations_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.integrations',
    title: 'ContractSpec Integrations',
    summary:
      'Provider-agnostic integration contracts: specs, connections, secrets, health checks, and runtime guards.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/integrations',
    tags: ['tech', 'contracts', 'integrations'],
    body: `# ContractSpec Integrations

This document describes the integration architecture that powers ContractSpec-based apps. It focuses on provider-agnostic contracts, secret management, health checks, and runtime guards.

## Core Concepts

- **IntegrationSpec** – declarative description of a provider that lists supported ownership modes, capability mappings, configuration schema, secret schema, health check policy, and documentation metadata.
- **IntegrationConnection** – tenant/environment binding to a provider (\`meta\` + ownership mode + config + \`secretRef\`). Secrets are never embedded in specs or configs.
- **AppIntegrationSlot** – blueprint-level requirement that declares which integration categories/capabilities must be satisfied at runtime (e.g. \`primaryLLM\`, \`primaryVectorDb\`).
- **AppIntegrationBinding** – tenant-level slot → connection mapping.
- **ResolvedIntegration** – runtime view containing slot metadata, connection details, and the resolved IntegrationSpec.

## Registered Providers

The contracts library ships ten priority providers in \`packages/libs/contracts/src/integrations/providers\`:

| Category      | Provider         | Key                         | Notes                                             |
| ------------- | ---------------- | --------------------------- | ------------------------------------------------- |
| payments      | Stripe           | \`payments.stripe\`          | Card + invoice flows, managed or BYOK credentials |
| email (out)   | Postmark         | \`email.postmark\`           | Transactional email delivery                      |
| email (in)    | Gmail API        | \`email.gmail\`              | Thread ingestion (OAuth BYOK or service account)  |
| calendar      | Google Calendar  | \`calendar.google\`          | Event scheduling via service account              |
| vector-db     | Qdrant           | \`vectordb.qdrant\`          | Embedding storage & search                        |
| storage       | Google Cloud     | \`storage.gcs\`              | Object storage                                    |
| ai-llm        | Mistral          | \`ai-llm.mistral\`           | Primary chat + embedding provider                 |
| ai-voice      | ElevenLabs       | \`ai-voice.elevenlabs\`      | Text-to-speech synthesis                          |
| sms           | Twilio SMS       | \`sms.twilio\`               | Urgent and fallback reminders                     |
| open-banking  | Powens           | \`openbanking.powens\`       | Read-only account, transaction, and balance sync  |

Each provider ships with:

- Strongly typed adapter interfaces (\`payments.ts\`, \`llm.ts\`, etc.)
- A concrete SDK-backed implementation under \`providers/impls\`
- Unit tests validating adapter behaviour and health checks

### Canonical registry builder

To list all shipped specs at runtime, use:

- \`createDefaultIntegrationSpecRegistry()\` from \`@lssm/lib.contracts/integrations/providers/registry\`

## Secret Management

All integrations rely on the \`SecretProvider\` abstraction defined in \`integrations/secrets\`. Providers ship with the contracts library and are orchestrated by the \`SecretProviderManager\` composite:

- **EnvSecretProvider** (\`env-secret-provider.ts\`) – high-priority, read-only overrides backed by environment variables.
  - Supports the \`env://VARIABLE_NAME\` scheme
  - Supports overrides for other schemes via \`?env=ALIAS\` or derived uppercase keys
- **GcpSecretManagerProvider** (\`gcp-secret-manager.ts\`) – versioned secrets stored in Google Cloud Secret Manager.
  - Example: \`gcp://projects/demo/secrets/stripe-key/versions/latest\`
- **AwsSecretsManagerProvider** (\`aws-secret-manager.ts\`) – AWS Secrets Manager backend.
  - Example: \`aws://secretsmanager/eu-west-1/my-secret?version=AWSCURRENT\`
  - Region may be in the reference or provided via \`AWS_REGION\` / \`AWS_DEFAULT_REGION\`
- **ScalewaySecretManagerProvider** (\`scaleway-secret-manager.ts\`) – Scaleway Secret Manager backend.
  - Example (id): \`scw://secret-manager/fr-par/1234...-uuid?version=latest\`
  - Example (name, create+write): \`scw://secret-manager/fr-par/my-secret-name\`
  - Requires \`SCW_SECRET_KEY\` (token) and \`SCW_DEFAULT_PROJECT_ID\` when creating secrets by name

The manager attempts providers in priority order (environment first, then cloud providers). Key points:

- \`secretRef\` is a URI-like reference; raw secrets are never returned.
- \`IntegrationCallGuard\` fetches and parses secrets before executing a provider adapter.
- Local development can rely on \`.env\` files, while staging/production reference cloud secret stores.

## Health Checks & Telemetry

- Each IntegrationSpec optionally declares \`healthCheck.method\` and timeouts.
- \`IntegrationCallGuard\` enforces connection status, wraps retries with exponential back-off, and emits telemetry events tagged with tenant/app/slot metadata.
- Validation rules (\`app-config/validation.ts\`) surface issues at publish time (slot mismatch, unsupported ownership modes, missing capabilities, etc.).

## Studio persistence (ContractSpec Studio)

ContractSpec Studio persists tenant \`IntegrationConnection\` records in Postgres (Prisma model \`IntegrationConnection\` in \`@lssm/lib.database-contractspec-studio\`) and exposes a platform-admin management surface (see the Studio platform admin panel).
`,
  },
];
registerDocBlocks(tech_contracts_integrations_DocBlocks);
