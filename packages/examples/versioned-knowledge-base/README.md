# `@lssm/example.versioned-knowledge-base`

Spec-first example demonstrating a **curated, versioned knowledge base**:

- Raw **source documents** are immutable and referenced by hash.
- Curated **rules** are versioned, reviewable, and must cite sources.
- Published **KB snapshots** contain only **approved** rule versions.
- Assistant answers reference a **snapshot id** for traceability.

## Contracts

- `kb.ingestSource(docMeta, fileRef) -> SourceDocument`
- `kb.upsertRuleVersion(ruleId, content, sourceRefs) -> RuleVersion (draft)`
- `kb.approveRuleVersion(ruleVersionId, approver) -> RuleVersion (approved)`
- `kb.publishSnapshot(jurisdiction, asOfDate) -> KBSnapshot`
- `kb.search(snapshotId, query) -> results (ruleVersionIds + citations)`

## Running tests

```bash
bun test
```





