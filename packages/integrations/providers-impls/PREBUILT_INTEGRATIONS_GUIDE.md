# Leveraging `@contractspec/integration.providers-impls`

This guide shows how to use the prebuilt provider implementations in `packages/integrations/providers-impls` with ContractSpec integration specs and connections.

## What this package gives you

- SDK-backed adapters for ContractSpec integration interfaces.
- A single `IntegrationProviderFactory` that maps `IntegrationSpec.meta.key` to concrete providers.
- Strongly typed provider interfaces re-exported from `@contractspec/lib.contracts-spec`.

## Supported provider keys

The factory in `src/impls/provider-factory.ts` supports the following integration keys:

| Category           | Integration key              | Factory method                    |
| ------------------ | ---------------------------- | --------------------------------- |
| Payments           | `payments.stripe`            | `createPaymentsProvider`          |
| Email (outbound)   | `email.postmark`             | `createEmailOutboundProvider`     |
| SMS                | `sms.twilio`                 | `createSmsProvider`               |
| Vector DB          | `vectordb.qdrant`            | `createVectorStoreProvider`       |
| Vector DB          | `vectordb.supabase`          | `createVectorStoreProvider`       |
| Database           | `database.supabase`          | `createDatabaseProvider`          |
| Analytics          | `analytics.posthog`          | `createAnalyticsProvider`         |
| Storage            | `storage.gcs`                | `createObjectStorageProvider`     |
| LLM                | `ai-llm.mistral`             | `createLlmProvider`               |
| Embeddings         | `ai-llm.mistral`             | `createEmbeddingProvider`         |
| Voice              | `ai-voice.elevenlabs`        | `createVoiceProvider`             |
| Voice              | `ai-voice.gradium`           | `createVoiceProvider`             |
| Voice              | `ai-voice.fal`               | `createVoiceProvider`             |
| Open Banking       | `openbanking.powens`         | `createOpenBankingProvider`       |
| Project Management | `project-management.linear`  | `createProjectManagementProvider` |
| Project Management | `project-management.jira`    | `createProjectManagementProvider` |
| Project Management | `project-management.notion`  | `createProjectManagementProvider` |
| Meeting Recorder   | `meeting-recorder.granola`   | `createMeetingRecorderProvider`   |
| Meeting Recorder   | `meeting-recorder.tldv`      | `createMeetingRecorderProvider`   |
| Meeting Recorder   | `meeting-recorder.fireflies` | `createMeetingRecorderProvider`   |
| Meeting Recorder   | `meeting-recorder.fathom`    | `createMeetingRecorderProvider`   |

Notes:

- `src/impls` also exports direct providers such as `GmailInboundProvider`, `GmailOutboundProvider`, and `GoogleCalendarProvider`.
- Those direct providers are available even when you do not use `IntegrationProviderFactory`.

## Per-integration usage map (functions + utilities)

Each integration below lists:

- implementation entrypoint(s)
- how it is created (factory or direct)
- callable function names
- utility modules (when available)

### Payments

#### `payments.stripe`

- Entry: `StripePaymentsProvider` (`src/impls/stripe-payments.ts`)
- Create via factory: `IntegrationProviderFactory.createPaymentsProvider`
- Functions: `createCustomer`, `getCustomer`, `createPaymentIntent`, `capturePayment`, `cancelPaymentIntent`, `refundPayment`, `listInvoices`, `listTransactions`
- Utilities: none

### Email

#### `email.postmark`

- Entry: `PostmarkEmailProvider` (`src/impls/postmark-email.ts`)
- Create via factory: `IntegrationProviderFactory.createEmailOutboundProvider`
- Functions: `sendEmail`
- Utilities: none

#### `email.gmail`

- Entries: `GmailInboundProvider` (`src/impls/gmail-inbound.ts`), `GmailOutboundProvider` (`src/impls/gmail-outbound.ts`)
- Create mode: direct instantiation (not currently wired in `IntegrationProviderFactory`)
- Functions (inbound): `listThreads`, `getThread`, `listMessagesSince`
- Functions (outbound): `sendEmail`
- Utilities: none

### Calendar

#### `calendar.google`

