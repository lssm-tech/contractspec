# @contractspec/integration.providers-impls

Website: https://contractspec.io/

SDK-backed implementations of ContractSpec integration provider interfaces.

Depends on:

- `@contractspec/lib.contracts` for provider interface types and IntegrationSpec declarations
- `@contractspec/integration.runtime` for secret/guard helpers (when needed)

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
