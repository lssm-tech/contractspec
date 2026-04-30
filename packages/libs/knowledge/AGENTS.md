# AI Agent Guide — `@contractspec/lib.knowledge`

Scope: `packages/libs/knowledge/*`

Mission: keep `@contractspec/lib.knowledge` small, predictable, and source-accurate. This package owns retrieval contracts, ingestion/indexing primitives, knowledge query flow, access guardrails, and package-local i18n for those behaviors.

## Public surface

Treat these clusters as compatibility surface:

- `./access`
- `./ingestion`
- `./governance`
- `./query`
- `./retriever`
- `./i18n`
- `./types`

Stable APIs readers are likely to depend on:

- `KnowledgeRetriever`, `RetrieverConfig`
- `RetrievalOptions`, `RetrievalResult`
- `StaticRetriever`, `createStaticRetriever`
- `VectorRetriever`, `createVectorRetriever`
- `KnowledgeQueryService`, `KnowledgeQueryConfig`, `KnowledgeAnswer`
- `KnowledgeAccessGuard`, `KnowledgeAccessGuardOptions`
- `KnowledgeAccessContext`, `KnowledgeAccessResult`
- `RawDocument`, `DocumentFragment`, `DocumentProcessor`
- `EmbeddingService`
- `VectorIndexer`, `VectorIndexConfig`
- `GmailIngestionAdapter`, `DriveIngestionAdapter`, `StorageIngestionAdapter`
- `KnowledgeRuntime`, `createKnowledgeRuntime`
- `KnowledgeMutationRequest`, `KnowledgeMutationGovernance`, `KnowledgeMutationResult`
- `evaluateKnowledgeMutationGovernance`, `executeGovernedKnowledgeMutation`
- `createKnowledgeI18n`, `getDefaultI18n`, locale/catalog exports

## Change boundaries

- Exported retriever, query, ingestion, access, i18n, and shared types are compatibility surface.
- Keep `package.json` exports and published docs aligned with source.
- Do not document capabilities that are not implemented in `src/`.
- Prefer additive changes over breaking changes.
- If a public subpath moves or changes shape, update both workspace exports and `publishConfig.exports`.

## Package invariants

- `KnowledgeRetriever` method shape and semantics must stay stable across implementations.
- `RetrievalResult` and `RetrievalOptions` remain broadly compatible for AI consumers and higher-level orchestration libs.
- Ingestion should stay deterministic enough to rerun safely with stable fragment IDs and stable document-derived metadata.
- Drive/Gmail orchestration should preserve provider delta state and skip tombstoned provider records before indexing.
- Mutation governance should keep dry-run, approval refs, idempotency, audit evidence, and outbound-send gates explicit.
- `KnowledgeAccessGuard` behavior must stay aligned with `ResolvedKnowledge` and `ResolvedAppConfig` semantics from `@contractspec/lib.contracts-spec`.
- `KnowledgeQueryService` answer shape stays `answer`, `references`, and optional `usage`.
- i18n keys and catalogs must stay synchronized across locales.
- Query and guard messages are part of package behavior; do not silently remove localization paths.

## Editing guidance by area

### Retriever

- Preserve `supportsSpace()`, `listSpaces()`, `getStatic()`, and empty-result behavior.
- Keep `StaticRetriever` intentionally simple; do not document it as semantic retrieval.
- Treat changes to `VectorRetriever` filtering, namespace handling, or payload extraction as compatibility work.

### Query

- Keep prompt construction and reference formatting explainable and deterministic.
- Preserve `KnowledgeAnswer.references` shape unless consumers are updated in lockstep.
- If locale or prompt defaults change, update docs and tests together.

### Access

- Keep default write restrictions and binding checks deliberate.
- Update docs and tests whenever defaults or denial/warning semantics change.
- Remember that workflow binding is required by default and agent binding is not.

### Ingestion

- Protect fragment IDs, MIME handling, batching behavior, and upsert semantics.
- New extractors should be explicit and documented.
- Keep adapters as thin orchestration layers over processor -> embeddings -> indexer.
- Do not put credential refresh, scheduler ownership, or provider SDK retry logic in this package; those belong in integrations/runtime layers.

### Mutation governance

- Preserve dry-run semantics: dry-run plans must not execute the mutation callback.
- Non-dry-run mutations must keep explicit idempotency and audit evidence requirements.
- Outbound-send gates should fail closed unless explicitly approved.

### i18n

- Update all catalogs and i18n tests together.
- Keep keys synchronized across locales.
- Do not add user-visible strings in this package without routing them through the i18n surface.

## Docs maintenance rules

- If exports or behavior semantics change, update `README.md`.
- If invariants, compatibility hotspots, or editing risks change, update `AGENTS.md`.
- Keep examples accurate to real imports and current behavior.
- Do not copy large app-config or contracts-spec governance docs into this package's docs.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
- Confirm `README.md` examples still match exported imports and current semantics.
- Confirm `package.json` exports still match the documented public surface.