- Entry: `GoogleCalendarProvider` (`src/impls/google-calendar.ts`)
- Create mode: direct instantiation (not currently wired in `IntegrationProviderFactory`)
- Functions: `listEvents`, `createEvent`, `updateEvent`, `deleteEvent`
- Utilities: none

### Analytics

#### `analytics.posthog`

- Entries: `PosthogAnalyticsProvider` (`src/impls/posthog.ts`), `PosthogAnalyticsReader` (`src/impls/posthog-reader.ts`)
- Create via factory: `IntegrationProviderFactory.createAnalyticsProvider`
- Functions (writer): `capture`, `identify`, `callMcpTool`
- Functions (reader/request): `request`, `queryHogQL`, `getEvents`, `getPersons`, `getInsights`, `getInsightResult`, `getCohorts`, `getFeatureFlags`, `getAnnotations`
- Utilities: `normalizeHost`, `buildUrl`, `appendQuery`, `parseJson` (`src/impls/posthog-utils.ts`)

### Vector DB

#### `vectordb.qdrant`

- Entry: `QdrantVectorProvider` (`src/impls/qdrant-vector.ts`)
- Create via factory: `IntegrationProviderFactory.createVectorStoreProvider`
- Functions: `upsert`, `search`, `delete`
- Utilities: none

#### `vectordb.supabase`

- Entry: `SupabaseVectorProvider` (`src/impls/supabase-vector.ts`)
- Create via factory: `IntegrationProviderFactory.createVectorStoreProvider`
- Functions: `upsert`, `search`, `delete`
- Utilities: none

### Database

#### `database.supabase`

- Entry: `SupabasePostgresProvider` (`src/impls/supabase-psql.ts`)
- Create via factory: `IntegrationProviderFactory.createDatabaseProvider`
- Functions: `query`, `execute`, `transaction`, `close`
- Utilities: none

### Storage

#### `storage.gcs`

- Entry: `GoogleCloudStorageProvider` (`src/impls/gcs-storage.ts`)
- Create via factory: `IntegrationProviderFactory.createObjectStorageProvider`
- Functions: `putObject`, `getObject`, `deleteObject`, `generateSignedUrl`, `listObjects`
- Utilities: none

### LLM + Embeddings

#### `ai-llm.mistral`

- Entries: `MistralLLMProvider` (`src/impls/mistral-llm.ts`), `MistralEmbeddingProvider` (`src/impls/mistral-embedding.ts`)
- Create via factory: `createLlmProvider` and `createEmbeddingProvider`
- Functions (LLM): `chat`, `stream`, `countTokens`
- Functions (embeddings): `embedDocuments`, `embedQuery`
- Utilities: none

### Voice

#### `ai-voice.elevenlabs`

- Entry: `ElevenLabsVoiceProvider` (`src/impls/elevenlabs-voice.ts`)
- Create via factory: `IntegrationProviderFactory.createVoiceProvider`
- Functions: `listVoices`, `synthesize`
- Utilities: none

#### `ai-voice.gradium`

- Entry: `GradiumVoiceProvider` (`src/impls/gradium-voice.ts`)
- Create via factory: `IntegrationProviderFactory.createVoiceProvider`
- Functions: `listVoices`, `synthesize`
- Utilities: none

#### `ai-voice.fal`

- Entry: `FalVoiceProvider` (`src/impls/fal-voice.ts`)
- Create via factory: `IntegrationProviderFactory.createVoiceProvider`
- Functions: `listVoices`, `synthesize`
- Utilities: none

### SMS

#### `sms.twilio`

- Entry: `TwilioSmsProvider` (`src/impls/twilio-sms.ts`)
- Create via factory: `IntegrationProviderFactory.createSmsProvider`
- Functions: `sendSms`, `getDeliveryStatus`
- Utilities: none

### Open Banking

#### `openbanking.powens`

- Entry: `PowensOpenBankingProvider` (`src/impls/powens-openbanking.ts`)
- Create via factory: `IntegrationProviderFactory.createOpenBankingProvider`
- Functions: `listAccounts`, `getAccountDetails`, `listTransactions`, `getBalances`, `getConnectionStatus`
- Utilities: Powens client/types from `src/impls/powens-client.ts`

### Project Management

#### `project-management.linear`

