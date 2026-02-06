### Integration Example - Supabase Vector + Postgres

Website: https://contractspec.io/

This example shows how to wire two Supabase integrations together:

- `vectordb.supabase` for embedding storage and similarity search.
- `database.supabase` for SQL reads/writes and transactional workloads.

Included files:

- `blueprint.ts` - App blueprint with two integration slots (`primary-vector-db`, `primary-database`).
- `tenant.ts` - Tenant config binding both slots to concrete connections.
- `connection.sample.ts` - Sample `IntegrationConnection` records for both Supabase providers.
- `runtime.sample.ts` - Runtime sample using `IntegrationProviderFactory` to create and execute both providers.

## Quick start

1. Register integration specs (includes `vectordb.supabase` and `database.supabase`) from `createDefaultIntegrationSpecRegistry()`.
2. Persist the sample connections from `connection.sample.ts` via the integrations CRUD flow.
3. Publish the tenant config from `tenant.ts` and ensure slot bindings match your connection IDs.
4. Use the runtime sample to upsert/search vectors and run SQL queries with the same Supabase project.

## Secret payload format

Both connections expect a `databaseUrl` secret value.

```json
{
  "databaseUrl": "postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"
}
```

## Notes

- Vector provider auto-creates pgvector extension/table/indexes when `createTableIfMissing=true`.
- Keep non-secret settings in `config`; store credentials only in `secretRef`.
- The runtime sample is intentionally framework-neutral so it can be reused in API apps, jobs, or workers.
