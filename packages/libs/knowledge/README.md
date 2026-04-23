# @contractspec/lib.knowledge

`@contractspec/lib.knowledge` provides the retrieval, ingestion, query, and access-control primitives used to turn documents and external content into searchable knowledge for agents and workflows.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.knowledge`

or

`npm install @contractspec/lib.knowledge`

## What belongs here

This package currently owns four related concerns:

- Retrieval contracts and implementations: `KnowledgeRetriever`, `StaticRetriever`, and `VectorRetriever`.
- Ingestion and indexing pipeline pieces: `DocumentProcessor`, `EmbeddingService`, `VectorIndexer`, and ingestion adapters.
- Retrieval-augmented query flow: `KnowledgeQueryService` and `KnowledgeQueryOptions`.
- Runtime convenience for OSS consumers: `KnowledgeRuntime` and `createKnowledgeRuntime`.
- Access guardrails and localization: `KnowledgeAccessGuard` and the `i18n` surface.

Use this package when you need the knowledge-layer primitives inside ContractSpec. It is not the source of truth for knowledge-space specs, tenant bindings, provider SDKs, or background job orchestration.

## Core workflows

### Quickstart: one runtime for ingest + retrieve + answer

```ts
import { createKnowledgeRuntime } from "@contractspec/lib.knowledge";

const knowledge = createKnowledgeRuntime({
  collection: "knowledge-support-faq",
  namespace: "tenant-acme",
  spaceKey: "support-faq",
  embeddings: embeddingProvider,
  vectorStore: vectorStoreProvider,
  llm: llmProvider,
});

await knowledge.ingestDocument({
  id: "faq-rotate-key",
  mimeType: "text/plain",
  data: new TextEncoder().encode("Rotate API keys from Settings > API."),
  metadata: { locale: "en", category: "canonical" },
});

const snippets = await knowledge.retrieve("How do I rotate a key?", {
  spaceKey: "support-faq",
  tenantId: "tenant-acme",
  locale: "en",
  category: "canonical",
});

const answer = await knowledge.query("How do I rotate a key?", {
  namespace: "tenant-acme",
  filter: { locale: "en" },
});
```

### Ingest documents into a vector index

```ts
import {
  DocumentProcessor,
  EmbeddingService,
  StorageIngestionAdapter,
  VectorIndexer,
} from "@contractspec/lib.knowledge";

const processor = new DocumentProcessor();
const embeddings = new EmbeddingService(embeddingProvider);
const indexer = new VectorIndexer(vectorStoreProvider, {
  collection: "knowledge-docs",
  namespace: "tenant-acme",
});

const adapter = new StorageIngestionAdapter(processor, embeddings, indexer);
await adapter.ingestObject(objectFromStorageProvider);
```

### Run retrieval or RAG queries

```ts
import {
  KnowledgeQueryService,
  createVectorRetriever,
} from "@contractspec/lib.knowledge";

const retriever = createVectorRetriever({
  embeddings: embeddingProvider,
  vectorStore: vectorStoreProvider,
  spaceCollections: {
    "support-faq": "knowledge-support-faq",
  },
});

const snippets = await retriever.retrieve("How do I rotate a key?", {
  spaceKey: "support-faq",
  topK: 3,
  locale: "en",
  category: "canonical",
});

const queryService = new KnowledgeQueryService(
  embeddingProvider,
  vectorStoreProvider,
  llmProvider,
  {
    collection: "knowledge-support-faq",
    namespace: "tenant-acme",
    topK: 5,
  }
);
const answer = await queryService.query("How do I rotate a key?", {
  namespace: "tenant-acme",
  topK: 3,
  filter: { locale: "en" },
});
```

### Use static knowledge for tests or lightweight examples

```ts
import { createStaticRetriever } from "@contractspec/lib.knowledge";

const retriever = createStaticRetriever({
  "product-canon": [
    "Rotate API keys from Settings > API.",
    "Only cite reviewed canon content in answers.",
  ].join("\n"),
});

const snippets = await retriever.retrieve("rotate", {
  spaceKey: "product-canon",
  topK: 1,
});
```

### Localize prompts and access messages

```ts
import { createKnowledgeI18n } from "@contractspec/lib.knowledge/i18n";

