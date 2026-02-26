# @contractspec/integration.providers-impls

Website: https://contractspec.io/

SDK-backed implementations of ContractSpec integration provider interfaces.

Depends on:

- `@contractspec/lib.contracts-spec` for provider interface types and IntegrationSpec declarations
- `@contractspec/integration.runtime` for secret/guard helpers (when needed)

## PostHog analytics

This package ships a PostHog analytics provider:

- `analytics.posthog` via `PosthogAnalyticsProvider`

Connection config example:

```json
{
  "host": "https://app.posthog.com",
  "projectId": "12345",
  "mcpUrl": "https://your-mcp-endpoint"
}
```

Secret payload example (`secretRef` target value):

```json
{
  "personalApiKey": "phx_personal_api_key",
  "projectApiKey": "phc_project_api_key"
}
```

Factory usage:

```ts
import { IntegrationProviderFactory } from "@contractspec/integration.providers-impls/impls/provider-factory";

const factory = new IntegrationProviderFactory();
const analytics = await factory.createAnalyticsProvider(context); // key: analytics.posthog
```

## Health integrations

This package ships health/wearables providers routed by a transport strategy:

- Official provider APIs/MCP (Whoop, Apple Health bridge, Oura, Strava, Garmin, Fitbit)
- Aggregator API/MCP (Open Wearables)
- Unofficial automation fallback (opt-in and allow-list gated)

Factory usage:

```ts
import { IntegrationProviderFactory } from "@contractspec/integration.providers-impls/impls/provider-factory";

const factory = new IntegrationProviderFactory();
const healthProvider = await factory.createHealthProvider(context); // key: health.*
```

Connection config example:

```json
{
  "defaultTransport": "official-api",
  "strategyOrder": [
    "official-api",
    "official-mcp",
    "aggregator-api",
    "aggregator-mcp",
    "unofficial"
  ],
  "allowUnofficial": false,
  "unofficialAllowList": ["health.peloton"],
  "apiBaseUrl": "https://api.provider.example",
  "mcpUrl": "https://mcp.provider.example"
}
```

Secret payload example (`secretRef` target value):

```json
{
  "apiKey": "provider-api-key",
  "accessToken": "oauth-access-token",
  "mcpAccessToken": "mcp-access-token",
  "webhookSecret": "webhook-signature-secret"
}
```

Notes:

- Unofficial routing is disabled unless `allowUnofficial: true`.
- When `unofficialAllowList` is provided, only listed `health.*` keys can use unofficial routing.
- If a selected strategy is unavailable, the resolver falls through `strategyOrder`.

## Supabase integrations

This package now ships two Supabase providers:

- `vectordb.supabase` via `SupabaseVectorProvider`
- `database.supabase` via `SupabasePostgresProvider`

Both providers are available through `IntegrationProviderFactory` and can also be instantiated directly.

### 1) Connection shapes

#### Vector store (`vectordb.supabase`)

`IntegrationConnection.config` example:

```json
{
  "schema": "public",
  "table": "contractspec_vectors",
  "createTableIfMissing": true,
  "distanceMetric": "cosine",
  "maxConnections": 5,
  "sslMode": "require"
}
```

Secret payload example (`secretRef` target value):

```json
{
  "databaseUrl": "postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"
}
```

#### Database (`database.supabase`)

`IntegrationConnection.config` example:

```json
{
  "maxConnections": 10,
  "sslMode": "require"
}
```

Secret payload example (`secretRef` target value):

```json
{
  "databaseUrl": "postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"
}
```

### 2) Factory usage

```ts
import { IntegrationProviderFactory } from "@contractspec/integration.providers-impls/impls/provider-factory";

const factory = new IntegrationProviderFactory();

const vectorProvider = await factory.createVectorStoreProvider(vectorContext); // key: vectordb.supabase
const dbProvider = await factory.createDatabaseProvider(databaseContext); // key: database.supabase
```

### 3) Direct provider usage

```ts
import { SupabaseVectorProvider } from "@contractspec/integration.providers-impls/impls/supabase-vector";
import { SupabasePostgresProvider } from "@contractspec/integration.providers-impls/impls/supabase-psql";

const vector = new SupabaseVectorProvider({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  schema: "public",
  table: "contractspec_vectors",
  distanceMetric: "cosine",
});

const database = new SupabasePostgresProvider({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  maxConnections: 10,
  sslMode: "require",
});
```

### 4) Notes

- `SupabaseVectorProvider` creates `vector` extension/table/indexes automatically when `createTableIfMissing=true`.
- `SupabaseVectorProvider` maps scores from pgvector distances (`cosine`, `l2`, `inner_product`) to `VectorSearchResult.score`.
- `SupabasePostgresProvider` supports `$1`, `$2`, ... placeholders, transactions, and clean connection shutdown through `close()`.