- Entry: `LinearProjectManagementProvider` (`src/impls/linear.ts`)
- Create via factory: `IntegrationProviderFactory.createProjectManagementProvider`
- Functions: `createWorkItem`, `createWorkItems`
- Utilities: none

#### `project-management.jira`

- Entry: `JiraProjectManagementProvider` (`src/impls/jira.ts`)
- Create via factory: `IntegrationProviderFactory.createProjectManagementProvider`
- Functions: `createWorkItem`, `createWorkItems`
- Utilities: none

#### `project-management.notion`

- Entry: `NotionProjectManagementProvider` (`src/impls/notion.ts`)
- Create via factory: `IntegrationProviderFactory.createProjectManagementProvider`
- Functions: `createWorkItem`, `createWorkItems`
- Utilities: none

### Meeting Recorder

#### `meeting-recorder.granola`

- Entry: `GranolaMeetingRecorderProvider` (`src/impls/granola-meeting-recorder.ts`)
- Create via factory: `IntegrationProviderFactory.createMeetingRecorderProvider`
- Functions: `listMeetings`, `getMeeting`, `getTranscript`
- Utilities:
  - MCP client: `GranolaMcpClient` (`src/impls/granola-meeting-recorder.mcp.ts`)
  - MCP normalizers: `normalizeMcpListResult`, `normalizeMcpMeeting`, `normalizeMcpTranscript`
  - Types: `src/impls/granola-meeting-recorder.types.ts`

#### `meeting-recorder.tldv`

- Entry: `TldvMeetingRecorderProvider` (`src/impls/tldv-meeting-recorder.ts`)
- Create via factory: `IntegrationProviderFactory.createMeetingRecorderProvider`
- Functions: `listMeetings`, `getMeeting`, `getTranscript`, `parseWebhook`, `verifyWebhook`
- Utilities: none

#### `meeting-recorder.fireflies`

- Entry: `FirefliesMeetingRecorderProvider` (`src/impls/fireflies-meeting-recorder.ts`)
- Create via factory: `IntegrationProviderFactory.createMeetingRecorderProvider`
- Functions: `listMeetings`, `getMeeting`, `getTranscript`, `parseWebhook`, `verifyWebhook`
- Utilities:
  - GraphQL queries: `TRANSCRIPTS_QUERY`, `TRANSCRIPT_QUERY`, `TRANSCRIPT_WITH_SEGMENTS_QUERY` (`src/impls/fireflies-meeting-recorder.queries.ts`)
  - Helpers: `parseSeconds`, `normalizeHeader`, `safeCompareHex` (`src/impls/fireflies-meeting-recorder.utils.ts`)
  - Types: `src/impls/fireflies-meeting-recorder.types.ts`

#### `meeting-recorder.fathom`

- Entry: `FathomMeetingRecorderProvider` (`src/impls/fathom-meeting-recorder.ts`)
- Create via factory: `IntegrationProviderFactory.createMeetingRecorderProvider`
- Functions: `listMeetings`, `getMeeting`, `getTranscript`, `parseWebhook`, `verifyWebhook`, `registerWebhook`
- Utilities:
  - Mapper: `mapFathomMeetingInvites`, `mapFathomMeeting` (`src/impls/fathom-meeting-recorder.mapper.ts`)
  - Helpers: `extractItems`, `extractNextCursor`, `mapInvitee`, `matchRecordingId`, `durationSeconds`, `mapTranscriptSegment`, `parseTimestamp` (`src/impls/fathom-meeting-recorder.utils.ts`)
  - Webhook helpers: `normalizeWebhookHeaders`, `normalizeTriggeredFor` (`src/impls/fathom-meeting-recorder.webhooks.ts`)
  - Types: `src/impls/fathom-meeting-recorder.types.ts`

## Recommended flow (factory-first)

1. Resolve `IntegrationSpec` from `@contractspec/lib.contracts-spec`.
2. Load tenant `IntegrationConnection` from your app config.
3. Resolve secrets with a `SecretProvider` (usually `SecretProviderManager`).
4. Build `IntegrationContext`.
5. Call the matching factory method for that integration category.

### Example: create a payments provider from a tenant connection