const i18n = createKnowledgeI18n("fr");
const noResults = i18n.t("query.noResults");
```

Typical flow:

1. Extract fragments from raw content.
2. Embed fragments and upsert them into a vector collection.
3. Retrieve snippets through a retriever or generate an answer through `KnowledgeQueryService`.
4. Gate reads and writes with `KnowledgeAccessGuard` when operating against resolved knowledge bindings.

## API map

### Retrieval

- `KnowledgeRetriever`: shared retrieval interface for semantic and static retrieval.
- `RetrieverConfig`: shared defaults for retriever implementations.
- `StaticRetriever` and `createStaticRetriever`: in-memory, line-oriented retrieval for simple spaces and tests.
- `VectorRetriever` and `createVectorRetriever`: embedding + vector-store backed retrieval.
- `RetrievalOptions`: query filters such as `spaceKey`, `topK`, `minScore`, `tenantId`, `locale`, `category`, and provider filter metadata.
- `RetrievalResult`: returned content, source, score, and optional metadata.

### Query

- `KnowledgeQueryService`: embed -> search -> prompt -> LLM chat flow for knowledge-backed answers.
- `KnowledgeQueryConfig`: collection, namespace, prompt, filter, `topK`, and locale defaults.
- `KnowledgeQueryOptions`: per-query overrides for namespace, `topK`, filter, locale, and prompt.
- `KnowledgeAnswer`: answer text, references, and optional token usage.

### Ingestion

- `RawDocument`, `DocumentFragment`, and `DocumentProcessor`: extract raw document content into indexable fragments.
- `EmbeddingService`: batch fragment embeddings through an `EmbeddingProvider`.
- `VectorIndexer` and `VectorIndexConfig`: map embeddings to `VectorStoreProvider.upsert()` requests and persist canonical `payload.text` content for later retrieval/query use.
- `GmailIngestionAdapter`: convert email threads into plaintext documents and index them.
- `StorageIngestionAdapter`: fetch object content and run the same process/index pipeline.
- `KnowledgeRuntime` and `createKnowledgeRuntime`: convenience composition for the common ingest -> retrieve -> answer path.

### Guardrails and i18n

- `KnowledgeAccessGuard` and `KnowledgeAccessGuardOptions`: policy-aware checks for read/write/search operations.
- `KnowledgeAccessContext` and `KnowledgeAccessResult`: runtime input/output contracts for access checks.
- `createKnowledgeI18n` and `getDefaultI18n`: localization entrypoints for prompts, guard messages, and ingestion formatting.
- `./i18n`, `./i18n/catalogs/*`, `./i18n/keys`, `./i18n/locale`, and `./i18n/messages`: public i18n subpaths.

## Public entrypoints

The root barrel at `src/index.ts` re-exports public symbols from:

- `./access`
- `./ingestion`
- `./knowledge.feature`
- `./query`
- `./runtime`
- `./retriever`
- `./types`
- `./vector-payload`

Published subpaths from `package.json` are grouped around:

- access: `./access`, `./access/guard`
- retrieval: `./retriever`, `./retriever/interface`, `./retriever/static-retriever`, `./retriever/vector-retriever`
- query: `./query`, `./query/service`
- ingestion: `./ingestion`, `./ingestion/document-processor`, `./ingestion/embedding-service`, `./ingestion/gmail-adapter`, `./ingestion/storage-adapter`, `./ingestion/vector-indexer`
- feature/runtime helpers: `./knowledge.feature`, root `KnowledgeRuntime` / `createKnowledgeRuntime`
- i18n: `./i18n`, `./i18n/catalogs`, `./i18n/catalogs/en`, `./i18n/catalogs/es`, `./i18n/catalogs/fr`, `./i18n/keys`, `./i18n/locale`, `./i18n/messages`
- shared types/helpers: `./types`, `./vector-payload`

Use `package.json` as the exhaustive source of truth for subpaths; the README calls out the clusters that matter most to consumers.

## Operational semantics and gotchas

- `DocumentProcessor` only ships built-in extractors for `text/plain` and `application/json`.
- If no extractor matches, `DocumentProcessor.process()` throws unless you registered a fallback such as `*/*`.
- If an extractor returns no fragments, `DocumentProcessor.process()` returns one empty fragment for the document.
- `EmbeddingService` batches fragments; the default batch size is `16`.
- `StaticRetriever.retrieve()` does simple line-level substring matching. It is not semantic retrieval.
- `StaticRetriever` honors `topK` and `minScore`, but its scores are always `1.0` for matching lines.
- `VectorRetriever.retrieve()` returns `[]` when the requested `spaceKey` is not mapped to a collection.
- `VectorRetriever` uses `tenantId` as the vector-store namespace when provided and automatically merges typed `locale` / `category` filters into the provider filter payload.
- `VectorIndexer.upsert()` stores fragment text under `payload.text`, together with merged fragment/config metadata and `documentId`. Fragment metadata wins over config metadata when keys collide.
- `KnowledgeQueryService` always runs embed -> vector search -> prompt build -> `LLMProvider.chat()`, using indexed `payload.text` as the primary context source and falling back to legacy `payload.content` when needed. Per-query overrides let you change namespace, `topK`, filter, locale, and prompt without rebuilding the service.
- `KnowledgeAccessGuard` defaults to blocking writes to `external` and `ephemeral` knowledge categories.
- `KnowledgeAccessGuard` also blocks writes when `ResolvedKnowledge.space.access.automationWritable` is `false`.
- `KnowledgeAccessGuard` defaults to requiring workflow binding and not requiring agent binding. If a scoped workflow or agent allow-list exists, missing names are denied rather than silently bypassed.
- `GmailIngestionAdapter` converts threads into plaintext and strips HTML when text bodies are missing.
- This package localizes access messages, query prompts, and Gmail formatting through the `i18n` surface.

## When not to use this package

- Do not use it as a vector store implementation.
- Do not use it as an embedding-model implementation.
- Do not use it as a full sync scheduler or background job system.
- Do not use it as the source of truth for `KnowledgeSpaceSpec`, knowledge sources, or tenant bindings.

## Related packages

- `@contractspec/lib.contracts-integrations`: provider interfaces used by vector, embedding, LLM, email, and storage integrations.
- `@contractspec/lib.contracts-spec`: source of knowledge-space specs, resolved bindings, and shared translation helpers.
- `@contractspec/lib.ai-agent`: major consumer of retrieval and query contracts.
- `@contractspec/example.knowledge-canon`: runnable package-level example of binding knowledge spaces and answering through `lib.knowledge`.
- Context-storage modules and bundles in the repo reuse the ingestion pipeline primitives for document indexing flows.

## Local commands

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
