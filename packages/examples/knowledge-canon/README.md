### Knowledge Example – Product Canon Space

Website: https://contractspec.io/


This example demonstrates how to bind the Product Canon `KnowledgeSpaceSpec` to a tenant and surface it to agents/workflows.

Included assets:

- `blueprint.ts` – `AppBlueprintSpec` that references an FAQ workflow depending on the Product Canon space.
- `tenant.ts` – `TenantAppConfig` binding the canonical knowledge space to the workflow and a `productSupportAssistant` agent.
- `source.sample.ts` – illustrative `KnowledgeSourceConfig` for syncing a Notion database into the canonical corpus.
- `agent.ts` – helper illustrating how to pick knowledge bindings from a `ResolvedAppConfig` at runtime.

Usage sketch:

1. Register the knowledge space spec (`knowledge.product-canon`) via `KnowledgeSpaceRegistry`.
2. Persist the Notion source through the knowledge CRUD contracts (`knowledge.source.create`).
3. Compose the app configuration and pass the `ResolvedAppConfig` to your workflow runner / agent runtime.
4. Use helpers similar to `selectKnowledgeBindings` to scope which spaces can answer a given request before dispatching to embedding/vector services.