```ts
import { IntegrationProviderFactory } from "@contractspec/integration.providers-impls/impls/provider-factory";
import { createDefaultIntegrationSpecRegistry } from "@contractspec/lib.contracts-integrations";
import { SecretProviderManager } from "@contractspec/integration.runtime/secrets/manager";
import { EnvSecretProvider } from "@contractspec/integration.runtime/secrets/env-secret-provider";
import type { IntegrationContext } from "@contractspec/integration.runtime/runtime";

const registry = createDefaultIntegrationSpecRegistry();
const spec = registry.get("payments.stripe", "1.0.0");
if (!spec) {
  throw new Error("Integration spec payments.stripe@1.0.0 not found");
}

const connection = {
  meta: {
    id: "conn_payments_main",
    tenantId: "tenant_acme",
    integrationKey: "payments.stripe",
    integrationVersion: "1.0.0",
    label: "Main Stripe",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ownershipMode: "managed",
  config: {},
  secretProvider: "env",
  secretRef: "env://STRIPE_SECRET_JSON",
  status: "connected",
} as const;

const secretProvider = new SecretProviderManager({
  providers: [{ provider: new EnvSecretProvider(), priority: 100 }],
});

const context: IntegrationContext = {
  tenantId: "tenant_acme",
  appId: "app_console",
  environment: "production",
  slotId: "primaryPayments",
  spec,
  connection,
  secretProvider,
  secretReference: connection.secretRef,
  trace: {
    blueprintName: "payments-blueprint",
    blueprintVersion: 1,
    configVersion: 1,
  },
  config: connection.config,
};

const factory = new IntegrationProviderFactory();
const paymentsProvider = await factory.createPaymentsProvider(context);

await paymentsProvider.createPaymentIntent({
  amount: { amount: 1500, currency: "eur" },
  customerId: "cus_123",
  description: "ContractSpec subscription",
});
```

## Secret payload shape expected by the factory

`IntegrationProviderFactory` reads `secretRef` and parses secret payload as:

- JSON object (recommended), or
- raw string (fallback as `apiKey`).

Examples:

```json
{ "apiKey": "sk_live_..." }
```

```json
{ "serverToken": "postmark_token" }
```

```json
{ "databaseUrl": "postgresql://..." }
```

## Direct provider usage (without factory)

Use direct implementations when you already have typed credentials and do not need `IntegrationContext` routing.

### Example: Gmail + Google Calendar

```ts
import { google } from "googleapis";
import { GmailInboundProvider } from "@contractspec/integration.providers-impls/impls/gmail-inbound";
import { GmailOutboundProvider } from "@contractspec/integration.providers-impls/impls/gmail-outbound";
import { GoogleCalendarProvider } from "@contractspec/integration.providers-impls/impls/google-calendar";

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const gmailInbound = new GmailInboundProvider({ auth });
const gmailOutbound = new GmailOutboundProvider({ auth });
const calendar = new GoogleCalendarProvider({ auth, calendarId: "primary" });

const threads = await gmailInbound.listThreads({ pageSize: 10 });
await gmailOutbound.sendEmail({
  from: { email: "ops@acme.com", name: "Ops" },
  to: [{ email: "team@acme.com" }],
  subject: "Status",
  textBody: `Synced ${threads.length} threads`,
});

await calendar.createEvent({
  calendarId: "primary",
  title: "ContractSpec sync",
  start: new Date(Date.now() + 60 * 60 * 1000),
  end: new Date(Date.now() + 2 * 60 * 60 * 1000),
});
```

## Practical tips

- Use `createDefaultIntegrationSpecRegistry()` as the canonical source of supported integration specs.
- Keep `IntegrationConnection.config` non-secret; put credentials only in the referenced secret payload.
- Prefer `SecretProviderManager` with env overrides first, then cloud secret providers.
- Route by category in your app service layer (payments/email/vector/etc.) and call the matching factory method.
- Cache provider instances at your app boundary when the same connection is reused often.

## Key file references

- `packages/integrations/providers-impls/src/impls/provider-factory.ts`
- `packages/integrations/providers-impls/src/impls/index.ts`
- `packages/integrations/providers-impls/src/impls/gmail-inbound.ts`
- `packages/integrations/providers-impls/src/impls/gmail-outbound.ts`
- `packages/integrations/providers-impls/src/impls/google-calendar.ts`
- `packages/libs/contracts/src/integrations/providers/registry.ts`
