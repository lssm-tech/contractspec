# Knowledge Layer

The knowledge layer turns unstructured inputs (uploads, email threads,
notes) into searchable context for agents and workflows. The Pocket
Family Office vertical ships a minimal but production-ready stack that
covers ingestion, indexing, querying, and guardrails.

## Knowledge Spaces

Knowledge is organised via `KnowledgeSpaceSpec` definitions under
`packages/libs/contracts/src/knowledge/spaces`:

- `knowledge.financial-docs` – canonical invoices, bills, and contracts.
- `knowledge.email-threads` – operational Gmail threads.
- `knowledge.support-faq` / `knowledge.product-canon` – reusable shared
  spaces available to any vertical.

Each space defines:

- Ownership metadata (domain, owners, stability tags).
- Retention policy (TTL/archival).
- Access policy (trust level, automation write permissions).
- Indexing configuration (embedding model, chunk size, vector DB slot).

## Sources & Bindings

- `KnowledgeSourceConfig` records tenant-specific connections (bucket,
  Gmail labels, sync cadence). Pocket Family Office provides sample
  configs in `knowledge/sources.sample.ts`.
- `AppKnowledgeBinding` associates spaces with workflows/agents and adds
  per-tenant constraints (rate limits, scopes).

Validation ensures that:

- All referenced spaces exist in the registry.
- At least one source is configured per binding.
- External/ephemeral spaces trigger warnings for policy-sensitive flows.

## Ingestion Pipeline

Implemented in `packages/libs/contracts/src/knowledge/ingestion`:

1. **DocumentProcessor** – pluggable MIME extractors producing
   `DocumentFragment`s.
2. **EmbeddingService** – batches fragments through an `EmbeddingProvider`
   (Mistral in the reference implementation).
3. **VectorIndexer** – upserts fragments into a `VectorStoreProvider`
   (Qdrant in production, with in-memory implementations for tests).
4. **Adapters**
   - `GmailIngestionAdapter`: list threads → convert to raw documents →
     index.
   - `StorageIngestionAdapter`: fetch object from storage provider →
     index.

Background jobs (see `jobs/`) orchestrate ingestion via Cloud Tasks /
Pub/Sub or in-memory workers. Handlers:

- `storage-document-handler` – resolves storage object + indexes.
- `gmail-sync-handler` – syncs threads based on label/date filters.

## Query Service

`KnowledgeQueryService` performs retrieval-augmented generation:

1. Embed the user query using the configured provider.
2. Search the vector store for top-k matches.
3. Compose prompts combining system instructions + contextual snippets.
4. Invoke the LLM provider (Mistral) and return the answer plus
   references and token usage.

The service is designed for tooling: workflows can execute it directly
or through custom operations (see `pfo.summary.generate` contract).

## Guardrails

- Automation can only write to spaces where `automationWritable` is true.
- Canonical spaces default to high trust; external/ephemeral spaces are
  flagged during validation.
- Telemetry captures query volumes per tenant + space.

## Extending

1. Define a new `KnowledgeSpaceSpec` with indexing/retention policies.
2. Add sources pointing to storage providers or APIs.
3. Register adapters if ingestion requires bespoke logic.
4. Reference the space in blueprints (`AppKnowledgeBinding`) and update
   workflows/agents accordingly.

The Pocket Family Office tests (`tests/pocket-family-office.test.ts`)
show how to wire the ingestion pipeline, index a document, and run an
end-to-end knowledge query using in-memory providers.
## Knowledge Spaces & Guardrails

Knowledge surfaces (`KnowledgeSpaceSpec`) describe curated corpora that agents and workflows can consult. Tenant bindings (`AppKnowledgeBinding`) declare which spaces are active, who can use them, and optional usage constraints.

### Binding recap

- `spaceKey` / `spaceVersion`: pointer to the `KnowledgeSpaceSpec`
- `scope.workflows` / `scope.agents`: explicit allow-lists for consumers
- `constraints.maxTokensPerQuery` & `constraints.maxQueriesPerMinute`: throttling knobs for LLM-backed search
- `required`: mark the binding as blocking (defaults to `true`)

At runtime, `ResolvedAppConfig.knowledge` contains `ResolvedKnowledge` entries with the bound space, active sources, and the binding metadata above.

### KnowledgeAccessGuard

`KnowledgeAccessGuard` (`@lssm/lib.contracts/knowledge/runtime`) centralises the access checks that must run before any workflow/agent reads or mutates a knowledge space.

```ts
import { KnowledgeAccessGuard } from '@lssm/lib.contracts/knowledge/runtime';

const guard = new KnowledgeAccessGuard({
  disallowWriteCategories: ['external', 'ephemeral'], // default
  requireWorkflowBinding: true,
  requireAgentBinding: false,
});

const result = guard.checkAccess(resolvedKnowledge, {
  tenantId,
  appId,
  workflowName: 'order-processing',
  operation: 'read', // or 'write' / 'search'
}, resolvedAppConfig);

if (!result.allowed) {
  throw new Error(result.reason);
}
```

Key behaviours:

- **Binding**: rejects access when the space is not present in the resolved tenant config.
- **Category guardrails**: blocks writes to `external` and `ephemeral` spaces by default; allows reads but emits warnings for `ephemeral`.
- **Workflow/agent scoping**: when `requireWorkflowBinding` or `requireAgentBinding` is enabled, only explicitly authorised consumers may access the space.

Use the guard inside workflow operations or agent resolvers to guarantee multi-tenant isolation and honour data governance rules.

